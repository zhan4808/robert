import Link from "next/link";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import { getVisibleJournalsByYear } from "../../lib/data";

const MUTED = "text-[var(--muted-color)]";

/** Every post, newest year first, as one quiet list. */
export default function Blog() {
    const years = [...getVisibleJournalsByYear().entries()];

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main className="mx-auto flex w-full max-w-[56rem] flex-col gap-14 px-6 pb-40 pt-28 lg:gap-20 lg:pt-40">
                <header className="flex flex-col gap-4 font-geistMono">
                    <h1 className="sr-only">Blog</h1>
                    <p className="text-[14px] lowercase leading-relaxed tracking-[0.02em] opacity-60">
                        notes on kernels, chips, and everything else.
                        <span
                            aria-hidden="true"
                            className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
                        />
                    </p>
                </header>

                <section className="flex flex-col gap-12 font-geistSans">
                    {years.map(([year, posts]) => (
                        <div key={year} className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                            <h2 className={`shrink-0 font-geistMono text-[13px] tabular-nums lg:w-16 ${MUTED}`}>
                                {year}
                            </h2>
                            <ul className="flex min-w-0 flex-1 flex-col">
                                {posts.map((post) => (
                                    <li
                                        key={post.slug}
                                        className="border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] last:border-b"
                                    >
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="group flex flex-col gap-1 py-4 outline-none sm:flex-row sm:items-baseline sm:gap-6"
                                        >
                                            <span className="text-[16px] decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                                                {post.month}
                                            </span>
                                            <span className={`min-w-0 flex-1 text-[14px] ${MUTED}`}>
                                                {post.subtitle}
                                            </span>
                                            <span
                                                className={`shrink-0 font-geistMono text-[12px] tabular-nums ${MUTED}`}
                                            >
                                                {post.date}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
