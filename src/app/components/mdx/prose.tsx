import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import InlineLink from "../inline-link";
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

export function H2(props: ComponentProps<"h2">) {
    return <h2 {...props} className="mt-6 text-[16px] font-medium leading-[1.6]" />;
}

export function H3(props: ComponentProps<"h3">) {
    return <h3 {...props} className={`mt-3 text-[15px] font-medium leading-[1.6] ${MUTED}`} />;
}

export function Ul(props: ComponentProps<"ul">) {
    return <ul {...props} className={`list-disc space-y-1.5 pl-5 ${BODY} ${PROSE}`} />;
}

export function Ol(props: ComponentProps<"ol">) {
    return <ol {...props} className={`list-decimal space-y-1.5 pl-5 ${BODY} ${PROSE}`} />;
}

export function Hr(props: ComponentProps<"hr">) {
    return <hr {...props} className={`border-t ${HAIRLINE}`} />;
}

export function A({ href = "#", children }: ComponentProps<"a">) {
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
            {author && <cite className={`mt-2 block font-geistMono text-[12px] not-italic ${MUTED}`}>— {author}</cite>}
        </blockquote>
    );
}

export function Table(props: ComponentProps<"table">) {
    return (
        <div data-scrolls className="overflow-x-auto">
            <table {...props} className="w-full border-collapse text-[14px]" />
        </div>
    );
}

export function Tr(props: ComponentProps<"tr">) {
    return <tr {...props} className={`border-b ${HAIRLINE}`} />;
}

export function Th(props: ComponentProps<"th">) {
    return <th {...props} className="whitespace-nowrap py-2 pr-4 text-left font-geistMono text-[12px] font-medium" />;
}

export function Td(props: ComponentProps<"td">) {
    return <td {...props} className={`whitespace-nowrap py-2 pr-4 ${PROSE}`} />;
}

type CodeProps = ComponentProps<"code"> & {
    /** Set by <Pre> on the code it holds, which is laid out by the block rather than styled as inline code. */
    block?: boolean;
};

export function Code({ block, ...props }: CodeProps) {
    if (block) return <code {...props} />;
    return (
        <code
            {...props}
            className="rounded-[4px] bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] px-1 py-0.5 font-geistMono text-[0.875em]"
        />
    );
}

/**
 * A code block. Fenced code with a language arrives here already highlighted by shiki (both themes; globals.css picks
 * one), and keeps shiki's own <pre>. A fence without a language is a plain panel in the body colour.
 */
export function Pre({ children, className, ...props }: ComponentProps<"pre">) {
    const code = Children.map(children, (child) => {
        if (!isValidElement<CodeProps>(child) || child.type !== Code) return child;
        // Markdown ends a fence's text with a newline, which would draw as an empty last line.
        const text = child.props.children;
        return cloneElement(child, {
            block: true,
            children: typeof text === "string" ? text.replace(/\n$/, "") : text,
        });
    });
    if (className?.includes("shiki")) {
        return (
            <div
                data-scrolls
                className={`${PANEL} overflow-x-auto font-geistMono text-[13px] leading-[1.6] [&>pre]:!bg-transparent [&>pre]:p-4`}
            >
                <pre {...props} className={className}>
                    {code}
                </pre>
            </div>
        );
    }
    return (
        <pre
            {...props}
            data-scrolls
            className={`${PANEL} overflow-x-auto px-4 py-3 font-geistMono text-[13px] leading-[1.6] ${PROSE}`}
        >
            {code}
        </pre>
    );
}
