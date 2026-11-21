import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { imageMeta } from "../../../lib/images";
import { ImageLightbox } from "../image-lightbox";
import { MUTED } from "./styles";

export interface FigureProps {
    /** Site path under public/, e.g. "/cuda-mmm/split_k.webp". */
    src: string;
    alt: string;
    caption?: string;
    /** For diagrams drawn dark-on-white: in dark mode the image is inverted (hues kept) so it sits on the dark paper. */
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
            <span className="font-medium text-foreground">
                Figure {number}
                {children ? "." : ""}
            </span>
            {children && <> {children}</>}
        </>
    );
}

/**
 * How a raster figure sits on the page. In light mode the image is multiplied onto a quiet tile, so a plot's white
 * paper takes the tile's colour. In dark mode it is dimmed a step on the same tile, or, with `invert`, turned
 * light-on-dark (hues restored) and screened on so its paper drops away. Photos never invert.
 */
const RASTER = "mix-blend-multiply dark:mix-blend-normal";
const RASTER_DARK = "dark:opacity-90";
const RASTER_INVERT = "dark:invert dark:hue-rotate-180 dark:mix-blend-screen";

/** An image in the write-up, with an optional caption; clicking opens it in the lightbox. */
export function Figure({ src, alt, caption, invert, sizes, number }: FigureProps) {
    // Gallery photos (sizes set) and SVGs, which carry their own background or none, are left as they are.
    const raster = !sizes && !src.endsWith(".svg");
    const image = raster ? `${RASTER} ${invert ? RASTER_INVERT : RASTER_DARK}` : invert ? RASTER_INVERT : undefined;
    return (
        <div data-wide={sizes ? undefined : true} className={sizes ? undefined : "my-2"}>
            <ImageLightbox
                src={src}
                alt={alt}
                caption={number ? <FigureLabel number={number}>{caption}</FigureLabel> : caption}
                className={image}
                frameClassName={raster ? "bg-tile" : undefined}
                meta={imageMeta(src)}
                sizes={sizes}
            />
        </div>
    );
}

// A third of the frame from md up (three columns), half the viewport below it.
const GALLERY_SIZES = "(min-width: 1024px) 18rem, (min-width: 768px) 33vw, 50vw";

/**
 * A grid of <Figure>s: two across on phones, three from md up. The grid is numbered as one figure, but the label only
 * shows with a `caption`: each photo already carries its own, and a bare "Figure 1" under a photo set reads as noise.
 */
export function Gallery({ number, caption, children }: { number?: string; caption?: ReactNode; children?: ReactNode }) {
    const grid = (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Children.map(children, (child) =>
                isValidElement<FigureProps>(child) && child.type === Figure
                    ? cloneElement(child, { sizes: GALLERY_SIZES, number: undefined })
                    : child
            )}
        </div>
    );
    if (!number || !caption) return grid;
    return (
        <figure className="flex flex-col gap-2">
            {grid}
            <figcaption className={`text-small ${MUTED}`}>
                <FigureLabel number={number}>{caption}</FigureLabel>
            </figcaption>
        </figure>
    );
}
