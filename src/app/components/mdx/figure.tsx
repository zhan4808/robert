import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { imageMeta } from "../../../lib/images";
import { ImageLightbox } from "../image-lightbox";

export interface FigureProps {
    /** Site path under public/, e.g. "/cuda-mmm/split_k.webp". */
    src: string;
    alt: string;
    caption?: string;
    /** For diagrams drawn dark-on-white: inverts the image so it sits on the dark theme too. */
    invert?: boolean;
    /** How wide the thumbnail renders, for the srcset; <Gallery> sets this on its figures. */
    sizes?: string;
}

/** An image in the write-up, with an optional caption; clicking opens it in the lightbox. */
export function Figure({ src, alt, caption, invert, sizes }: FigureProps) {
    return (
        <ImageLightbox
            src={src}
            alt={alt}
            caption={caption}
            className={invert ? "invert" : undefined}
            meta={imageMeta(src)}
            sizes={sizes}
        />
    );
}

// A third of the frame from md up (three columns), half the viewport below it.
const GALLERY_SIZES = "(min-width: 1024px) 18rem, (min-width: 768px) 33vw, 50vw";

/** A grid of <Figure>s: two across on phones, three from md up. */
export function Gallery({ children }: { children?: ReactNode }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Children.map(children, (child) =>
                isValidElement<FigureProps>(child) && child.type === Figure
                    ? cloneElement(child, { sizes: GALLERY_SIZES })
                    : child
            )}
        </div>
    );
}
