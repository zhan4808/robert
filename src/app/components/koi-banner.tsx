"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import KoiPond, { type PondStats } from "./koi-pond/koi-pond";
import { MONO, noise, pondMask, tileSize } from "./pond-surface";

type Rgb = [number, number, number];
const WATER: Record<"light" | "dark", { wash: Rgb; glint: Rgb }> = {
    light: { wash: [46, 104, 118], glint: [36, 92, 108] },
    dark: { wash: [116, 158, 184], glint: [168, 204, 222] },
};
// Below this the water keeps its wash but draws no glint.
const GLINT = 0.8;
// The water redraws at this rate; caustics drift slowly, and the koi canvas runs at full rate on its own.
const WATER_FPS = 30;

/**
 * The home page's banner: the koi pond, cut to a band the width of the column. The pond's edge is a shoreline of
 * scattered tiles on the same grid the koi are drawn on, and the water is a faint tiled surface with caustic glints
 * drifting across it. Clicking the water feeds the koi; the counts sit under the banner.
 */
export default function KoiBanner() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const waterRef = useRef<HTMLCanvasElement>(null);
    const [mask, setMask] = useState("");
    const [stats, setStats] = useState<PondStats>({ koi: 0, pellets: 0 });
    // The koi steer by the pond's outline, read through a ref so a resize reshapes the pond without restocking it.
    const outlineRef = useRef<(x: number, y: number) => number>(() => -1);
    const stocking = useMemo(
        () => ({ scale: 0.8, count: 3, outline: (x: number, y: number) => outlineRef.current(x, y) }),
        []
    );
    const isDark = useTheme().resolvedTheme === "dark";
    const themeRef = useRef(isDark);
    useEffect(() => {
        themeRef.current = isDark;
    }, [isDark]);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = waterRef.current;
        const ctx = canvas?.getContext("2d");
        if (!wrap || !canvas || !ctx) return;

        const still = window.matchMedia("(prefers-reduced-motion: reduce)");
        let cols = 0;
        let rows = 0;
        let cw = 8;
        let ch = 10;
        let keep = new Uint8Array(0);
        let raf = 0;
        let last = 0;
        let visible = true;
        const pointer = { x: -1e4, y: -1e4, glow: 0 };

        const layout = () => {
            const { width, height } = wrap.getBoundingClientRect();
            if (width < 1 || height < 1) return;
            ({ cw, ch } = tileSize(width));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const shore = pondMask(width, height, cw, ch);
            outlineRef.current = shore.outline;
            ({ keep, cols, rows } = shore);
            setMask(shore.url);
            draw(performance.now() / 1000);
        };

        const draw = (t: number) => {
            const { wash, glint } = WATER[themeRef.current ? "dark" : "light"];
            const w = canvas.width;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, w, canvas.height);
            ctx.restore();
            ctx.font = `500 ${Math.round(ch * 0.7)}px ${MONO}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const glow = pointer.glow;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (!keep[r * cols + c]) continue;
                    const x = c * cw;
                    const y = r * ch;
                    // Depth: slow, broad shading across the surface, so the band reads as water, not a flat fill.
                    const depth = noise(c * 0.06 + t * 0.03, r * 0.1 - t * 0.015, 3);
                    ctx.globalAlpha = 0.045 + depth * 0.06;
                    ctx.fillStyle = `rgb(${wash[0]},${wash[1]},${wash[2]})`;
                    ctx.fillRect(x, y, cw, ch);
                    // Caustics: two drifting interference fields; only their crests glint.
                    const warp = noise(c * 0.08, r * 0.12 + t * 0.12, 7) * 3;
                    const a = Math.sin(c * 0.33 + t * 0.85 + warp);
                    const b = Math.sin(r * 0.52 - t * 0.6 + warp * 0.7 + c * 0.11);
                    let v = Math.abs(a * b);
                    // The cursor lifts the light around it, a little, while it moves.
                    if (glow > 0) {
                        const d = Math.hypot(x + cw / 2 - pointer.x, y + ch / 2 - pointer.y);
                        v += glow * Math.max(0, 1 - d / 90) * 0.35;
                    }
                    if (v < GLINT) continue;
                    const s = (v - GLINT) / (1 - GLINT);
                    ctx.globalAlpha = Math.min(0.55, 0.12 + s * 0.45);
                    ctx.fillStyle = `rgb(${glint[0]},${glint[1]},${glint[2]})`;
                    ctx.fillText(s > 0.55 ? "~" : s > 0.25 ? "-" : "·", x + cw / 2, y + ch / 2 + 0.5);
                }
            }
            ctx.globalAlpha = 1;
        };

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            if (now - last < 1000 / WATER_FPS) return;
            last = now;
            pointer.glow = Math.max(0, pointer.glow - 0.04);
            draw(now / 1000);
        };

        const run = () => {
            cancelAnimationFrame(raf);
            if (!visible) return;
            if (still.matches) {
                draw(0);
                return;
            }
            raf = requestAnimationFrame(frame);
        };

        const onMove = (e: PointerEvent) => {
            const rect = wrap.getBoundingClientRect();
            pointer.x = e.clientX - rect.left;
            pointer.y = e.clientY - rect.top;
            pointer.glow = Math.min(1, pointer.glow + 0.25);
        };

        const ro = new ResizeObserver(layout);
        ro.observe(wrap);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            run();
        });
        io.observe(wrap);
        wrap.addEventListener("pointermove", onMove, { passive: true });
        still.addEventListener("change", run);
        layout();
        run();
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            wrap.removeEventListener("pointermove", onMove);
            still.removeEventListener("change", run);
        };
    }, []);

    return (
        <figure className="group/banner flex flex-col gap-2">
            <div
                ref={wrapRef}
                className="relative h-[clamp(190px,38vw,250px)] w-full cursor-crosshair"
                // Hidden until the shoreline is cut, then faded up, so the banner never shows a hard rectangle first.
                style={
                    mask
                        ? {
                              maskImage: `url(${mask})`,
                              WebkitMaskImage: `url(${mask})`,
                              maskSize: "100% 100%",
                              WebkitMaskSize: "100% 100%",
                          }
                        : { visibility: "hidden" }
                }
            >
                <canvas ref={waterRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
                <KoiPond onStats={setStats} stocking={stocking} className="absolute inset-0 h-full w-full" />
            </div>
            {/* The one hint, and only while the cursor is over the water. */}
            <figcaption
                aria-hidden
                className="text-right text-small text-muted opacity-0 transition-opacity duration-300 group-hover/banner:opacity-100 [@media(pointer:coarse)]:opacity-100"
            >
                {stats.pellets > 0 ? "the koi have noticed" : "click the water to feed the koi"}
            </figcaption>
        </figure>
    );
}
