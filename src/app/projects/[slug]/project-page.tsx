"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import InlineLink from "../../components/inline-link";
import {
    LAST_PROJECT_KEY,
    hasPage,
    nameOf,
    primaryLink,
    projects,
    projectsByDate,
    type Project,
} from "../../data/projects";
import type { ImageMeta } from "../../../lib/images";
import { finishTransition, isTransitioning, pushWithTransition } from "../../../lib/view-transition";

/** One centred frame holds everything, so text and media share both edges. */
const FRAME = "mx-auto w-full max-w-[56rem]";
const BODY = "text-[16px] leading-[1.7] [text-wrap:pretty]";
const MUTED = "text-[var(--muted-color)]";
// Next re-encodes at 75 by default, which smears the small text in diagrams.
const IMAGE_QUALITY = 90;
const GLIDE = 0.18; // share of the remaining distance the page covers each frame when scrolled with a wheel
const MEDIA =
    "block aspect-video h-auto w-full rounded-[6px] bg-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground-color)_8%,transparent)]";

/** Shows the hostname for an outside link, or a label for a file on this site. */
const linkLabel = (href: string) => {
    if (/^https?:/.test(href)) return new URL(href).hostname.replace(/^www\./, "");
    return href.endsWith(".pdf") ? "paper (pdf)" : href;
};

export default function ProjectPage({
    slug,
    heroMeta,
    children,
}: {
    slug: string;
    /** Size and blur placeholder for an image hero, from the manifest; the page looks it up on the server. */
    heroMeta?: ImageMeta;
    children: ReactNode;
}) {
    const router = useRouter();
    const project = projects.find((p) => p.slug === slug);
    const still = useReducedMotion() ?? false;

    // Wheel scrolling glides to where it's headed instead of stepping, the same feel as the projects strip.
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

    // Arriving with a slide (from the strip or a neighbouring project), the page slides in as soon as it has rendered.
    const [arrivedSliding] = useState(() => typeof window !== "undefined" && isTransitioning());
    useEffect(() => {
        finishTransition();
    }, []);
    useEffect(() => {
        sessionStorage.setItem(LAST_PROJECT_KEY, slug);
    }, [slug]);

    // Previous and next follow the strip's order and wrap around, so there's always somewhere to go.
    const pages = projectsByDate.filter(hasPage);
    const at = pages.findIndex((p) => p.slug === slug);
    const prev = pages[(at - 1 + pages.length) % pages.length];
    const next = pages[(at + 1) % pages.length];

    if (!project) return null;
    const link = primaryLink(project);
    const hero = project.hero;

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <motion.main
                // The view transition already brings the page in when it comes from the strip.
                initial={arrivedSliding ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`${FRAME} px-6 pb-40 pt-28 font-geistSans lg:box-content lg:pt-40`}
            >
                <header>
                    <Link
                        href="/projects"
                        onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                            e.preventDefault();
                            // The reverse of opening a project: this page slides off to the right, uncovering the strip.
                            pushWithTransition(router, "/projects", "back");
                        }}
                        className={`text-[14px] ${MUTED} outline-none transition-colors hover:text-foreground focus-visible:text-foreground`}
                    >
                        ← Projects
                    </Link>
                    <h1 className="mt-10 text-[28px] font-medium leading-[1.2] tracking-[-0.015em]">{project.title}</h1>
                    <p className={`mt-1 text-[16px] ${MUTED}`}>{project.description}</p>
                    <p className={`${BODY} mt-8`}>{project.longDescription}</p>
                    <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[14px] ${MUTED}`}>
                        <span className="font-geistMono text-[12px]">{project.date}</span>
                        {project.paperUrl && <InlineLink href={project.paperUrl}>paper</InlineLink>}
                        {project.githubUrl && <InlineLink href={project.githubUrl}>code</InlineLink>}
                        {project.liveUrl && (
                            <InlineLink href={project.liveUrl}>{linkLabel(project.liveUrl)}</InlineLink>
                        )}
                        {!project.paperUrl && !project.githubUrl && !project.liveUrl && link && (
                            <InlineLink href={link}>{linkLabel(link)}</InlineLink>
                        )}
                    </p>
                </header>

                {hero && (
                    <div className="mt-16">
                        {hero.type === "video" ? (
                            // Muted autoplay loops like a gif; with reduced motion it waits for the viewer to press play.
                            <video
                                src={hero.src}
                                autoPlay={!still}
                                controls={still}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-label={hero.alt}
                                className={MEDIA}
                            />
                        ) : (
                            // Sized from the manifest when there is an entry (SVG heroes have none) and blurred in.
                            <Image
                                src={hero.src}
                                alt={hero.alt}
                                width={heroMeta?.width ?? 1920}
                                height={heroMeta?.height ?? 1080}
                                placeholder={heroMeta ? "blur" : "empty"}
                                blurDataURL={heroMeta?.blurDataURL}
                                preload
                                sizes="(min-width: 1024px) 56rem, 100vw"
                                quality={IMAGE_QUALITY}
                                unoptimized={hero.src.endsWith(".gif")}
                                className={`${MEDIA} object-cover`}
                            />
                        )}
                    </div>
                )}

                <div className="mt-20">{children}</div>

                {pages.length > 1 && (
                    <nav
                        aria-label="More projects"
                        className="mt-24 flex items-start justify-between gap-6 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] pt-6"
                    >
                        <PagerLink project={prev} direction="back" />
                        <PagerLink project={next} direction="forward" />
                    </nav>
                )}
            </motion.main>
        </div>
    );
}

const CARD_GAP = 18; // px between the cursor and the preview card's lower edge
const CARD_FOLLOW = 0.25; // share of the remaining distance the card covers each frame as it trails the cursor

/**
 * A link to the previous or next project. Hovering it floats a small card with that project's thumbnail, name and
 * description that trails the cursor; clicking slides over to it the same way the strip does.
 */
function PagerLink({ project, direction }: { project: Project; direction: "back" | "forward" }) {
    const router = useRouter();
    const cardRef = useRef<HTMLSpanElement>(null);
    const follow = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
    const href = `/projects/${project.slug}`;
    const back = direction === "back";
    const name = nameOf(project);

    useEffect(() => () => cancelAnimationFrame(follow.current.raf), []);

    // Above the point and centred on it, kept on screen; flips below when there's no room above.
    const aim = (x: number, y: number) => {
        const card = cardRef.current;
        if (!card) return;
        const f = follow.current;
        f.tx = Math.max(12, Math.min(window.innerWidth - card.offsetWidth - 12, x - card.offsetWidth / 2));
        f.ty = y - card.offsetHeight - CARD_GAP < 12 ? y + CARD_GAP : y - card.offsetHeight - CARD_GAP;
    };
    const place = () => {
        const f = follow.current;
        cardRef.current?.style.setProperty("transform", `translate3d(${f.x}px, ${f.y}px, 0)`);
    };
    const step = () => {
        const f = follow.current;
        f.x += (f.tx - f.x) * CARD_FOLLOW;
        f.y += (f.ty - f.y) * CARD_FOLLOW;
        place();
        f.raf = Math.abs(f.tx - f.x) + Math.abs(f.ty - f.y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    // Jump straight to the point on arrival so the card doesn't fly in from wherever it last was.
    const settle = (x: number, y: number) => {
        aim(x, y);
        const f = follow.current;
        f.x = f.tx;
        f.y = f.ty;
        place();
    };

    return (
        <Link
            href={href}
            onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                pushWithTransition(router, href, direction);
            }}
            onPointerEnter={(e) => settle(e.clientX, e.clientY)}
            onPointerMove={(e) => {
                aim(e.clientX, e.clientY);
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    settle(e.clientX, e.clientY);
                } else if (!follow.current.raf) {
                    follow.current.raf = requestAnimationFrame(step);
                }
            }}
            // From the keyboard there's no cursor, so the card sits over the link itself.
            onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                settle(r.left + r.width / 2, r.top);
            }}
            className={`group relative flex flex-col gap-1 outline-none ${back ? "items-start" : "items-end text-right"}`}
        >
            <span className={`font-geistMono text-[12px] ${MUTED}`}>{back ? "previous" : "next"}</span>
            <span className="text-[16px] decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${name}` : `${name} →`}
            </span>
            <span
                ref={cardRef}
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-50 w-[17rem] rounded-[8px] border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-background p-2 text-left opacity-0 shadow-[0_12px_32px_rgb(0_0_0/0.25)] transition-[opacity,scale] duration-200 ease-out [scale:0.96] will-change-transform group-hover:opacity-100 group-hover:[scale:1] group-focus-visible:opacity-100 group-focus-visible:[scale:1]"
            >
                <Thumb
                    project={project}
                    sizes="17rem"
                    className="relative block aspect-[3/2] overflow-hidden rounded-[4px]"
                />
                <span className="mt-2 flex items-baseline gap-2 px-1">
                    <span className="text-[14px]">{name}</span>
                    <span className={`font-geistMono text-[11px] ${MUTED}`}>{project.date}</span>
                </span>
                <span className={`mt-0.5 block px-1 pb-1 text-[13px] leading-[1.45] ${MUTED}`}>
                    {project.description}
                </span>
            </span>
        </Link>
    );
}

