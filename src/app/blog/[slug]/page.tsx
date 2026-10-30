import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AudioPlayer from "../../components/audio-player";
import { TableOfContents } from "../../components/mdx/toc";
import { getPost, getPosts, getVisiblePosts } from "../../../lib/content";
import type { JournalPost, JournalTrack } from "../../../lib/content-schema";
import { imageMeta } from "../../../lib/images";
import { renderMdx } from "../../../lib/mdx";
import { pageMetadata } from "../../../lib/metadata";
import { readingMinutes } from "../../../lib/reading-time";
import { formatIsoDate, parseContentDate } from "../../../lib/site";
import PostPage, { PostPager, type Band, type PagerPost } from "./post-page";

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

/** The cover as the page shell draws it: the photo (with its manifest entry) first, the gradient failing that. */
function bandOf(post: JournalPost): Band | undefined {
    if (post.coverImage) return { image: post.coverImage, meta: imageMeta(post.coverImage) };
    if (post.coverGradient) return { gradient: post.coverGradient };
    return undefined;
}

/** A neighbour as the pager needs it, with the cover's manifest entry looked up here, on the server. */
const pagerPost = (post: JournalPost): PagerPost => ({
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    date: post.date,
    coverImage: post.coverImage,
    coverGradient: post.coverGradient,
    coverMeta: post.coverImage ? imageMeta(post.coverImage) : undefined,
});

export default async function Page({ params }: Props) {
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
        <PostPage band={bandOf(post)}>
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
                    <span>{post.kind}</span>
                </p>
            </header>

            {post.tracks.length > 0 && <Listening tracks={post.tracks} />}

            <div className="mt-16">
                <TableOfContents headings={headings} />
                <div className="flex flex-col gap-5">{content}</div>
            </div>

            {(newer || older) && (
                <nav
                    aria-label="More posts"
                    className={`mt-24 flex items-start justify-between gap-6 border-t ${HAIRLINE} pt-6`}
                >
                    {older ? <PostPager post={pagerPost(older)} direction="back" /> : <span />}
                    {newer && <PostPager post={pagerPost(newer)} direction="forward" />}
                </nav>
            )}
        </PostPage>
    );
}

/** What was playing while the post was written, each track with its own player when there is a file for it. */
function Listening({ tracks }: { tracks: JournalTrack[] }) {
    return (
        <section aria-label="Listening" className={`mt-12 flex flex-col gap-4 border-t ${HAIRLINE} pt-6`}>
            <p className={`font-geistMono text-meta ${MUTED}`}>listening</p>
            <ul className="flex flex-col gap-5">
                {tracks.map((track) => (
                    <AudioPlayer
                        key={track.title}
                        track={track}
                        art={track.albumArt ? imageMeta(track.albumArt) : undefined}
                    />
                ))}
            </ul>
        </section>
    );
}
