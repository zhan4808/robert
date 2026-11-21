"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import PondImage from "../../components/pond-image";
import SiteFooter from "../../components/site-footer";
import TopNav from "../../components/top-nav";
import { useGlideScroll } from "../../components/use-glide-scroll";
import { HOVER_CARD, useHoverCard } from "../../components/use-hover-card";
import type { ImageMeta } from "../../../lib/images";
import { PostCover, type CoverSource } from "../post-cover";

const MUTED = "text-muted";

/** What the page knows about its cover: a photo (with its manifest entry) or a gradient. */
export type Band = { image: string; meta?: ImageMeta } | { gradient: string };

/** The shell of a post: the nav, the reading column fading in on arrival, and the footer. */
export default function PostPage({ children }: { children: ReactNode }) {
    useGlideScroll();

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <TopNav />
            <main
                id="main"
                tabIndex={-1}
                className="mx-auto w-full max-w-column animate-page-in px-6 pt-14 font-geistSans outline-none motion-reduce:animate-none sm:pt-20"
            >
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}

/** A post's cover under its title: a photo surfacing from the pond, or a soft band of its gradient. */
export function PostCoverBand({ band }: { band: Band }) {
    if ("image" in band) {
        return (
            <PondImage
                src={band.image}
                alt=""
                ratio={2.2}
                priority
                blurDataURL={band.meta?.blurDataURL}
                className="mt-8"
            />
        );
    }
    return (
        <div aria-hidden className={`mt-8 h-24 w-full rounded-card bg-gradient-to-br opacity-50 ${band.gradient}`} />
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
            <span className={`text-small ${MUTED}`}>{back ? "previous" : "next"}</span>
            <span className="text-body decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${post.title}` : `${post.title} →`}
            </span>
            <span ref={cardRef} aria-hidden className={HOVER_CARD}>
                <PostCover post={post} meta={post.coverMeta} sizes="17rem" className="w-full" />
                <span className="mt-2 flex items-baseline gap-2 px-1">
                    <span className="text-small">{post.title}</span>
                    <span className={`text-small ${MUTED}`}>{post.date}</span>
                </span>
                <span className={`mt-0.5 block px-1 pb-1 text-meta leading-[1.45] ${MUTED}`}>{post.subtitle}</span>
            </span>
        </Link>
    );
}
