"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { finishTransition, isTransitioning, pushWithTransition } from "../../lib/view-transition";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import Container from "../components/container";
import { byDate, isExternal, LAST_PROJECT_KEY, nameOf, projectHref, type Project } from "../data/project-helpers";
import { Thumb } from "./[slug]/project-page";

const GLIDE = 0.18; // share of the remaining distance the strip covers each frame when scrolled with a wheel
const DESKTOP_QUERY = "(min-width: 1024px)"; // Tailwind's `lg`, where the strip replaces the mobile list
// How far each key moves the strip, as a share of its width.
const KEY_STEPS: Record<string, number> = {
    ArrowRight: 0.1,
    ArrowDown: 0.1,
    ArrowLeft: -0.1,
    ArrowUp: -0.1,
    PageDown: 0.8,
    PageUp: -0.8,
    " ": 0.8,
    End: Infinity,
    Home: -Infinity,
};

/** The projects page: the strip on desktop, a list on phones. The page reads the content and hands it in. */
export default function ProjectsView({ projects }: { projects: Project[] }) {
    // Coming back from a project, the slide plays once the page has rendered (and the strip has restored its place,
    // since a child's effects run before this one).
    useEffect(() => {
        finishTransition();
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden bg-background text-foreground">
            <TopNav />
            {/* One landmark for both layouts, so the skip link has a single place to land. */}
            <main id="main" tabIndex={-1} className="h-full outline-none">
                <MobileLayout projects={projects} />
                <DesktopStrip projects={byDate(projects)} />
            </main>
        </div>
    );
}

/**
 * Projects side by side in one strip that starts on the page's left column and runs off the right edge. Scrolling,
 * swiping or the page keys anywhere move it sideways; trackpads and touch can also swipe it directly.
 */
function DesktopStrip({ projects }: { projects: Project[] }) {
    const stripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const desktop = window.matchMedia(DESKTOP_QUERY);
        // Back from a project, the strip opens on the last one viewed (lined up with the column's left edge), so the
        // slide lands on it even after stepping through others with previous and next.
        const last =
            isTransitioning() && strip.querySelector(`[data-slug="${sessionStorage.getItem(LAST_PROJECT_KEY)}"]`);
        if (last) {
            const inset = parseFloat(getComputedStyle(strip).paddingLeft);
            strip.scrollLeft += last.getBoundingClientRect().left - strip.getBoundingClientRect().left - inset;
        }
        let target = strip.scrollLeft;
        let raf = 0;

        const glide = () => {
            const before = strip.scrollLeft;
            strip.scrollLeft += (target - before) * GLIDE;
            // Scroll positions round to whole pixels, so the last small steps stall short of the target.
            if (strip.scrollLeft === before) {
                strip.scrollLeft = target;
                raf = 0;
                return;
            }
            raf = requestAnimationFrame(glide);
        };
        // A glide still running would pull the strip back from wherever the browser scrolls it.
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };
        // Moves the strip by `delta`, adding to a glide already under way.
        const glideBy = (delta: number) => {
            const max = strip.scrollWidth - strip.clientWidth;
            target = Math.max(0, Math.min(max, (raf ? target : strip.scrollLeft) + delta));
            if (still) strip.scrollLeft = target;
            else if (!raf) raf = requestAnimationFrame(glide);
        };

        // The strip is only shown on desktop; below that the mobile list scrolls normally.
        // A vertical wheel turns into a sideways glide. A sideways swipe over the strip is left to the browser;
        // anywhere else it glides the strip too.
        const onWheel = (e: WheelEvent) => {
            if (!desktop.matches) return;
            const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (sideways && strip.contains(e.target as Node)) {
                stop();
                return;
            }
            e.preventDefault();
            const delta = sideways ? e.deltaX : e.deltaY;
            glideBy(e.deltaMode === 1 ? delta * 16 : delta);
        };

        // On touch screens a vertical swipe drags the strip sideways and keeps going at the speed it was let go.
        // Sideways swipes stay with the browser.
        let touch: { x: number; y: number; left: number; lastY: number; time: number; speed: number } | null = null;
        let vertical: boolean | undefined;
        const onTouchStart = (e: TouchEvent) => {
            stop();
            touch = null;
            vertical = undefined;
            if (!desktop.matches || e.touches.length !== 1) return;
            const { clientX: x, clientY: y } = e.touches[0];
            touch = { x, y, left: strip.scrollLeft, lastY: y, time: e.timeStamp, speed: 0 };
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!touch) return;
            const { clientX: x, clientY: y } = e.touches[0];
            if (vertical === undefined) {
                // Wait for a few pixels of travel before deciding which way the swipe goes.
                if (Math.hypot(x - touch.x, y - touch.y) < 6) return;
                vertical = Math.abs(y - touch.y) > Math.abs(x - touch.x);
            }
            if (!vertical) return;
            e.preventDefault();
            strip.scrollLeft = touch.left + touch.y - y;
            const dt = e.timeStamp - touch.time;
            if (dt > 0) touch.speed = (touch.lastY - y) / dt;
            touch.lastY = y;
            touch.time = e.timeStamp;
        };
        const onTouchEnd = (e: TouchEvent) => {
            // A finger that stopped before lifting shouldn't fling the strip.
            if (touch && vertical && !still && e.timeStamp - touch.time < 100)
                glideBy(touch.speed * (1000 / 60 / GLIDE));
            touch = null;
        };

        const onKeyDown = (e: KeyboardEvent) => {
            const step = KEY_STEPS[e.key];
            if (!desktop.matches || step === undefined || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey)
                return;
            // Space on a button presses it.
            if (e.key === " " && e.target instanceof HTMLButtonElement) return;
            e.preventDefault();
            glideBy((e.key === " " && e.shiftKey ? -step : step) * strip.clientWidth);
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", onTouchEnd);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            stop();
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return (
        <div className="flex h-full flex-col justify-center pt-12 max-lg:hidden">
            {/* The padding lines the first and last tiles up with the 56rem column the project pages use. */}
            <div
                ref={stripRef}
                className="flex gap-3 overflow-x-auto px-[max(1.5rem,calc((100vw-theme(maxWidth.column))/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {projects.map((project, i) => (
                    <StripTile key={project.slug} project={project} priority={i < 2} />
                ))}
            </div>
        </div>
    );
}

