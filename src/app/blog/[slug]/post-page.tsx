"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import { useGlideScroll } from "../../components/use-glide-scroll";
import { HOVER_CARD, useHoverCard } from "../../components/use-hover-card";
import type { ImageMeta } from "../../../lib/images";
import { PostCover, type CoverSource } from "../post-cover";

const FRAME = "mx-auto w-full max-w-column";
const MUTED = "text-muted";
/** The cover's height: a band, not a hero, whatever the screen. */
const BAND_HEIGHT = "clamp(180px, 26vw, 440px)";
/** How far below the band's top the nav's text ends; past that the nav is back on the page's own colour. */
const NAV_DEPTH = 72;

/** What the page knows about its cover: a photo (with its manifest entry) or a gradient. */
export type Band = { image: string; meta?: ImageMeta } | { gradient: string };

/**
 * The shell of a post: the cover band when there is one, the nav (light while it sits over a photo), and the
 * content frame, fading in on arrival. The server page renders everything inside it.
 */
export default function PostPage({ band, children }: { band?: Band; children: ReactNode }) {
    const still = useReducedMotion() ?? false;
    const bandRef = useRef<HTMLDivElement>(null);
    const photo = band !== undefined && "image" in band;
    // Over a photo the nav goes light; a gradient is faded enough that the page's own colour still reads on it.
    const [overCover, setOverCover] = useState(photo);

    useGlideScroll();

    useEffect(() => {
        if (!photo) return;
        const onScroll = () => setOverCover(window.scrollY < (bandRef.current?.offsetHeight ?? 0) - NAV_DEPTH);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [photo]);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav overCover={overCover} />
            <motion.div
                initial={still ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {band && (
                    <div
                        ref={bandRef}
                        aria-hidden
                        className="relative w-full overflow-hidden"
                        style={{ height: BAND_HEIGHT }}
                    >
                        {"image" in band ? (
                            <Image
                                src={band.image}
                                alt=""
                                fill
                                preload
                                placeholder={band.meta ? "blur" : "empty"}
                                blurDataURL={band.meta?.blurDataURL}
                                sizes="100vw"
                                quality={90}
                                className="object-cover"
                            />
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br opacity-60 ${band.gradient}`} />
                        )}
                        {/* A faint shade at the top keeps the nav's light text readable over a bright sky. */}
                        {"image" in band && (
                            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-dark-background/45 to-transparent" />
                        )}
                        {/* The lower edge dissolves into the page, so the band has no hard bottom line. */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-background" />
                    </div>
                )}
                <main
                    id="main"
                    tabIndex={-1}
                    className={`${FRAME} px-6 pb-40 font-geistSans outline-none ${
                        band ? "pt-10 lg:pt-14" : "pt-28 lg:pt-40"
                    }`}
                >
                    {children}
                </main>
            </motion.div>
        </div>
    );
}

/** What a pager link needs of its neighbour; a plain object the server page hands across. */
export interface PagerPost extends CoverSource {
    slug: string;
    subtitle: string;
    date: string;
    coverMeta?: ImageMeta;
}

/**
 * A link to the previous (older) or next (newer) post. Hovering it floats a small card with that post's cover,
 * title and subtitle that trails the cursor, as under a project.
 */
export function PostPager({ post, direction }: { post: PagerPost; direction: "back" | "forward" }) {
    const { cardRef, onPointerEnter, onPointerMove, onFocus } = useHoverCard();
    const back = direction === "back";
    return (
        <Link
            href={`/blog/${post.slug}`}
            onPointerEnter={onPointerEnter}
            onPointerMove={onPointerMove}
            onFocus={onFocus}
            className={`group relative flex flex-col gap-1 focus-ring ${back ? "items-start" : "items-end text-right"}`}
        >
            <span className={`font-geistMono text-caption ${MUTED}`}>{back ? "previous" : "next"}</span>
            <span className="text-body decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${post.title}` : `${post.title} →`}
            </span>
            <span ref={cardRef} aria-hidden className={HOVER_CARD}>
                <PostCover post={post} meta={post.coverMeta} sizes="17rem" className="w-full" />
                <span className="mt-2 flex items-baseline gap-2 px-1">
                    <span className="text-small">{post.title}</span>
                    <span className={`font-geistMono text-label ${MUTED}`}>{post.date}</span>
                </span>
                <span className={`mt-0.5 block px-1 pb-1 text-meta leading-[1.45] ${MUTED}`}>{post.subtitle}</span>
            </span>
        </Link>
    );
}
