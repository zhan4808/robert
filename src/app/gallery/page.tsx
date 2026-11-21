"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import PondImage from "../components/pond-image";
import SiteFooter from "../components/site-footer";
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

/** Two columns from sm up, picked so they come out close in height; one stack on phones. */
const COLUMNS = [
    [0, 2, 4],
    [1, 3, 5],
];
/** The order the works read in, and step through in the lightbox. */
const HANG = [0, 1, 2, 3, 4, 5];

const details = (work: Work) => [work.place, work.year].filter(Boolean).join(" · ");

export default function Gallery() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <TopNav />
            <main id="main" tabIndex={-1} className="mx-auto w-full max-w-column px-6 pt-14 outline-none sm:pt-20">
                <header className="mb-10">
                    <h1 className="font-serif text-[28px] font-normal leading-[1.15] sm:text-title">Photos</h1>
                    <p className="mt-2 font-serif text-[19px] italic text-muted">the spaces between.</p>
                </header>

                <section aria-label="Photos" className="grid gap-x-5 gap-y-10 sm:grid-cols-2">
                    {COLUMNS.map((column) => (
                        <div key={column[0]} className="contents sm:flex sm:flex-col sm:gap-10">
                            {column.map((i) => {
                                const work = WORKS[i];
                                return (
                                    <figure key={work.title} className="min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(i)}
                                            aria-label={`View ${work.title} larger`}
                                            className="block w-full cursor-zoom-in focus-ring"
                                        >
                                            <PondImage
                                                src={work.src}
                                                alt={work.title}
                                                ratio={work.src.width / work.src.height}
                                                sizes="(min-width: 640px) 21rem, 100vw"
                                                priority={i < 2}
                                            />
                                        </button>
                                        <figcaption className="mt-2.5 flex items-baseline justify-between gap-3 text-small">
                                            <span className="truncate">{work.title}</span>
                                            <span className="shrink-0 tabular-nums text-muted">{details(work)}</span>
                                        </figcaption>
                                    </figure>
                                );
                            })}
                        </div>
                    ))}
                </section>
            </main>
            <SiteFooter />

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
