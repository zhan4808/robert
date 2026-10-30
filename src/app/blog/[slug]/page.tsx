import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TableOfContents } from "../../components/mdx/toc";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import { getPost, getPosts, getVisiblePosts } from "../../../lib/content";
import type { JournalTrack } from "../../../lib/content-schema";
import { CONTENT_IMAGE_QUALITY, CONTENT_IMAGE_SIZES } from "../../../lib/image-sizes";
import { imageMeta } from "../../../lib/images";
import { renderMdx } from "../../../lib/mdx";
import { pageMetadata } from "../../../lib/metadata";
import { readingMinutes } from "../../../lib/reading-time";
import { formatIsoDate, parseContentDate } from "../../../lib/site";

const FRAME = "mx-auto w-full max-w-column";
const MUTED = "text-muted";
const HAIRLINE = "border-hairline";

export const dynamicParams = false;

export function generateStaticParams() {
    return getPosts().map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPosts().find((entry) => entry.slug === slug);
    if (!post) return {};
    const path = `/blog/${post.slug}`;
    // Cards are only drawn for visible posts, so a hidden one shares the site-wide card rather than a broken link.
    return pageMetadata({
        title: post.title,
        description: post.subtitle,
        path,
        article: {
            publishedTime: parseContentDate(post.date),
            modifiedTime: post.updated ? new Date(post.updated) : undefined,
        },
        image: post.hidden ? undefined : `${path}/opengraph-image`,
        hidden: post.hidden,
    });
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const doc = getPost(slug);
    if (!doc) notFound();
    const post = doc.meta;

    // Previous and next step through the visible posts in order; hidden posts still open by URL.
    const visible = getVisiblePosts();
    const at = visible.findIndex((p) => p.slug === slug);
    const newer = at > 0 ? visible[at - 1] : undefined;
    const older = at >= 0 && at < visible.length - 1 ? visible[at + 1] : undefined;

    const { content, headings } = await renderMdx(doc.body, `content/blog/${slug}.mdx`);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main id="main" tabIndex={-1} className={`${FRAME} px-6 pb-40 pt-28 font-geistSans outline-none lg:pt-40`}>
                <header>
                    <Link
                        href="/blog"
                        className={`text-small ${MUTED} focus-ring transition-colors hover:text-foreground focus-visible:text-foreground`}
                    >
                        ← Blog
                    </Link>
                    <h1 className="mt-10 text-title font-medium">{post.title}</h1>
                    <p className={`mt-1 text-body ${MUTED}`}>{post.subtitle}</p>
                    <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 font-geistMono text-caption ${MUTED}`}>
                        <span>{post.date}</span>
                        {post.updated && <span>updated {formatIsoDate(post.updated)}</span>}
                        <span>{readingMinutes(doc.body)} min read</span>
                    </p>
                </header>

                {post.coverImage && <Cover src={post.coverImage} />}

                {post.tracks.length > 0 && <Tracks tracks={post.tracks} />}

                <div className="mt-16">
                    <TableOfContents headings={headings} />
                    <div className="flex flex-col gap-5">{content}</div>
                </div>

                {(newer || older) && (
                    <nav
                        aria-label="More posts"
                        className={`mt-24 flex justify-between gap-6 border-t ${HAIRLINE} pt-6`}
                    >
                        {older ? <Pager post={older} label="older" back /> : <span />}
                        {newer && <Pager post={newer} label="newer" />}
                    </nav>
                )}
            </main>
        </div>
    );
}

/** The post's cover, sized from the manifest and blurred in; the aspect ratio is fixed so the page never shifts. */
function Cover({ src }: { src: string }) {
    const meta = imageMeta(src);
    return (
        <Image
            src={src}
            alt=""
            width={meta?.width ?? 1920}
            height={meta?.height ?? 1080}
            placeholder={meta ? "blur" : "empty"}
            blurDataURL={meta?.blurDataURL}
            preload
            sizes={CONTENT_IMAGE_SIZES}
            quality={CONTENT_IMAGE_QUALITY}
            className="mt-12 block aspect-[2/1] h-auto w-full rounded-card object-cover"
        />
    );
}

/** Album art at 48px; the manifest gives the real size, and `sizes` keeps the srcset small. */
function AlbumArt({ src }: { src: string }) {
    const meta = imageMeta(src);
    return (
        <Image
            src={src}
            alt=""
            width={meta?.width ?? 48}
            height={meta?.height ?? 48}
            placeholder={meta ? "blur" : "empty"}
            blurDataURL={meta?.blurDataURL}
            sizes="48px"
            className="size-12 shrink-0 rounded-chip object-cover"
        />
    );
}

/** What was playing while the post was written, with the audio right there when there is a file for it. */
function Tracks({ tracks }: { tracks: JournalTrack[] }) {
    return (
        <section aria-label="Listening" className="mt-12 flex flex-col gap-3">
            <p className={`font-geistMono text-meta ${MUTED}`}>listening</p>
            <ul className="flex flex-col gap-3">
                {tracks.map((track) => (
                    <li key={track.title} className="flex items-center gap-4">
                        {track.albumArt && <AlbumArt src={track.albumArt} />}
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-ui">{track.title}</span>
                            <span className={`truncate text-meta ${MUTED}`}>{track.artist}</span>
                        </span>
                        {track.audioSrc && (
                            <audio src={track.audioSrc} controls preload="none" className="h-8 max-w-[14rem]" />
                        )}
                        {!track.audioSrc && track.spotifyUrl && (
                            <a
                                href={track.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`ink-link font-geistMono text-caption ${MUTED}`}
                            >
                                spotify ↗
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Pager({
    post,
    label,
    back = false,
}: {
    post: { slug: string; title: string };
    label: string;
    back?: boolean;
}) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`group flex flex-col gap-1 focus-ring ${back ? "items-start" : "items-end text-right"}`}
        >
            <span className={`font-geistMono text-caption ${MUTED}`}>{label}</span>
            <span className="text-body decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${post.title}` : `${post.title} →`}
            </span>
        </Link>
    );
}
