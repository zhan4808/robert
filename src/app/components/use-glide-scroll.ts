import { useEffect } from "react";

const GLIDE = 0.18; // share of the remaining distance the page covers each frame when scrolled with a wheel

/**
 * Wheel scrolling glides to where it's headed instead of stepping, the same feel as the projects strip. Shared by the
 * write-up pages; it does nothing under reduced motion.
 */
export function useGlideScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let target = window.scrollY;
        let raf = 0;
        // "instant" overrides the page's CSS smooth scrolling, which would otherwise animate every frame's step.
        const to = (top: number) => window.scrollTo({ top, behavior: "instant" });

        const glide = () => {
            const gap = target - window.scrollY;
            if (Math.abs(gap) < 1) {
                to(target);
                raf = 0;
                return;
            }
            // At least a pixel a frame, so rounding can't stall it just short of the target.
            to(window.scrollY + Math.sign(gap) * Math.max(1, Math.abs(gap) * GLIDE));
            raf = requestAnimationFrame(glide);
        };

        const onWheel = (e: WheelEvent) => {
            // Pinch-zoom, sideways swipes and anything inside a scrollable box (code, tables) stay with the browser.
            if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            if (e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.scrolls !== undefined)) return;
            e.preventDefault();
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (!raf) target = window.scrollY;
            target = Math.max(0, Math.min(max, target + (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY)));
            if (!raf) raf = requestAnimationFrame(glide);
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("wheel", onWheel);
        };
    }, []);
}