/** One project: its thumbnail, large, with the name, year and description under it. Hovering zooms in and says where it goes. */
function StripTile({ project, priority }: { project: Project; priority: boolean }) {
    const router = useRouter();
    const href = projectHref(project);
    const external = isExternal(href);
    const body = (
        <>
            <span data-slug={project.slug} className="relative block">
                <Thumb
                    project={project}
                    priority={priority}
                    zoom
                    sizes="(min-height: 1100px) 63rem, 93vh"
                    className="relative block aspect-[3/2] h-[min(62vh,42rem)] overflow-hidden"
                />
                <span className="pointer-events-none absolute bottom-4 left-4 translate-y-1 rounded-full bg-[rgb(0_0_0/0.55)] px-3 py-1.5 font-geistMono text-caption text-dark-foreground opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {external ? "read write-up ↗" : "view project"}
                </span>
            </span>
            <span className="mt-3 flex items-baseline gap-3">
                <span className="whitespace-nowrap text-ui">{nameOf(project)}</span>
                <span className="whitespace-nowrap font-geistMono text-caption text-muted">{project.date}</span>
            </span>
            <span className="mt-1 block text-small leading-normal text-muted">{project.description}</span>
        </>
    );
    // As wide as the thumbnail, so a long description wraps instead of pushing the next tile along.
    const className = "group relative block w-min shrink-0 focus-ring";

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${nameOf(project)}, opens in a new tab`}
                className={className}
            >
                {body}
            </a>
        );
    }
    return (
        <Link
            href={href}
            aria-label={nameOf(project)}
            className={className}
            onClick={(e) => {
                // Let modified clicks open a new tab as usual.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                // The strip slides off to the left and the project page slides in after it (see globals.css).
                pushWithTransition(router, href);
            }}
        >
            {body}
        </Link>
    );
}

function MobileLayout({ projects }: { projects: Project[] }) {
    return (
        <div className="w-full h-full overflow-y-auto bg-background lg:hidden">
            <MobileNav />
            <Container className="flex flex-col pt-[20vw] pb-[12vh]">
                {projects.map((project, i) => (
                    <article key={project.slug} className="flex flex-col pb-[16vw]">
                        <Thumb
                            project={project}
                            priority={i === 0}
                            sizes="100vw"
                            className="relative block w-full overflow-hidden rounded-2xl h-[65vw]"
                        />

                        <h2 className="font-inter text-heading mt-[5vw] mb-2 text-foreground">{nameOf(project)}</h2>

                        <p className="font-inter text-lede text-foreground opacity-60">{project.description}</p>

                        <div className="mt-5">
                            <p className="font-inter text-lede text-foreground opacity-60 mb-1">Year</p>
                            <p className="font-inter text-lede text-foreground">{project.date}</p>
                        </div>

                        <a
                            href={projectHref(project)}
                            {...(isExternal(projectHref(project)) && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                            })}
                            className="mt-5 self-start inline-flex items-center justify-center whitespace-nowrap focus-ring active:scale-95 transition-all text-foreground py-1 px-4 rounded-full"
                            style={{ background: "color-mix(in srgb, var(--foreground-color) 8%, transparent)" }}
                        >
                            View project
                        </a>
                    </article>
                ))}
            </Container>
        </div>
    );
}
