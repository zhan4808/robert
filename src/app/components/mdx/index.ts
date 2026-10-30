import type { MDXComponents } from "mdx/types";
import { Figure, Gallery } from "./figure";
import { LinkCard } from "./link-card";
import { Gradient, Video } from "./media";
import { Note } from "./note";
import { A, Code, H2, H3, Hr, Ol, P, Pre, Quote, Strong, Table, Td, Th, Tr, Ul } from "./prose";
import { Section } from "./section";
import { Visualization } from "./visualization";

/**
 * What a content file can use: the Markdown elements, styled, and the components it can write by name. Documented
 * with examples in docs/content.md.
 */
export const mdxComponents: MDXComponents = {
    p: P,
    h2: H2,
    h3: H3,
    ul: Ul,
    ol: Ol,
    hr: Hr,
    a: A,
    strong: Strong,
    blockquote: Quote,
    table: Table,
    tr: Tr,
    th: Th,
    td: Td,
    pre: Pre,
    code: Code,
    Section,
    Figure,
    Gallery,
    Video,
    Gradient,
    LinkCard,
    Note,
    Quote,
    Visualization,
};
