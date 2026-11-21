"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { JournalPost } from "../../lib/content-schema";
import { KINDS, PostRow } from "../components/entries";

type Filter = "all" | JournalPost["kind"];
const FILTERS: Filter[] = ["all", "technical", "journal"];

/**
 * Every visible post grouped by year, with a row of filters above. Switching filter folds away the rows that leave
 * and lets the rest close up, so the list never jumps.
 */
export default function BlogIndex({ years }: { years: [number, JournalPost[]][] }) {
    const [filter, setFilter] = useState<Filter>("all");
    const still = useReducedMotion() ?? false;
    const shown = years
        .map(([year, posts]) => [year, posts.filter((p) => filter === "all" || p.kind === filter)] as const)
        .filter(([, posts]) => posts.length > 0);

    return (
        <>
            <div role="group" aria-label="Filter posts" className="flex gap-4 font-geistMono text-caption">
                {FILTERS.map((f) => {
                    const on = f === filter;
                    return (
                        <button
                            key={f}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setFilter(f)}
                            className={`inline-flex items-center gap-1.5 focus-ring transition-colors duration-150 ${
                                on ? "text-foreground" : "text-muted hover:text-foreground"
                            }`}
                        >
                            <span
                                aria-hidden
                                className={`h-[5px] w-[5px] rounded-full transition-opacity ${
                                    f === "all" ? "bg-foreground" : KINDS[f].dot
                                } ${on ? "opacity-100" : "opacity-40"}`}
                            />
                            {f === "all" ? "all" : KINDS[f].label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-10 flex flex-col gap-9">
                <AnimatePresence initial={false} mode="popLayout">
                    {shown.map(([year, posts]) => (
                        <motion.section
                            key={year}
                            layout={!still}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="mb-1 border-b border-hairline pb-2 font-geistMono text-caption tabular-nums text-muted">
                                {year}
                            </h2>
                            <ul>
                                <AnimatePresence initial={false} mode="popLayout">
                                    {posts.map((post) => (
                                        <motion.li
                                            key={post.slug}
                                            layout={!still}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <PostRow post={post} bare />
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </motion.section>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
