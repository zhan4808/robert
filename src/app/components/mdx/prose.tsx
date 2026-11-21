import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import InlineLink from "../inline-link";
import { CopyButton } from "./copy-button";
import { HeadingAnchor } from "./heading-anchor";
import { BODY, HAIRLINE, MUTED, PANEL, PROSE } from "./styles";

/**
 * The Markdown elements of a write-up, styled. MDX renders every paragraph, heading, list, table, and code block
 * through these, so the body of a file needs no classes of its own.
 */

type PProps = ComponentProps<"p"> & {
    /** Set by <Quote> on the paragraph it wraps: italic, in quotation marks. */
    variant?: "quote";
};

export function P({ variant, children, ...props }: PProps) {
    if (variant === "quote") {
        return (
            <p {...props} className={`${BODY} ${PROSE} italic`}>
                &ldquo;{children}&rdquo;
            </p>
        );
    }
    return (
        <p {...props} className={`${BODY} ${PROSE}`}>
            {children}
        </p>
    );
}

/** The headings get an id from the compiler and a `#` link to it at the left margin on hover. */
export function H2({ id, className, children, ...props }: ComponentProps<"h2">) {
    // GFM's footnotes section opens with a visually hidden "Footnotes" heading, which stays hidden.
    if (className?.includes("sr-only")) {
        return (
            <h2 {...props} id={id} className="sr-only">
                {children}
            </h2>
        );
    }
    return (
        <h2
            {...props}
            id={id}
            className="group relative mt-10 scroll-mt-28 font-serif text-[26px] font-normal leading-[1.2] text-foreground"
        >
            {id && <HeadingAnchor id={id} />}
            {children}
        </h2>
    );
}

export function H3({ id, children, ...props }: ComponentProps<"h3">) {
    return (
        <h3
            {...props}
            id={id}
            className="group relative mt-4 scroll-mt-28 text-[18px] font-medium leading-snug text-foreground"
        >
            {id && <HeadingAnchor id={id} />}
            {children}
        </h3>
    );
}

export function Ul(props: ComponentProps<"ul">) {
    return <ul {...props} className={`list-disc space-y-1.5 pl-5 ${BODY} ${PROSE}`} />;
}

/** Numbered in mono by the `.prose-ol` counter in globals.css. */
export function Ol(props: ComponentProps<"ol">) {
    return <ol {...props} className={`prose-ol space-y-1.5 ${BODY} ${PROSE}`} />;
}

export function Hr(props: ComponentProps<"hr">) {
    return <hr {...props} className={`my-2 border-t ${HAIRLINE}`} />;
}

export function Strong(props: ComponentProps<"strong">) {
    return <strong {...props} className="font-medium text-foreground" />;
}

type AProps = ComponentProps<"a"> & {
    /** Set by GFM on a footnote's number in the text, and on the arrow that leads back from the footnote. */
    "data-footnote-ref"?: boolean;
    "data-footnote-backref"?: string;
};

export function A({ href = "#", children, ...props }: AProps) {
    if (props["data-footnote-ref"]) {
        return (
            <a {...props} href={href} className={`footnote-ref text-[12px] ${MUTED}`}>
                {children}
            </a>
        );
    }
    if (props["data-footnote-backref"] !== undefined) {
        return (
            <a {...props} href={href} className="footnote-backref">
                {children}
            </a>
        );
    }
    return <InlineLink href={href}>{children}</InlineLink>;
}

/**
 * A pulled quote, with the person it is from when there is one. Written as `<Quote author="...">text</Quote>` or as
 * a plain Markdown `> text`; either way the paragraph inside is set in italics between quotation marks.
 */
export function Quote({ author, children }: { author?: string; children?: ReactNode }) {
    const quoted = Children.map(children, (child) =>
        isValidElement<PProps>(child) && child.type === P ? cloneElement(child, { variant: "quote" }) : child
    );
    return (
        <blockquote className={`border-l ${HAIRLINE} pl-5`}>
            {quoted}
            {author && <cite className={`mt-2 block text-small not-italic ${MUTED}`}>— {author}</cite>}
        </blockquote>
    );
}

export function Table(props: ComponentProps<"table">) {
    return (
        <div data-scrolls className="overflow-x-auto">
            <table {...props} className="w-full border-collapse text-small" />
        </div>
    );
}

export function Tr(props: ComponentProps<"tr">) {
    return <tr {...props} className={`border-b ${HAIRLINE}`} />;
}

export function Th(props: ComponentProps<"th">) {
    return <th {...props} className="whitespace-nowrap py-2 pr-4 text-left text-small font-medium" />;
}

export function Td(props: ComponentProps<"td">) {
    // Cells wrap so a wide table fits the reading column instead of hiding its last column behind a scroll; the
    // wrapper still scrolls when even the wrapped table is too wide (a phone).
    return <td {...props} className={`py-2 pr-4 align-top ${PROSE}`} />;
}

type CodeProps = ComponentProps<"code"> & {
    /** Set by <Pre> on the code it holds, which is laid out by the block rather than styled as inline code. */
    block?: boolean;
};

export function Code({ block, ...props }: CodeProps) {
    if (block) return <code {...props} />;
    return <code {...props} className="rounded-chip bg-tile px-1 py-0.5 font-geistMono text-[0.92em]" />;
}

type PreProps = ComponentProps<"pre"> & {
    /** The fence's `title="..."`, read by the compiler. */
    "data-title"?: string;
};

/**
 * A code block: a panel with the fence's title in a header bar when it has one, a copy button, and the code. Fenced
 * code with a language arrives here already highlighted by shiki (both themes; globals.css picks one), with line
 * numbers and highlighted lines marked by the compiler, and keeps shiki's own <pre>. A fence without a language is
 * the same panel in the body colour.
 */
export function Pre({ children, className, "data-title": title, ...props }: PreProps) {
    const code = Children.map(children, (child) => {
        if (!isValidElement<CodeProps>(child) || child.type !== Code) return child;
        // Markdown ends a fence's text with a newline, which would draw as an empty last line.
        const text = child.props.children;
        return cloneElement(child, {
            block: true,
            children: typeof text === "string" ? text.replace(/\n$/, "") : text,
        });
    });
    const highlighted = className?.includes("shiki");
    return (
        <div data-code-block className={`${PANEL} relative bg-tile font-geistMono text-[13.5px] leading-[1.65]`}>
            {title ? (
                <div className={`flex items-center justify-between gap-4 border-b ${HAIRLINE} py-1.5 pl-4 pr-2`}>
                    <span className={`truncate text-caption ${MUTED}`}>{title}</span>
                    <CopyButton />
                </div>
            ) : (
                // Sits above the code with the panel's own fill, so a long first line passes under it instead of
                // showing through the label.
                <div className="absolute right-2 top-2 z-10 rounded-chip bg-tile pl-1">
                    <CopyButton />
                </div>
            )}
            <div data-scrolls className="overflow-x-auto">
                <pre
                    {...props}
                    className={`${highlighted ? `${className} !bg-transparent` : PROSE} px-4 py-3 [&>code]:block [&>code]:min-w-max [&>code]:pr-14`}
                >
                    {code}
                </pre>
            </div>
        </div>
    );
}
