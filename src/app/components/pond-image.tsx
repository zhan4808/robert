"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type Props = {
    src: string | StaticImageData;
    alt: string;
    /** Width over height of the frame; the photo is cropped to fill it. */
    ratio: number;
    sizes?: string;
    priority?: boolean;
    className?: string;
    blurDataURL?: string;
};

/*
 * A photo that is painted before it is shown.
 *
 * When it scrolls into view, a canvas under the photo is painted in three passes, the way a painter blocks in a
 * picture: broad strokes of the photo's colours over everything, then medium ones, then fine ones only where the photo
 * has edges. Each stroke starts on a grid point, takes the photo's colour there and travels along the edge it sits on
 * (perpendicular to the brightness gradient) until the colour under it changes, so the brushwork follows the forms. A
 * stroke is laid down as a few bristles, each a shade off, so it reads as paint rather than a felt-tip line. Once the
 * painting is down, the photo fades in over it; hovering thins the photo a little, so the brushwork shows through.
 *
 * Plain Canvas 2D, nothing to load. With reduced motion, it's just the photo.
 */

// Brush radius as a fraction of the frame's long side, the edge strength a stroke needs to be painted, and opacity.
const PASSES = [
    { radius: 0.03, detail: 0, alpha: 0.92 },
    { radius: 0.015, detail: 0.025, alpha: 0.92 },
    { radius: 0.0075, detail: 0.06, alpha: 0.95 },
];
const PAINT_MS = 1600;
// Working resolution of the sampled photo, on its long side.
const WORK = 220;

type Stroke = { pts: number[]; r: number; nx: number; ny: number; colors: string[]; alpha: number };

/** A tiny deterministic generator, so a photo is painted the same way every time. */
function rng(seed: number) {
    let s = seed >>> 0 || 1;
    return () => {
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;
        return (s >>> 0) / 4294967296;
    };
}

function planStrokes(img: HTMLImageElement, w: number, h: number): Stroke[] {
    // Sample the photo, cropped as object-cover crops it.
    const scale = WORK / Math.max(w, h);
    const sw = Math.max(8, Math.round(w * scale));
    const sh = Math.max(8, Math.round(h * scale));
    const off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    const o = off.getContext("2d", { willReadFrequently: true });
    if (!o) return [];
    const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const cw = w / k;
    const ch = h / k;
    o.drawImage(img, (img.naturalWidth - cw) / 2, (img.naturalHeight - ch) / 2, cw, ch, 0, 0, sw, sh);
    let px: Uint8ClampedArray;
    try {
        px = o.getImageData(0, 0, sw, sh).data;
    } catch {
        return [];
    }

    // Luminance, softened with a 3x3 box so the gradient follows forms rather than grain.
    const raw = new Float32Array(sw * sh);
    for (let i = 0; i < sw * sh; i++)
        raw[i] = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
    const lum = new Float32Array(sw * sh);
    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            let sum = 0;
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    sum += raw[Math.min(sh - 1, Math.max(0, y + j)) * sw + Math.min(sw - 1, Math.max(0, x + i))];
                }
            }
            lum[y * sw + x] = sum / 9;
        }
    }
    const at = (x: number, y: number) =>
        Math.min(sh - 1, Math.max(0, Math.round(y))) * sw + Math.min(sw - 1, Math.max(0, Math.round(x)));
    const L = (x: number, y: number) => lum[at(x, y)];
    // Sobel gradient at a point in working pixels.
    const grad = (x: number, y: number) => {
        const gx =
            L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x - 1, y) - L(x - 1, y + 1);
        const gy =
            L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x, y - 1) - L(x + 1, y - 1);
        return [gx / 4, gy / 4];
    };
    const rgb = (x: number, y: number) => {
        const i = at(x, y) * 4;
        return [px[i], px[i + 1], px[i + 2]];
    };

    const rand = rng(sw * 73856093 + sh * 19349663 + px[0] * 83492791 + px[px.length >> 1] * 2654435761);
    const strokes: Stroke[] = [];
    const long = Math.max(w, h);

    for (const pass of PASSES) {
        const r = Math.max(1.2, pass.radius * long);
        const step = r * 1.2;
        const layer: Stroke[] = [];
        for (let gy0 = step / 2; gy0 < h; gy0 += step) {
            for (let gx0 = step / 2; gx0 < w; gx0 += step) {
                let x = gx0 + (rand() - 0.5) * step;
                let y = gy0 + (rand() - 0.5) * step;
                const [g0x, g0y] = grad(x * scale, y * scale);
                if (Math.hypot(g0x, g0y) < pass.detail) continue;
                const c = rgb(x * scale, y * scale);
                // Travel along the edge, a radius at a time, until the colour underneath departs from the stroke's own.
                const pts = [x, y];
                let pdx = 0;
                let pdy = 0;
                const maxSteps = 3 + Math.floor(rand() * 5);
                for (let n = 0; n < maxSteps; n++) {
                    const [gx, gy] = grad(x * scale, y * scale);
                    let dx = -gy;
                    let dy = gx;
                    const m = Math.hypot(dx, dy);
                    if (m < 0.004) {
                        // No edge to follow: carry on as before, or lie at a loose diagonal like a hand would.
                        if (pdx || pdy) {
                            dx = pdx;
                            dy = pdy;
                        } else {
                            const a = -0.5 + (rand() - 0.5) * 0.7;
                            dx = Math.cos(a);
                            dy = Math.sin(a);
                        }
                    } else {
                        dx /= m;
                        dy /= m;
                    }
                    if (dx * pdx + dy * pdy < 0) {
                        dx = -dx;
                        dy = -dy;
                    }
                    // Smooth the turn, so strokes curve rather than kink.
                    if (pdx || pdy) {
                        dx = dx * 0.6 + pdx * 0.4;
                        dy = dy * 0.6 + pdy * 0.4;
                        const mm = Math.hypot(dx, dy) || 1;
                        dx /= mm;
                        dy /= mm;
                    }
                    x += dx * r;
                    y += dy * r;
                    if (x < -r || y < -r || x > w + r || y > h + r) break;
                    const here = rgb(x * scale, y * scale);
                    const diff = Math.abs(here[0] - c[0]) + Math.abs(here[1] - c[1]) + Math.abs(here[2] - c[2]);
                    if (n >= 1 && diff > 54) break;
                    pts.push(x, y);
                    pdx = dx;
                    pdy = dy;
                }
                if (pts.length < 4) {
                    const a = -0.5 + (rand() - 0.5) * 0.7;
                    pts.push(x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5);
                }
                // The bristles sit side by side across the stroke's start direction, each a shade off the colour.
                const sx = pts[2] - pts[0];
                const sy = pts[3] - pts[1];
                const sm = Math.hypot(sx, sy) || 1;
                const colors: string[] = [];
                for (let b = 0; b < 3; b++) {
                    const v = 0.93 + rand() * 0.14;
                    colors.push(
                        `rgb(${Math.min(255, Math.round(c[0] * v))},${Math.min(255, Math.round(c[1] * v))},${Math.min(255, Math.round(c[2] * v))})`
                    );
                }
                layer.push({ pts, r, nx: -sy / sm, ny: sx / sm, colors, alpha: pass.alpha });
            }
        }
        // Within a pass, strokes go down in a shuffled order, so the picture comes up everywhere at once.
        for (let i = layer.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [layer[i], layer[j]] = [layer[j], layer[i]];
        }
        strokes.push(...layer);
    }
    return strokes;
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
    const { pts, r, nx, ny, colors } = s;
    // A body for coverage, then three bristles over it.
    ctx.globalAlpha = s.alpha * 0.7;
    ctx.strokeStyle = colors[1];
    ctx.lineWidth = r * 1.7;
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.stroke();
    ctx.globalAlpha = s.alpha;
    ctx.lineWidth = r * 0.75;
    for (let b = 0; b < 3; b++) {
        const off = (b - 1) * r * 0.62;
        ctx.strokeStyle = colors[b];
        ctx.beginPath();
        ctx.moveTo(pts[0] + nx * off, pts[1] + ny * off);
        for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i] + nx * off, pts[i + 1] + ny * off);
        ctx.stroke();
    }
}

