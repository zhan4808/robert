import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { imageMeta } from "../../../lib/images";
import { ImageLightbox } from "../image-lightbox";
import { MUTED } from "./styles";

export interface FigureProps {
    /** Site path under public/, e.g. "/cuda-mmm/split_k.webp". */
    src: string;
    alt: string;
    caption?: string;
    /** For diagrams drawn dark-on-white: inverts the image so it sits on the dark theme too. */
    invert?: boolean;
    /** How wide the thumbnail renders, for the srcset; <Gallery> sets this on its figures. */
    sizes?: string;
    /** Its place in the page's figures, set at compile time (figures inside a <Gallery> share the gallery's). */
    number?: string;
}

/** "Figure N." in mono, in the foreground colour, ahead of the caption; "Figure N" on its own without one. */
function FigureLabel({ number, children }: { number: string; children?: ReactNode }) {
    return (
        <>
            <span className="text-foreground">
                Figure {number}
                {children ? "." : ""}
            </span>
            {children && <> {children}</>}
        </>
    );
}

/** An image in the write-up, with an optional caption; clicking opens it in the lightbox. */
export function Figure({ src, alt, caption, invert, sizes, number }: FigureProps) {
    return (
        <ImageLightbox
            src={src}
            alt={alt}
            caption={number ? <FigureLabel number={number}>{caption}</FigureLabel> : caption}
            className={invert ? "invert" : undefined}
            meta={imageMeta(src)}
            sizes={sizes}
        />
    );
}

// A third of the frame from md up (three columns), half the viewport below it.
const GALLERY_SIZES = "(min-width: 1024px) 18rem, (min-width: 768px) 33vw, 50vw";

/** A grid of <Figure>s: two across on phones, three from md up. The grid is numbered as one figure. */
export function Gallery({ number, children }: { number?: string; children?: ReactNode }) {
    const grid = (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Children.map(children, (child) =>
                isValidElement<FigureProps>(child) && child.type === Figure
                    ? cloneElement(child, { sizes: GALLERY_SIZES, number: undefined })
                    : child
            )}
        </div>
    );
    if (!number) return grid;
    return (
        <figure className="flex flex-col gap-2">
            {grid}
            <figcaption className={`font-geistMono text-caption ${MUTED}`}>
                <FigureLabel number={number} />
            </figcaption>
        </figure>
    );
}
