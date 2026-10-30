import { MUTED } from "./styles";

/**
 * The `#` that appears at a heading's left margin when it is hovered or focused, linking to the heading's own anchor.
 * The heading needs `group relative` for it to show.
 */
export function HeadingAnchor({ id }: { id: string }) {
    return (
        <a
            href={`#${id}`}
            aria-label="Link to this section"
            className={`absolute -left-6 top-0 w-6 font-geistMono text-meta font-normal no-underline opacity-0 outline-none transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 ${MUTED}`}
        >
            #
        </a>
    );
}
