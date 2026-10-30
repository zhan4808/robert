"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import horseback from "../../../public/IMG_1493.webp";
import seaRanch from "../../../public/IMG_1760.webp";
import coastline from "../../../public/IMG_1887.webp";
import hoover from "../../../public/IMG_2767.webp";
import stars from "../../../public/IMG_2847.webp";
import newYork from "../../../public/IMG_3691.webp";

type Work = {
    title: string;
    src: StaticImageData;
    /** Where it was taken, when known. */
    place?: string;
    year: string;
};

const WORKS: Work[] = [
    { title: "Horseback on the beach", src: horseback, year: "2025" },
    { title: "Sea Ranch", src: seaRanch, place: "California", year: "2025" },
    { title: "Rugged coastline", src: coastline, year: "2025" },
    { title: "Hoover Wilderness", src: hoover, place: "backpacking", year: "2025" },
    { title: "Stargazing", src: stars, year: "2025" },
    { title: "New York weekend", src: newYork, year: "2025" },
];

/** Works by column on desktop, top to bottom, picked so the columns come out close in height. */
const COLUMNS = [
    [0, 3],
    [1, 4],
    [2, 5],
];
/** The order the works read in, and step through in the lightbox. */
const HANG = COLUMNS.flat();
const GAP_REM = 1; // matches lg:gap-4 between and within columns
const MOST = Math.max(...COLUMNS.map((c) => c.length));

/**
 * Sizes a column so every column ends at the same height: width grows with 1/(sum of height/width), and the basis
 * makes up for columns with fewer gaps.
 */
function columnFlex(works: number[]) {
    const ratio = works.reduce((sum, i) => sum + WORKS[i].src.height / WORKS[i].src.width, 0);
    return `${1 / ratio} 1 ${((MOST - works.length) * GAP_REM) / ratio}rem`;
}

const UNDERLINE =
    "underline decoration-faint decoration-1 underline-offset-[5px] focus-ring transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

const details = (work: Work) => [work.place, work.year].filter(Boolean).join(" · ");

