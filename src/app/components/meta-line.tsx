import { Children, Fragment, type ReactNode } from "react";

/** A post's or project's title, and the one italic serif line under it. Both pages draw the same header. */
export const HEADER_TITLE = "font-serif text-[28px] font-normal leading-[1.15] sm:text-title [text-wrap:balance]";
export const HEADER_SUBTITLE = "mt-3 font-serif text-[20px] italic leading-snug text-muted [text-wrap:pretty]";
/** The header's one hairline, under the meta line, and the gap to what follows it. */
export const HEADER = "border-b border-hairline pb-6";

/**
 * The line under a post's or project's title: date, reading time, and the rest, in the sans, small and muted, with a
 * dot between items. Falsy children are skipped, so items can be written conditionally. A child that draws its own
 * separator (the "Contents" button, which hides on wide screens) goes last.
 */
export function MetaLine({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
    const items = Children.toArray(children).filter(Boolean);
    return (
        <p className="mt-4 text-small tabular-nums text-muted [text-wrap:pretty]">
            {items.map((item, i) => (
                <Fragment key={i}>
                    {i > 0 && <span aria-hidden> · </span>}
                    {item}
                </Fragment>
            ))}
            {trailing}
        </p>
    );
}
