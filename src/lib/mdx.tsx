import "server-only";
import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import type { Element, Root, RootContent } from "hast";
import type { MdxJsxAttribute, MdxJsxFlowElementHast as MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import * as runtime from "react/jsx-runtime";
import type { ReactNode } from "react";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { ShikiTransformer } from "shiki";
import { mdxComponents } from "../app/components/mdx";
import { parseCodeMeta } from "./code-meta";

/** A heading in a write-up, for the table of contents: `##` and `###` in the Markdown, and each `<Section>`. */
export interface Heading {
    id: string;
    /** 2 for `##` and `<Section>`, 3 for `###`. */
    depth: 2 | 3;
    text: string;
}

export interface RenderedMdx {
    content: ReactNode;
    /** Every heading in document order. */
    headings: Heading[];
}

/**
 * Compiles a content file's MDX body to React on the server, at build time: GitHub-flavoured Markdown (footnotes
 * included), `$$` math rendered by KaTeX, fenced code highlighted by shiki in both themes (globals.css picks one),
 * and ids on headings. The Markdown elements and the named components come from app/components/mdx. Along with the
 * content it returns the headings, read from the compiled tree, and numbers each figure in document order.
 */
export async function renderMdx(body: string, file: string): Promise<RenderedMdx> {
    const headings: Heading[] = [];
    try {
        const { default: Content } = await evaluate(body, {
            ...runtime,
            development: false,
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
                rehypeSlug,
                rehypeKatex,
                rehypeMathBlocks,
                rehypeFigureNumbers,
                rehypePlainCodeMeta,
                [
                    rehypeShiki,
                    {
                        themes: { light: "github-light", dark: "github-dark" },
                        // Both themes are rendered into one <pre>; `defaultColor: false` leaves the choice to the CSS.
                        defaultColor: false,
                        parseMetaString: (meta: string) => ({ parsed: parseCodeMeta(meta) }),
                        transformers: [shikiCodeMeta],
                    },
                ],
                () => (tree: Root) => collectHeadings(tree, headings),
            ],
        });
        return { content: <Content components={mdxComponents} />, headings };
    } catch (error) {
        throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
}

type Node = RootContent | Root;
type Parent = { children: RootContent[] };

const hasClass = (node: Element, name: string) =>
    Array.isArray(node.properties.className) && node.properties.className.includes(name);

/**
 * Walks every node with children, in document order. Components written in the body (`<Section>`, `<Figure>`) are
 * JSX nodes rather than elements, and their children are walked too; `visit` returns false to skip a node's children.
 */
function walk(parent: Parent, visit: (node: RootContent, parent: Parent, index: number) => boolean | void) {
    parent.children.forEach((child, index) => {
        if (visit(child, parent, index) === false) return;
        if ("children" in child) walk(child, visit);
    });
}

const isJsx = (node: Node, name: string): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === name;

/** The string value of a JSX attribute, or undefined when it is missing or an expression. */
function attribute(node: MdxJsxFlowElement, name: string): string | undefined {
    const found = node.attributes.find(
        (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === name
    );
    return typeof found?.value === "string" ? found.value : undefined;
}

const textOf = (node: Node): string => {
    if (node.type === "text") return node.value;
    if ("children" in node) return node.children.map(textOf).join("");
    return "";
};

/** Reads the `##`/`###` headings and `<Section>` titles, in order, for the table of contents. */
function collectHeadings(tree: Root, headings: Heading[]) {
    walk(tree, (node) => {
        if (isJsx(node, "Section")) {
            const id = attribute(node, "id");
            const title = attribute(node, "title");
            if (id && title) headings.push({ id, depth: 2, text: title });
            return;
        }
        if (node.type !== "element" || (node.tagName !== "h2" && node.tagName !== "h3")) return;
        // GFM's footnotes section carries a visually hidden "Footnotes" heading that stays out of the contents.
        if (hasClass(node, "sr-only")) return;
        const id = node.properties.id;
        if (typeof id === "string") headings.push({ id, depth: node.tagName === "h2" ? 2 : 3, text: textOf(node) });
    });
}

/**
 * Numbers the figures in document order: each `<Figure>` on its own, and each `<Gallery>` as one figure. The number is
 * set as a `number` attribute, so the components render "Figure N" without any state.
 */
function rehypeFigureNumbers() {
    return (tree: Root) => {
        let count = 0;
        const number = (node: MdxJsxFlowElement) => {
            node.attributes.push({ type: "mdxJsxAttribute", name: "number", value: String(++count) });
        };
        walk(tree, (node) => {
            if (isJsx(node, "Gallery")) {
                number(node);
                return false;
            }
            if (isJsx(node, "Figure")) number(node);
        });
    };
}

/**
 * A fence without a language is left alone by shiki, so its info string (`title="..."`) is read here and put on the
 * <pre> for the Pre component. Markdown takes the first word of the info string as the language, so a fence that
 * opens with meta (```` ```title="notes.txt" ````) has it in the language class; that is read as meta and the class
 * dropped, which keeps shiki away from it. Fences with a language go through shikiCodeMeta instead.
 */
function rehypePlainCodeMeta() {
    return (tree: Root) => {
        walk(tree, (node) => {
            if (node.type !== "element" || node.tagName !== "pre") return;
            const code = node.children[0];
            if (code?.type !== "element" || code.tagName !== "code") return;
            const classes = Array.isArray(code.properties.className) ? code.properties.className.map(String) : [];
            const language = classes.find((name) => name.startsWith("language-"))?.slice("language-".length);
            let meta = typeof code.data?.meta === "string" ? code.data.meta : "";
            if (language && /[={]/.test(language)) {
                meta = `${language} ${meta}`;
                code.properties.className = classes.filter((name) => !name.startsWith("language-"));
            } else if (language) {
                return false;
            }
            const { title } = parseCodeMeta(meta);
            if (title) node.properties.dataTitle = title;
            return false;
        });
    };
}

/** Carries a highlighted fence's meta into its markup: the title and line numbers on <pre>, highlights on lines. */
const shikiCodeMeta: ShikiTransformer = {
    name: "code-meta",
    pre(node) {
        const meta = this.options.meta?.parsed as ReturnType<typeof parseCodeMeta> | undefined;
        if (!meta) return;
        if (meta.title) node.properties.dataTitle = meta.title;
        if (meta.lineNumbers) this.addClassToHast(node, "line-numbers");
    },
    line(node, line) {
        const meta = this.options.meta?.parsed as ReturnType<typeof parseCodeMeta> | undefined;
        if (meta?.highlight.has(line)) this.addClassToHast(node, "highlighted");
    },
};

/** Puts each display equation in a box that scrolls sideways when it is wider than the page, centred. */
function rehypeMathBlocks() {
    const wrap = (node: Element): Element => ({
        type: "element",
        tagName: "div",
        properties: { dataScrolls: true, className: ["my-2", "overflow-x-auto", "text-center"] },
        children: [node],
    });
    return (tree: Root) =>
        walk(tree, (node, parent, index) => {
            if (node.type === "element" && node.tagName === "span" && hasClass(node, "katex-display")) {
                parent.children[index] = wrap(node);
                return false;
            }
        });
}
