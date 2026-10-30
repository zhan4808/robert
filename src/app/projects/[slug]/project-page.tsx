"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import InlineLink from "../../components/inline-link";
import { TableOfContents } from "../../components/mdx/toc";
import { useGlideScroll } from "../../components/use-glide-scroll";
import { HOVER_CARD, useHoverCard } from "../../components/use-hover-card";
import { LAST_PROJECT_KEY, nameOf, primaryLink, type Project } from "../../data/project-helpers";
import type { ImageMeta } from "../../../lib/images";
import type { Heading } from "../../../lib/mdx";
import { formatIsoDate } from "../../../lib/site";
import { finishTransition, isTransitioning, pushWithTransition } from "../../../lib/view-transition";

/** One centred frame holds everything, so text and media share both edges. */
const FRAME = "mx-auto w-full max-w-column";
const BODY = "text-body leading-body [text-wrap:pretty]";
const MUTED = "text-muted";
// Next re-encodes at 75 by default, which smears the small text in diagrams.
const IMAGE_QUALITY = 90;
const MEDIA =
    "block aspect-video h-auto w-full rounded-card bg-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground-color)_8%,transparent)]";

/** Shows the hostname for an outside link, or a label for a file on this site. */
const linkLabel = (href: string) => {
    if (/^https?:/.test(href)) return new URL(href).hostname.replace(/^www\./, "");
    return href.endsWith(".pdf") ? "paper (pdf)" : href;
};

export default function ProjectPage({
    project,
    pages,
    heroMeta,
    headings,
    minutes,
    children,
}: {
    project: Project;
    /** Every project with a page, newest first, for previous and next. */
    pages: Project[];
    /** Size and blur placeholder for an image hero, from the manifest; the page looks it up on the server. */
    heroMeta?: ImageMeta;
    /** The write-up's headings, for the table of contents. */
    headings: Heading[];
    /** How long the write-up takes to read. */
    minutes: number;
    children: ReactNode;
}) {
    const router = useRouter();
    const { slug } = project;
    const still = useReducedMotion() ?? false;

    useGlideScroll();

    // Arriving with a slide (from the strip or a neighbouring project), the page slides in as soon as it has rendered.
    const [arrivedSliding] = useState(() => typeof window !== "undefined" && isTransitioning());
    useEffect(() => {
        finishTransition();
    }, []);
    useEffect(() => {
        sessionStorage.setItem(LAST_PROJECT_KEY, slug);
    }, [slug]);

    // Previous and next follow the strip's order and wrap around, so there's always somewhere to go.
    const at = pages.findIndex((p) => p.slug === slug);
    const prev = pages[(at - 1 + pages.length) % pages.length];
    const next = pages[(at + 1) % pages.length];

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
                id="main"
                tabIndex={-1}
                className={`${FRAME} px-6 pb-40 pt-28 font-geistSans outline-none lg:box-content lg:pt-40`}
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
                        className={`text-small ${MUTED} focus-ring transition-colors hover:text-foreground focus-visible:text-foreground`}
                    >
                        ← Projects
                    </Link>
                    <h1 className="mt-10 text-title font-medium">{project.title}</h1>
                    <p className={`mt-1 text-body ${MUTED}`}>{project.description}</p>
                    <p className={`${BODY} mt-8`}>{project.longDescription}</p>
                    <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-small ${MUTED}`}>
                        <span className="font-geistMono text-caption">{project.date}</span>
                        {project.updated && (
                            <span className="font-geistMono text-caption">
                                updated {formatIsoDate(project.updated)}
                            </span>
                        )}
                        <span className="font-geistMono text-caption">{minutes} min read</span>
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

                <div className="mt-20">
                    <TableOfContents headings={headings} />
                    {children}
                </div>

                {pages.length > 1 && (
                    <nav
                        aria-label="More projects"
                        className="mt-24 flex items-start justify-between gap-6 border-t border-hairline pt-6"
                    >
                        <PagerLink project={prev} direction="back" />
                        <PagerLink project={next} direction="forward" />
                    </nav>
                )}
            </motion.main>
        </div>
    );
}

/**
 * A link to the previous or next project. Hovering it floats a small card with that project's thumbnail, name and
 * description that trails the cursor; clicking slides over to it the same way the strip does.
 */
function PagerLink({ project, direction }: { project: Project; direction: "back" | "forward" }) {
    const router = useRouter();
    const card = useHoverCard();
    const href = `/projects/${project.slug}`;
    const back = direction === "back";
    const name = nameOf(project);

    return (
        <Link
            href={href}
            onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                pushWithTransition(router, href, direction);
            }}
            onPointerEnter={card.onPointerEnter}
            onPointerMove={card.onPointerMove}
            onFocus={card.onFocus}
            className={`group relative flex flex-col gap-1 focus-ring ${back ? "items-start" : "items-end text-right"}`}
        >
            <span className={`font-geistMono text-caption ${MUTED}`}>{back ? "previous" : "next"}</span>
            <span className="text-body decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${name}` : `${name} →`}
            </span>
            <span ref={card.cardRef} aria-hidden className={HOVER_CARD}>
                <Thumb
                    project={project}
                    sizes="17rem"
                    className="relative block aspect-[3/2] overflow-hidden rounded-chip"
                />
                <span className="mt-2 flex items-baseline gap-2 px-1">
                    <span className="text-small">{name}</span>
                    <span className={`font-geistMono text-label ${MUTED}`}>{project.date}</span>
                </span>
                <span className={`mt-0.5 block px-1 pb-1 text-meta leading-[1.45] ${MUTED}`}>
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
    const tile = "bg-tile";
    if (!project.thumb) {
        return (
            <span className={`${className} ${tile} flex items-end p-4 font-geistMono text-meta ${MUTED}`}>
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
