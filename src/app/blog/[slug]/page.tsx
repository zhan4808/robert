import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AudioPlayer from "../../components/audio-player";
import { HEADER, HEADER_SUBTITLE, HEADER_TITLE, MetaLine } from "../../components/meta-line";
import { ContentsButton, TableOfContents } from "../../components/mdx/toc";
import Link from "next/link";
import { getPost, getPosts, getVisiblePosts, hasPostPage } from "../../../lib/content";
import type { JournalPost, JournalTrack } from "../../../lib/content-schema";
import { imageMeta } from "../../../lib/images";
import { renderMdx } from "../../../lib/mdx";
import { pageMetadata } from "../../../lib/metadata";
import { readingMinutes } from "../../../lib/reading-time";
import { abbreviateDate, formatIsoDate, parseContentDate } from "../../../lib/site";
import PostPage, { PostCoverBand, PostPager, type Band, type PagerPost } from "./post-page";

const MUTED = "text-muted";
const HAIRLINE = "border-hairline";

/** How many visible parts a series has, for "Part 1 of 4". */
const seriesLength = (series: string) => getPosts().filter((p) => p.series === series && !p.hidden).length;

export const dynamicParams = false;

// Hidden posts are left out in production, so their URLs 404 like any unknown slug.
export function generateStaticParams() {
    return getPosts()
        .filter(hasPostPage)
        .map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPosts().find((entry) => entry.slug === slug);
    if (!post || !hasPostPage(post)) notFound();
    const path = `/blog/${post.slug}`;
    // In dev a hidden post still renders; cards are only drawn for visible posts, so it shares the site-wide card.
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
    if (!doc || !hasPostPage(doc.meta)) notFound();
    const post = doc.meta;

    // Previous and next step through the visible posts in order; a hidden draft (dev only) gets neither.
    const visible = getVisiblePosts();
    const at = visible.findIndex((p) => p.slug === slug);
    const newer = at > 0 ? visible[at - 1] : undefined;
    const older = at >= 0 && at < visible.length - 1 ? visible[at + 1] : undefined;

    const { content, headings } = await renderMdx(doc.body, `content/blog/${slug}.mdx`);

    return (
        <PostPage>
            <header className={HEADER}>
                <h1 className={HEADER_TITLE}>{post.title}</h1>
                <p className={HEADER_SUBTITLE}>{post.subtitle}</p>
                <MetaLine trailing={<ContentsButton count={headings.length} />}>
                    {abbreviateDate(post.date)}
                    {post.updated && `updated ${abbreviateDate(formatIsoDate(post.updated))}`}
                    {`${readingMinutes(doc.body)} min`}
                    {post.series && post.part && (
                        <a href="#series" className="ink-link">
                            Part {post.part} of {seriesLength(post.series)}
                        </a>
                    )}
                </MetaLine>
            </header>
            {bandOf(post) && <PostCoverBand band={bandOf(post)!} />}

            {post.tracks.length > 0 && <Listening tracks={post.tracks} />}

            <div className="mt-8">
                <TableOfContents headings={headings} />
                <div className="flex flex-col gap-5">{content}</div>
            </div>

            {post.series && <SeriesNav series={post.series} current={post.slug} />}

            {!post.series && (newer || older) && (
                <nav
                    aria-label="More posts"
                    className={`mt-20 flex items-start justify-between gap-6 border-t ${HAIRLINE} pt-6`}
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
            <p className={`text-small ${MUTED}`}>listening</p>
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

/** Every part of a series, in order, with this one marked; written once here instead of in each post. */
function SeriesNav({ series, current }: { series: string; current: string }) {
    const parts = getPosts()
        .filter((p) => p.series === series && !p.hidden)
        .sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
    return (
        <aside id="series" aria-label="Series" className="mt-16 scroll-mt-28 rounded-card bg-tile px-6 py-5">
            <p className="text-small text-muted">
                A {parts.length}-part series: <em className="font-serif text-[16px] text-foreground">{series}</em>
            </p>
            <ol className="mt-3 flex flex-col gap-1.5">
                {parts.map((p) => (
                    <li key={p.slug} className="grid grid-cols-[1.5rem_1fr] text-[15px] leading-snug">
                        <span className="tabular-nums text-muted">{p.part}</span>
                        {p.slug === current ? (
                            <span className="text-foreground">
                                {p.title} <span className="text-muted">· you are here</span>
                            </span>
                        ) : (
                            <Link href={`/blog/${p.slug}`} className="ink-link text-prose">
                                {p.title}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </aside>
    );
}
