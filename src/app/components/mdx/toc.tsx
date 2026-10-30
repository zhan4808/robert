"use client";

import { useEffect, useState } from "react";
import type { Heading } from "../../../lib/mdx";
import { HAIRLINE, MUTED } from "./styles";

/** Below this many headings a write-up is short enough to take in without a contents list. */
const MIN_HEADINGS = 3;
/** The viewport band, as a share of its height from the top, that a heading has to be above to count as current. */
const BAND = 0.25;

/**
 * The write-up's contents, from the headings the compiler read: a rail in the left margin on wide screens that
 * follows the reader down the page, and a collapsible list above the body on narrow ones. Rendered only when there
 * are enough headings to be worth it.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
    const active = useActiveHeading(headings);
    if (headings.length < MIN_HEADINGS) return null;
    const list = (
        <ol className={`flex flex-col border-l ${HAIRLINE}`}>
            {headings.map((heading) => (
                <li key={heading.id}>
                    <a
                        href={`#${heading.id}`}
                        aria-current={heading.id === active ? "location" : undefined}
                        className={`-ml-px block border-l-2 py-1 font-geistMono leading-[1.5] outline-none transition-colors hover:text-foreground focus-visible:text-foreground ${
                            heading.depth === 3 ? "pl-6 text-[11px]" : "pl-3 text-[12px]"
                        } ${heading.id === active ? "border-foreground text-foreground" : `border-transparent ${MUTED}`}`}
                    >
                        {heading.text}
                    </a>
                </li>
            ))}
        </ol>
    );
    return (
        <>
            <nav
                aria-label="Contents"
                // Sits in the margin outside the 56rem column, its right edge a step clear of the column's padding, and
                // only when there is room for it there.
                className="fixed top-40 hidden w-[10rem] max-h-[calc(100vh-14rem)] overflow-y-auto min-[1280px]:block"
                style={{ right: "calc(50% + 28rem + 1.5rem)" }}
            >
                <p className={`mb-3 font-geistMono text-[12px] ${MUTED}`}>contents</p>
                {list}
            </nav>
            <details className="group mb-10 min-[1280px]:hidden">
                <summary
                    className={`w-fit cursor-pointer list-none font-geistMono text-[12px] outline-none transition-colors hover:text-foreground focus-visible:text-foreground [&::-webkit-details-marker]:hidden ${MUTED}`}
                >
                    contents <span className="inline-block transition-transform group-open:rotate-90">→</span>
                </summary>
                <div className="mt-3">{list}</div>
            </details>
        </>
    );
}

/** The id of the heading the reader is at: the last one above the top band of the viewport. */
function useActiveHeading(headings: Heading[]): string | undefined {
    const [active, setActive] = useState<string>();
    useEffect(() => {
        const elements = headings
            .map((heading) => document.getElementById(heading.id))
            .filter((element): element is HTMLElement => element !== null);
        if (elements.length === 0) return;
        // The observed area is everything above the band line, so a heading "intersects" once the reader has
        // scrolled past it. The observer reports each crossing, however far the page jumped, and the current heading
        // is the last one past.
        const passed = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) passed.add(entry.target.id);
                    else passed.delete(entry.target.id);
                }
                setActive(elements.findLast((element) => passed.has(element.id))?.id);
            },
            { rootMargin: `100000px 0px -${Math.round((1 - BAND) * 100)}% 0px` }
        );
        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [headings]);
    return active;
}
