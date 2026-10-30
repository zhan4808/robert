import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentBlocks } from "../../components/content-blocks";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import { getVisibleJournals, journalPosts, type JournalTrack } from "../../../lib/data";

const FRAME = "mx-auto w-full max-w-[56rem]";
const MUTED = "text-[var(--muted-color)]";
const HAIRLINE = "border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]";

export const dynamicParams = false;

export function generateStaticParams() {
    return journalPosts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = journalPosts.find((entry) => entry.slug === slug);
    return post ? { title: post.month, description: post.subtitle } : {};
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = journalPosts.find((p) => p.slug === slug);
    if (!post) notFound();

    // Previous and next step through the visible posts in order; hidden posts still open by URL.
    const visible = getVisibleJournals();
    const at = visible.findIndex((p) => p.slug === slug);
    const newer = at > 0 ? visible[at - 1] : undefined;
    const older = at >= 0 && at < visible.length - 1 ? visible[at + 1] : undefined;

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main className={`${FRAME} px-6 pb-40 pt-28 font-geistSans lg:pt-40`}>
                <header>
                    <Link
                        href="/writing"
                        className={`text-[14px] ${MUTED} outline-none transition-colors hover:text-foreground focus-visible:text-foreground`}
                    >
                        ← Writing
                    </Link>
                    <h1 className="mt-10 text-[28px] font-medium leading-[1.2] tracking-[-0.015em]">{post.month}</h1>
                    <p className={`mt-1 text-[16px] ${MUTED}`}>{post.subtitle}</p>
                    <p className={`mt-4 font-geistMono text-[12px] ${MUTED}`}>{post.date}</p>
                </header>

                {post.coverImage && (
                    <Image
                        src={post.coverImage}
                        alt=""
                        width={1920}
                        height={1080}
                        preload
                        sizes="(min-width: 1024px) 56rem, 100vw"
                        quality={90}
                        className="mt-12 block aspect-[2/1] h-auto w-full rounded-[6px] object-cover"
                    />
                )}

                {post.tracks.length > 0 && <Tracks tracks={post.tracks} />}

                <div className="mt-16">
                    <ContentBlocks blocks={post.blocks} />
                </div>

                {(newer || older) && (
                    <nav
                        aria-label="More writing"
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

/** What was playing while the post was written, with the audio right there when there is a file for it. */
function Tracks({ tracks }: { tracks: JournalTrack[] }) {
    return (
        <section aria-label="Listening" className="mt-12 flex flex-col gap-3">
            <p className={`font-geistMono text-[13px] ${MUTED}`}>listening</p>
            <ul className="flex flex-col gap-3">
                {tracks.map((track) => (
                    <li key={track.title} className="flex items-center gap-4">
                        {track.albumArt && (
                            <Image
                                src={track.albumArt}
                                alt=""
                                width={48}
                                height={48}
                                className="size-12 shrink-0 rounded-[4px] object-cover"
                            />
                        )}
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-[15px]">{track.title}</span>
                            <span className={`truncate text-[13px] ${MUTED}`}>{track.artist}</span>
                        </span>
                        {track.audioSrc && (
                            <audio src={track.audioSrc} controls preload="none" className="h-8 max-w-[14rem]" />
                        )}
                        {!track.audioSrc && track.spotifyUrl && (
                            <a
                                href={track.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`ink-link font-geistMono text-[12px] ${MUTED}`}
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
    post: { slug: string; month: string };
    label: string;
    back?: boolean;
}) {
    return (
        <Link
            href={`/writing/${post.slug}`}
            className={`group flex flex-col gap-1 outline-none ${back ? "items-start" : "items-end text-right"}`}
        >
            <span className={`font-geistMono text-[12px] ${MUTED}`}>{label}</span>
            <span className="text-[16px] decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {back ? `← ${post.month}` : `${post.month} →`}
            </span>
        </Link>
    );
}
