import type { Metadata } from "next";
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
import PostPage, { PostCoverBand, PostPager, type Band, type PagerPost } from "./post-page";
import { KindTag } from "../../components/entries";

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
        <PostPage>
            <header>
                <h1 className="font-serif text-[28px] font-normal leading-[1.15] sm:text-title [text-wrap:balance]">{post.title}</h1>
                <p className="mt-2 font-serif text-[19px] italic leading-snug text-muted [text-wrap:pretty]">
                    {post.subtitle}
                </p>
                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 whitespace-pre-wrap border-b border-hairline pb-5 font-geistMono text-caption tabular-nums text-muted">
                    <span>
                        {[
                            post.date,
                            post.updated && `updated ${formatIsoDate(post.updated)}`,
                            `${readingMinutes(doc.body)} min`,
                            post.series && post.part && `part ${post.part} of ${post.series}`,
                        ]
                            .filter(Boolean)
                            .join("  ·  ")}
                    </span>
                    <KindTag kind={post.kind} className="ml-auto" />
                </p>
                {bandOf(post) && <PostCoverBand band={bandOf(post)!} />}
            </header>

            {post.tracks.length > 0 && <Listening tracks={post.tracks} />}

            <div className="mt-10">
                <TableOfContents headings={headings} />
                <div className="flex flex-col gap-5">{content}</div>
            </div>

            {(newer || older) && (
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