export default function Gallery() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main
                id="main"
                tabIndex={-1}
                className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 px-6 pb-24 pt-28 outline-none lg:gap-20 lg:px-[6vw] lg:pt-36"
            >
                <header className="flex flex-col gap-6 font-geistMono lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="sr-only">Gallery</h1>
                        <p className="text-small lowercase leading-relaxed tracking-tagline opacity-60">
                            the spaces between.
                            <span
                                aria-hidden="true"
                                className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
                            />
                        </p>
                        <p className="max-w-[32rem] font-geistSans text-body leading-compact opacity-80 [text-wrap:pretty]">
                            Photos from outside the lab.
                        </p>
                    </div>
                    <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${UNDERLINE} self-start text-small opacity-60 hover:opacity-100 focus-visible:opacity-100 lg:self-end`}
                    >
                        instagram
                    </a>
                </header>

                <section aria-label="Works" className="flex flex-col gap-y-16 lg:flex-row lg:items-start lg:gap-4">
                    {COLUMNS.map((column) => (
                        // On phones the columns drop away and the works stack in one list.
                        <div
                            key={column[0]}
                            className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4"
                            style={{ flex: columnFlex(column) }}
                        >
                            {column.map((i) => {
                                const work = WORKS[i];
                                return (
                                    <figure key={work.title} className="group relative min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(i)}
                                            aria-label={`View ${work.title} larger`}
                                            className="block w-full overflow-hidden rounded-[3px] focus-ring"
                                        >
                                            <Image
                                                src={work.src}
                                                alt={work.title}
                                                placeholder="blur"
                                                sizes="(min-width: 1024px) 33vw, 100vw"
                                                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                                                preload={i === HANG[0]}
                                            />
                                        </button>
                                        {/* Under the work on phones; on desktop it shows over the corner on hover, so the tiles sit flush. */}
                                        <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-geistMono text-caption lg:pointer-events-none lg:absolute lg:bottom-3 lg:left-3 lg:mt-0 lg:max-w-[calc(100%-1.5rem)] lg:rounded-full lg:bg-[rgb(0_0_0/0.55)] lg:px-3 lg:py-1.5 lg:text-dark-foreground lg:opacity-0 lg:backdrop-blur-md lg:transition-opacity lg:duration-300 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
                                            <span className="truncate">{work.title}</span>
                                            <span className="shrink-0 tabular-nums opacity-50 lg:opacity-60">
                                                {details(work)}
                                            </span>
                                        </figcaption>
                                    </figure>
                                );
                            })}
                        </div>
                    ))}
                </section>
            </main>

            <Lightbox index={open} onClose={() => setOpen(null)} onStep={setOpen} />
        </div>
    );
}

const SIDE_BUTTON =
    "h-24 w-[6vw] shrink-0 text-[22px] opacity-40 focus-ring transition-opacity hover:opacity-100 focus-visible:opacity-100 max-lg:hidden";
// Clicks anywhere else in the viewer close it.
const STAY_OPEN = "img, button, [data-stay-open]";
const SMALL_BUTTON = "opacity-50 focus-ring transition-opacity hover:opacity-100 focus-visible:opacity-100 lg:hidden";

/** One piece on its own, as large as fits. Arrow keys or a swipe step through the works and Escape closes. */
function Lightbox({
    index,
    onClose,
    onStep,
}: {
    index: number | null;
    onClose: () => void;
    onStep: (i: number) => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const swipeStart = useRef<{ x: number; y: number } | null>(null);
    const isOpen = index !== null;

    const step = useCallback(
        (by: number) => {
            if (index === null) return;
            const at = HANG.indexOf(index);
            onStep(HANG[(at + by + HANG.length) % HANG.length]);
        },
        [index, onStep]
    );

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        else if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, step]);

    const work = index !== null ? WORKS[index] : null;

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(e) => {
                if (!(e.target as HTMLElement).closest(STAY_OPEN)) onClose();
            }}
            onTouchStart={(e) => {
                swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }}
            onTouchEnd={(e) => {
                const start = swipeStart.current;
                swipeStart.current = null;
                if (!start) return;
                const dx = e.changedTouches[0].clientX - start.x;
                const dy = e.changedTouches[0].clientY - start.y;
                if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
            }}
            className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-dark-foreground backdrop:bg-[rgb(0_0_0/0.92)]"
        >
            {work && (
                <div className="flex h-full w-full items-center justify-center font-geistMono">
                    <button type="button" onClick={() => step(-1)} aria-label="Previous" className={SIDE_BUTTON}>
                        ←
                    </button>
                    <figure className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
                        <Image
                            key={work.title}
                            src={work.src}
                            alt={work.title}
                            sizes="100vw"
                            quality={90}
                            className="max-h-[80vh] w-auto max-w-full rounded-[3px] object-contain"
                        />
                        <figcaption data-stay-open className="flex items-baseline gap-3 text-caption">
                            <span>{work.title}</span>
                            <span className="opacity-50">{details(work)}</span>
                        </figcaption>
                        <div data-stay-open className="flex items-center gap-6 text-small">
                            <button
                                type="button"
                                onClick={() => step(-1)}
                                aria-label="Previous"
                                className={SMALL_BUTTON}
                            >
                                ←
                            </button>
                            <button type="button" onClick={onClose} className={`${SMALL_BUTTON} text-caption`}>
                                close
                            </button>
                            <button type="button" onClick={() => step(1)} aria-label="Next" className={SMALL_BUTTON}>
                                →
                            </button>
                        </div>
                    </figure>
                    <button type="button" onClick={() => step(1)} aria-label="Next" className={SIDE_BUTTON}>
                        →
                    </button>
                </div>
            )}
        </dialog>
    );
}
