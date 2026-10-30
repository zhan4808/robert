/**
 * One-time migration, run once in October 2026: turned the block model that used to live in `src/lib/data.ts` into
 * `content/projects/<slug>.mdx` and `content/blog/<slug>.mdx`. The data file was deleted afterwards, so this only runs
 * against a checkout that still has it (the commit before the one that added `content/`). It is kept as the record of
 * how each block type maps onto MDX; see docs/content.md for the format it produced.
 *
 *     node --experimental-strip-types scripts/migrate-content.mjs
 *
 * Deterministic: the same data file always produces the same files. Text goes through mdast-util-to-markdown, which
 * escapes whatever Markdown would otherwise read as syntax (`*`, `_`, backticks, `<`, `{`...), so every paragraph
 * renders exactly as it did when it was a plain string.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mathToMarkdown } from "mdast-util-math";
import { mdxToMarkdown } from "mdast-util-mdx";
import { toMarkdown } from "mdast-util-to-markdown";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { journalPosts, projects } = await import(path.join(root, "src/lib/data.ts"));

// ---- mdast builders -------------------------------------------------------------------------------------------------

const text = (value) => ({ type: "text", value });
const paragraph = (value) => ({ type: "paragraph", children: [text(value)] });

/** A JSX attribute. Strings become quoted attributes, `true` a bare flag, and `expr` objects a `{...}` expression. */
function attribute(name, value) {
    if (value === undefined || value === false) return [];
    if (value === true) return [{ type: "mdxJsxAttribute", name, value: null }];
    if (typeof value === "object" && value.expr !== undefined) {
        return [
            { type: "mdxJsxAttribute", name, value: { type: "mdxJsxAttributeValueExpression", value: value.expr } },
        ];
    }
    return [{ type: "mdxJsxAttribute", name, value: String(value) }];
}

/** `<Name attr="..." />`, or with children when there are any. Attribute order follows `attrs`. */
function jsx(name, attrs, children = []) {
    return {
        type: "mdxJsxFlowElement",
        name,
        attributes: Object.entries(attrs).flatMap(([key, value]) => attribute(key, value)),
        children,
    };
}

/** An object literal for an expression attribute: `{ type: "image", src: "/x.webp" }`. */
const objectLiteral = (object) =>
    `{ ${Object.entries(object)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ")} }`;

function blockToMdast(block) {
    switch (block.type) {
        case "paragraph":
            return paragraph(block.text);
        case "quote":
            return jsx("Quote", { author: block.author }, [paragraph(block.text)]);
        case "image":
            return jsx("Figure", { src: block.src, alt: block.alt, caption: block.caption, invert: block.invert });
        case "gallery":
            return jsx(
                "Gallery",
                {},
                block.images.map((image) => jsx("Figure", { src: image.src, alt: image.alt, caption: image.caption }))
            );
        case "video":
            return jsx("Video", { src: block.src, caption: block.caption });
        case "gradient":
            return jsx("Gradient", { className: block.className });
        case "list":
            return {
                type: "list",
                ordered: false,
                spread: false,
                children: block.items.map((item) => ({ type: "listItem", spread: false, children: [paragraph(item)] })),
            };
        case "link":
            return jsx("LinkCard", { href: block.href, label: block.label, description: block.description });
        case "code":
            return { type: "code", lang: null, value: block.code };
        case "code-highlighted":
            return { type: "code", lang: block.language, value: block.code };
        case "heading":
            return { type: "heading", depth: block.level, children: [text(block.text)] };
        case "math":
            if (block.display) return { type: "math", value: block.latex };
            return { type: "paragraph", children: [{ type: "inlineMath", value: block.latex }] };
        case "visualization":
            return jsx("Visualization", {
                title: block.title,
                prompt: block.prompt,
                caption: block.caption,
                media: block.media && { expr: objectLiteral(block.media) },
            });
        case "table": {
            const row = (cells) => ({
                type: "tableRow",
                children: cells.map((cell) => ({ type: "tableCell", children: [text(cell)] })),
            });
            return {
                type: "table",
                align: block.headers.map(() => null),
                children: [row(block.headers), ...block.rows.map(row)],
            };
        }
        default:
            throw new Error(`Unknown block type: ${block.type}`);
    }
}

// ---- files ----------------------------------------------------------------------------------------------------------

const markdownOptions = {
    bullet: "-",
    emphasis: "_",
    strong: "*",
    fences: true,
    listItemIndent: "one",
    rule: "-",
    extensions: [gfmToMarkdown(), mathToMarkdown(), mdxToMarkdown({ printWidth: 120 })],
};

/** Frontmatter keys in a fixed order, with unset fields left out. */
const frontmatter = (fields) =>
    YAML.stringify(Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)), {
        lineWidth: 0,
    });

function write(dir, slug, fields, children) {
    const body = toMarkdown({ type: "root", children }, markdownOptions);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${slug}.mdx`), `---\n${frontmatter(fields)}---\n\n${body}`);
}

projects.forEach((project, index) => {
    write(
        path.join(root, "content/projects"),
        project.slug,
        {
            title: project.title,
            shortTitle: project.shortTitle,
            description: project.description,
            longDescription: project.longDescription,
            date: project.date,
            year: project.year,
            order: index + 1,
            tags: project.tags,
            featured: project.featured,
            hidden: project.hidden,
            thumb: project.thumb,
            thumbStyle: project.thumbStyle,
            hero: project.hero,
            externalUrl: project.externalUrl,
            liveUrl: project.liveUrl,
            paperUrl: project.paperUrl,
            githubUrl: project.githubUrl,
        },
        project.sections.map((section) =>
            jsx("Section", { id: section.id, title: section.title }, section.blocks.map(blockToMdast))
        )
    );
});

journalPosts.forEach((post, index) => {
    write(
        path.join(root, "content/blog"),
        post.slug,
        {
            title: post.month,
            subtitle: post.subtitle,
            date: post.date,
            year: post.year,
            order: index + 1,
            hidden: post.hidden,
            coverImage: post.coverImage,
            coverGradient: post.coverGradient,
            tracks: post.tracks.length ? post.tracks : undefined,
        },
        post.blocks.map(blockToMdast)
    );
});

console.log(`Wrote ${projects.length} projects and ${journalPosts.length} posts under content/.`);
