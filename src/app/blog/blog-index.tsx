"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Entry } from "../../lib/content";
import { EntryRow, KINDS, type Kind } from "../components/entries";

type Filter = "all" | Kind;
const FILTERS: Filter[] = ["all", "technical", "project", "journal"];
const LABEL: Record<Filter, string> = { all: "All", technical: "Research", project: "Projects", journal: "Life" };
// The filter a link can ask for: /blog?filter=projects.
const FROM_QUERY: Record<string, Filter> = { research: "technical", projects: "project", life: "journal" };

/**
 * Every post and project, grouped by year, with a row of filters above. Switching filter folds away the rows that
 * leave and lets the rest close up, so the list never jumps.
 */
export default function BlogIndex({ years }: { years: [number, Entry[]][] }) {
    const [filter, setFilter] = useState<Filter>("all");
    const still = useReducedMotion() ?? false;

    // Arriving from /projects (or a shared link) opens the index already filtered.
    useEffect(() => {
        const asked = FROM_QUERY[new URLSearchParams(window.location.search).get("filter") ?? ""];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration
        if (asked) setFilter(asked);
    }, []);

    const pick = (f: Filter) => {
        setFilter(f);
        const url = new URL(window.location.href);
        const key = Object.entries(FROM_QUERY).find(([, v]) => v === f)?.[0];
        if (key) url.searchParams.set("filter", key);
        else url.searchParams.delete("filter");
        window.history.replaceState(null, "", url);
    };

    const shown = years
        .map(([year, entries]) => [year, entries.filter((e) => filter === "all" || e.kind === filter)] as const)
        .filter(([, entries]) => entries.length > 0);

    return (
        <>
            <div role="group" aria-label="Filter" className="flex flex-wrap gap-x-5 gap-y-2 text-small">
                {FILTERS.map((f) => {
                    const on = f === filter;
                    return (
                        <button
                            key={f}
                            type="button"
                            aria-pressed={on}
                            onClick={() => pick(f)}
                            className={`inline-flex items-center gap-2 focus-ring transition-colors duration-150 ${
                                on ? "text-foreground" : "text-muted hover:text-foreground"
                            }`}
                        >
                            <span
                                aria-hidden
                                className={`h-[6px] w-[6px] rounded-full ${
                                    f === "all" ? "bg-foreground" : KINDS[f].dot
                                }`}
                            />
                            {LABEL[f]}
                        </button>
                    );
                })}
            </div>

            <div className="mt-10 flex flex-col gap-9">
                <AnimatePresence initial={false} mode="popLayout">
                    {shown.map(([year, entries]) => (
                        <motion.section
                            key={year}
                            layout={!still}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="mb-2 border-b border-hairline pb-2 text-small font-medium tabular-nums text-muted">
                                {year}
                            </h2>
                            <ul>
                                <AnimatePresence initial={false} mode="popLayout">
                                    {entries.map((entry) => (
                                        <motion.li
                                            key={entry.href}
                                            layout={!still}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <EntryRow entry={entry} bare />
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
