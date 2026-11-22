"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Heading } from "../../../lib/mdx";
import { HAIRLINE, MUTED } from "./styles";

/** Below this many headings a write-up is short enough to take in without a contents list. */
export const MIN_HEADINGS = 3;
const SHEET_ID = "contents-sheet";

// Whether the narrow-screen contents list is open. The button lives in the header's meta line and the list above the
// body, so they share this rather than a parent's state.
let sheetOpen = false;
const listeners = new Set<() => void>();
const setSheetOpen = (open: boolean) => {
    sheetOpen = open;
    listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
const useSheetOpen = () =>
    useSyncExternalStore(
        subscribe,
        () => sheetOpen,
        () => false
    );

/**
 * "Contents" in the header's meta line on narrow screens, where there is no rail: it opens and closes the list above
 * the body. Nothing is drawn for a write-up with too few headings, or once the rail has room.
 */
export function ContentsButton({ count }: { count: number }) {
    const open = useSheetOpen();
    if (count < MIN_HEADINGS) return null;
    return (
        <span className="min-[1120px]:hidden">
            <span aria-hidden> · </span>
            <button
                type="button"
                aria-expanded={open}
                aria-controls={SHEET_ID}
                onClick={() => setSheetOpen(!open)}
                className="ink-link focus-ring"
            >
                Contents
            </button>
        </span>
    );
}
/** The viewport band, as a share of its height from the top, that a heading has to be above to count as current. */
const BAND = 0.25;

/**
 * The write-up's contents, from the headings the compiler read: a rail in the left margin on wide screens that
 * follows the reader down the page, and on narrow ones a list above the body that the header's "Contents" button
 * opens. Rendered only when there are enough headings to be worth it.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
    const active = useActiveHeading(headings);
    const open = useSheetOpen();
    const sheet = useRef<HTMLElement>(null);
    // A new page starts with the list closed.
    useEffect(() => () => setSheetOpen(false), []);
    // The list opens below the cover band or hero, often off screen on a phone, so bring it into view and move focus
    // to its first link; otherwise the button would look dead.
    useEffect(() => {
        if (!open || !sheet.current) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        sheet.current.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
        sheet.current.querySelector("a")?.focus({ preventScroll: true });
    }, [open]);
    if (headings.length < MIN_HEADINGS) return null;
    const list = (
        <ol className={`flex flex-col border-l ${HAIRLINE}`}>
            {headings.map((heading) => (
                <li key={heading.id}>
                    <a
                        href={`#${heading.id}`}
                        aria-current={heading.id === active ? "location" : undefined}
                        className={`-ml-px block border-l-2 py-1 leading-snug focus-ring transition-colors hover:text-foreground focus-visible:text-foreground ${
                            heading.depth === 3 ? "pl-6 text-[13px]" : "pl-3 text-small"
                        } ${heading.id === active ? "border-koi text-foreground" : `border-transparent ${MUTED}`}`}
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
                // Sits in the margin outside the 42rem column, its right edge a step clear of the column's padding, and
                // only when there is room for it there.
                className="fixed top-32 hidden w-[11rem] max-h-[calc(100vh-12rem)] overflow-y-auto min-[1120px]:block"
                style={{ right: "calc(50% + 21rem + 1.5rem)" }}
            >
                <p className={`mb-3 text-small ${MUTED}`}>Contents</p>
                {list}
            </nav>
            {open && (
                <nav
                    ref={sheet}
                    id={SHEET_ID}
                    aria-label="Contents"
                    className="mb-10 scroll-mt-24 min-[1120px]:hidden"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest("a")) setSheetOpen(false);
                    }}
                >
                    {list}
                </nav>
            )}
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
