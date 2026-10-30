import Link from "next/link";
import Cursor from "../components/cursor";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import { getPost, getVisiblePostsByYear } from "../../lib/content";
import type { JournalPost } from "../../lib/content-schema";
import { imageMeta } from "../../lib/images";
import { readingMinutes } from "../../lib/reading-time";
import { PostCover } from "./post-cover";

const MUTED = "text-muted";
// The cover is 7rem wide from sm up and spans the entry below that.
const COVER_SIZES = "(min-width: 640px) 7rem, 100vw";

/** Every post, newest year first, as one quiet list. */
export default function Blog() {
    const years = [...getVisiblePostsByYear().entries()];

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main
                id="main"
                tabIndex={-1}
                className="mx-auto flex w-full max-w-column flex-col gap-14 px-6 pb-40 pt-28 outline-none lg:gap-20 lg:pt-40"
            >
                <header className="flex flex-col gap-4 font-geistMono">
                    <h1 className="sr-only">Blog</h1>
                    <p className="text-small lowercase leading-relaxed tracking-tagline opacity-60">
                        notes on kernels, chips, and everything else.
                        <Cursor />
                    </p>
                </header>

                <section className="flex flex-col gap-12 font-geistSans">
                    {years.map(([year, posts]) => (
                        <div key={year} className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                            <h2 className={`shrink-0 font-geistMono text-meta tabular-nums lg:w-16 ${MUTED}`}>
                                {year}
                            </h2>
                            <ul className="flex min-w-0 flex-1 flex-col">
                                {posts.map((post) => (
                                    <Entry key={post.slug} post={post} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

/** One post: its cover beside the title, subtitle, and a mono line with the date, length, and kind. */
function Entry({ post }: { post: JournalPost }) {
    const minutes = readingMinutes(getPost(post.slug)?.body ?? "");
    return (
        <li className="border-t border-hairline last:border-b">
            <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-4 py-5 focus-ring sm:flex-row sm:items-start sm:gap-6"
            >
                <PostCover
                    post={post}
                    meta={post.coverImage ? imageMeta(post.coverImage) : undefined}
                    sizes={COVER_SIZES}
                    className="w-full shrink-0 sm:w-28"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-body decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                        {post.title}
                    </span>
                    <span className={`text-small ${MUTED}`}>{post.subtitle}</span>
                    <span className={`mt-1 font-geistMono text-caption tabular-nums ${MUTED}`}>
                        {post.date} · {minutes} min read · {post.kind}
                    </span>
                </span>
            </Link>
        </li>
    );
}
