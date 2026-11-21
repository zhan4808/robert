"use client";

import Image, { type StaticImageData } from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { lineGlyph, MONO, noise, shorelineMask, tileSize, TILE_GLYPHS } from "./pond-surface";

type Props = {
    src: string | StaticImageData;
    alt: string;
    /** Width over height of the frame; the photo is cropped to fill it. */
    ratio: number;
    sizes?: string;
    priority?: boolean;
    className?: string;
    /** Tiles of shoreline at the edge; 0 for a straight edge. */
    shore?: number;
    blurDataURL?: string;
};

// How fast the surfacing ripple spreads, in px/s, and how wide its ring of glyphs is.
const RIPPLE_SPEED = 520;
const RING = 26;
// The cursor turns the surface back into tiles within this radius; they settle again at this rate per second.
const STIR_RADIUS = 52;
const SETTLE = 2.2;

/**
 * A photo that surfaces from the pond. It first appears as the tiles the koi are drawn with, each tile the photo's
 * colour at that spot with a glyph etched by its brightness; when it scrolls into view a ripple spreads across it
 * and the photo comes up through the water behind the ring. Moving the cursor over it stirs the surface back into
 * tiles for a moment. The frame ends in the same shoreline of scattered tiles as the koi banner.
 */
export default function PondImage({ src, alt, ratio, sizes, priority, className, shore = 3, blurDataURL }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [mask, setMask] = useState("");
    const [loaded, setLoaded] = useState(false);
    const isDark = useTheme().resolvedTheme === "dark";
    const darkRef = useRef(isDark);
    useEffect(() => {
        darkRef.current = isDark;
    }, [isDark]);

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
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let W = 0;
        let H = 0;
        let cw = 8;
        let ch = 10;
        let cols = 0;
        let rows = 0;
        let colors = new Uint8ClampedArray(0);
        let lum = new Float32Array(0);
        // Cells the surfacing ripple hasn't reached yet (1), and how stirred each cell is by the cursor (0..1).
        let under = new Uint8Array(0);
        let stirred = new Float32Array(0);
        let raf = 0;
        let last = 0;
        let revealAt = -1;
        let origin = { x: 0, y: 0 };
        const stir = { x: 0, y: 0, active: false };

        const sample = () => {
            const rect = wrap.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            if (W < 1 || H < 1) return false;
            ({ cw, ch } = tileSize(Math.max(W, 500)));
            cols = Math.ceil(W / cw);
            rows = Math.ceil(H / ch);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Average the photo per tile by drawing it, cropped as object-cover crops it, at one pixel per tile.
            const off = document.createElement("canvas");
            off.width = cols;
            off.height = rows;
            const octx = off.getContext("2d", { willReadFrequently: true });
            if (!octx) return false;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const scale = Math.max((cols * cw) / iw, (rows * ch) / ih);
            const sw = (cols * cw) / scale;
            const sh = (rows * ch) / scale;
            octx.imageSmoothingQuality = "high";
            octx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, cols, rows);
            try {
                colors = octx.getImageData(0, 0, cols, rows).data;
            } catch {
                return false;
            }
            lum = new Float32Array(cols * rows);
            for (let i = 0; i < cols * rows; i++) {
                lum[i] = (0.2126 * colors[i * 4] + 0.7152 * colors[i * 4 + 1] + 0.0722 * colors[i * 4 + 2]) / 255;
            }
            if (under.length !== cols * rows) {
                under = new Uint8Array(cols * rows).fill(revealAt < 0 && !still ? 1 : 0);
                stirred = new Float32Array(cols * rows);
            }
            if (shore > 0) setMask(shorelineMask(W, H, cw, ch, shore, 5).url);
            return true;
        };

        const draw = (t: number) => {
            ctx.clearRect(0, 0, W, H);
            const paper = darkRef.current ? [23, 22, 20] : [246, 243, 236];
            const ink = darkRef.current ? [243, 238, 230] : [37, 34, 29];
            ctx.font = `600 ${Math.round(ch * 0.7)}px ${MONO}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const radius = revealAt < 0 ? -1 : Math.max(0, t - revealAt) * RIPPLE_SPEED;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    const cx = c * cw + cw / 2;
                    const cy = r * ch + ch / 2;
                    let ring = 0;
                    if (radius >= 0) {
                        // The front wanders a little, so the ring reads as water, not a compass circle.
                        const d = Math.hypot(cx - origin.x, cy - origin.y) + (noise(c * 0.2, r * 0.25, 9) - 0.5) * 30;
                        if (d < radius - RING) under[i] = 0;
                        ring = Math.max(0, 1 - Math.abs(d - radius + RING / 2) / (RING / 2));
                    }
                    const a = under[i] ? 1 : stirred[i];
                    if (a > 0.02) {
                        const R = colors[i * 4];
                        const G = colors[i * 4 + 1];
                        const B = colors[i * 4 + 2];
                        // The tile: the photo's colour, a touch washed toward the paper so the etched glyph reads.
                        ctx.globalAlpha = a;
                        ctx.fillStyle = `rgb(${(R * 0.86 + paper[0] * 0.14) | 0},${(G * 0.86 + paper[1] * 0.14) | 0},${(B * 0.86 + paper[2] * 0.14) | 0})`;
                        ctx.fillRect(c * cw, r * ch, cw, ch);
                        const g = TILE_GLYPHS[Math.min(TILE_GLYPHS.length - 1, Math.floor((1 - lum[i]) * TILE_GLYPHS.length))];
                        if (g !== " ") {
                            const k = lum[i] > 0.55 ? 0.55 : 1.45;
                            ctx.globalAlpha = a * 0.55;
                            ctx.fillStyle = `rgb(${Math.min(255, R * k) | 0},${Math.min(255, G * k) | 0},${Math.min(255, B * k) | 0})`;
                            ctx.fillText(g, cx, cy + 0.5);
                        }
                    }
                    if (ring > 0.05) {
                        ctx.globalAlpha = ring * 0.7;
                        ctx.fillStyle = `rgb(${ink[0]},${ink[1]},${ink[2]})`;
                        ctx.fillText(lineGlyph(cx - origin.x, cy - origin.y), cx, cy + 0.5);
                    }
                }
            }
            ctx.globalAlpha = 1;
            // Done once the ring has left the frame; before the reveal starts there is nothing to animate.
            return revealAt < 0 || radius > Math.hypot(W, H) + RING * 2;
        };

        const frame = (now: number) => {
            const t = now / 1000;
            const dt = last ? Math.min(0.05, t - last) : 0;
            last = t;
            let busy = false;
            // Stirred tiles settle back into the photo.
            for (let i = 0; i < stirred.length; i++) {
                if (stirred[i] > 0) {
                    stirred[i] = Math.max(0, stirred[i] - dt * SETTLE);
                    busy = true;
                }
            }
            if (stir.active) {
                busy = true;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const d = Math.hypot(c * cw + cw / 2 - stir.x, r * ch + ch / 2 - stir.y);
                        if (d < STIR_RADIUS) {
                            const i = r * cols + c;
                            stirred[i] = Math.max(stirred[i], 0.85 * (1 - d / STIR_RADIUS) ** 0.6);
                        }
                    }
                }
                stir.active = false;
            }
            const rippleDone = draw(t);
            if (busy || !rippleDone) raf = requestAnimationFrame(frame);
            else raf = 0;
        };

        const wake = () => {
            if (!raf) {
                last = 0;
                raf = requestAnimationFrame(frame);
            }
        };

        if (!sample()) return;
        if (still) {
            draw(0);
        } else {
            draw(performance.now() / 1000);
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || revealAt >= 0 || still) return;
                origin = { x: W * (0.3 + noise(cols, rows, 1) * 0.4), y: H * (0.35 + noise(rows, cols, 2) * 0.3) };
                revealAt = performance.now() / 1000 + 0.15;
                wake();
                io.disconnect();
            },
            { threshold: 0.35 }
        );
        io.observe(wrap);

        const onMove = (e: PointerEvent) => {
            if (revealAt < 0 || still || e.pointerType === "touch") return;
            const rect = wrap.getBoundingClientRect();
            stir.x = e.clientX - rect.left;
            stir.y = e.clientY - rect.top;
            stir.active = true;
            wake();
        };
        const ro = new ResizeObserver(() => {
            if (sample()) {
                draw(performance.now() / 1000);
                wake();
            }
        });
        ro.observe(wrap);
        wrap.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            wrap.removeEventListener("pointermove", onMove);
        };
    }, [loaded, shore]);

    const maskStyle = mask
        ? { maskImage: `url(${mask})`, WebkitMaskImage: `url(${mask})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }
        : undefined;

    return (
        <div
            ref={wrapRef}
            className={cn("relative w-full overflow-hidden", className)}
            style={{ aspectRatio: ratio, ...maskStyle }}
        >
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
                className="object-cover"
            />
            <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
    );
}