/** A project's preview image, or its name set in mono on a quiet tile when it has none yet. */
export function Thumb({
    project,
    sizes,
    className,
    priority = false,
    zoom = false,
}: {
    project: Project;
    sizes: string;
    className: string;
    priority?: boolean;
    zoom?: boolean;
}) {
    const tile = "bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)]";
    if (!project.thumb) {
        return (
            <span className={`${className} ${tile} flex items-end p-4 font-geistMono text-[13px] ${MUTED}`}>
                {nameOf(project).toLowerCase()}
            </span>
        );
    }
    const figure = project.thumbStyle === "figure";
    const image = (
        <Image
            src={project.thumb}
            alt=""
            fill
            // fetchPriority, not preload: a preload would also download it on phones, where the strip is hidden.
            fetchPriority={priority ? "high" : undefined}
            sizes={sizes}
            quality={IMAGE_QUALITY}
            unoptimized={project.thumb.endsWith(".gif")}
            className={`transition-transform duration-700 ease-out ${zoom ? "group-hover:scale-[1.03] group-focus-visible:scale-[1.03]" : ""} ${
                figure
                    ? // Multiply drops a plot's white paper onto the tile; in dark mode the plot is inverted (with its
                      // hues restored) and screened on instead, so the paper vanishes either way.
                      "object-contain mix-blend-multiply dark:invert dark:hue-rotate-180 dark:mix-blend-screen"
                    : "object-cover"
            }`}
        />
    );
    if (!figure) return <span className={`${className} ${tile}`}>{image}</span>;
    // A filled image ignores its parent's padding, so an inner box gives the figure its margin.
    return (
        <span className={`${className} ${tile} p-[6%]`}>
            <span className="relative block h-full w-full">{image}</span>
        </span>
    );
}
