import "server-only";
import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import type { Element, Root, RootContent } from "hast";
import * as runtime from "react/jsx-runtime";
import type { ReactNode } from "react";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { mdxComponents } from "../app/components/mdx";

/**
 * Compiles a content file's MDX body to React on the server, at build time: GitHub-flavoured Markdown, `$$` math
 * rendered by KaTeX, fenced code highlighted by shiki in both themes (globals.css picks one), and ids on headings.
 * The Markdown elements and the named components come from app/components/mdx.
 */
export async function renderMdx(body: string, file: string): Promise<ReactNode> {
    try {
        const { default: Content } = await evaluate(body, {
            ...runtime,
            development: false,
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
                rehypeSlug,
                rehypeKatex,
                rehypeMathBlocks,
                // Both themes are rendered into one <pre>; `defaultColor: false` leaves the choice to the CSS.
                [rehypeShiki, { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false }],
            ],
        });
        return <Content components={mdxComponents} />;
    } catch (error) {
        throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
}

const hasClass = (node: Element, name: string) =>
    Array.isArray(node.properties.className) && node.properties.className.includes(name);

/** Puts each display equation in a box that scrolls sideways when it is wider than the page, centred. */
function rehypeMathBlocks() {
    const wrap = (node: Element): Element => ({
        type: "element",
        tagName: "div",
        properties: { dataScrolls: true, className: ["my-2", "overflow-x-auto", "text-center"] },
        children: [node],
    });
    // Equations sit inside <Section> too, which is a JSX node rather than an element, so every node with children
    // is walked.
    const visit = (parent: { children: RootContent[] }) => {
        parent.children = parent.children.map((child: RootContent): RootContent => {
            if (child.type === "element" && child.tagName === "span" && hasClass(child, "katex-display")) {
                return wrap(child);
            }
            if ("children" in child) visit(child);
            return child;
        });
    };
    return (tree: Root) => visit(tree);
}