export default function PondImage({ src, alt, ratio, sizes, priority, className, blurDataURL }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);
    // "idle": nothing painted yet; "painting": strokes going down; "shown": the photo has faded in over the paint.
    const [stage, setStage] = useState<"idle" | "painting" | "shown">("idle");

    // A cached photo can finish loading before hydration attaches onLoad.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete && img.naturalWidth > 0) setLoaded(true);
    }, []);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const img = imgRef.current;
        const ctx = canvas?.getContext("2d");
        if (!wrap || !canvas || !img || !ctx || !loaded) return;
        let raf = 0;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            raf = requestAnimationFrame(() => setStage("shown"));
            return () => cancelAnimationFrame(raf);
        }

        let cancelled = false;
        const paint = () => {
            const { width: w, height: h } = wrap.getBoundingClientRect();
            if (w < 1 || h < 1) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            const strokes = planStrokes(img, w, h);
            if (!strokes.length) {
                setStage("shown");
                return;
            }
            setStage("painting");
            const start = performance.now();
            let drawn = 0;
            const frame = (now: number) => {
                if (cancelled) return;
                // Ease out, so the broad strokes land quickly and the fine work takes its time.
                const t = Math.min(1, (now - start) / PAINT_MS);
                const target = Math.round(strokes.length * (1 - (1 - t) ** 2.2));
                for (; drawn < target; drawn++) drawStroke(ctx, strokes[drawn]);
                if (t < 1) raf = requestAnimationFrame(frame);
                else {
                    ctx.globalAlpha = 1;
                    setStage("shown");
                }
            };
            raf = requestAnimationFrame(frame);
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                paint();
            },
            { threshold: 0.25 }
        );
        io.observe(wrap);
        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            io.disconnect();
        };
    }, [loaded]);

    return (
        <div
            ref={wrapRef}
            className={cn("group/photo relative w-full overflow-hidden rounded-[2px] bg-tile", className)}
            style={{ aspectRatio: ratio }}
        >
            <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                fill
                sizes={sizes ?? "(min-width: 768px) 42rem, 100vw"}
                priority={priority}
                placeholder={blurDataURL || typeof src !== "string" ? "blur" : "empty"}
                blurDataURL={blurDataURL}
                onLoad={() => setLoaded(true)}
                className={cn(
                    "object-cover transition-opacity ease-out",
                    // Hidden while the canvas paints; then a slow fade in over the paint. Hovering thins it a little.
                    stage === "shown"
                        ? "opacity-100 duration-[1200ms] group-hover/photo:opacity-[0.78] group-hover/photo:duration-500"
                        : "opacity-0 duration-0"
                )}
            />
        </div>
    );
}
