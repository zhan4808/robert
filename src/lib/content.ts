import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { postFrontmatterSchema, projectFrontmatterSchema, type JournalPost, type Project } from "./content-schema";

/**
 * Reads content/projects/*.mdx and content/blog/*.mdx. Everything is static, so each folder is read and validated
 * once per process and kept. A file with missing or invalid frontmatter fails the build with a message that names it.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

/** One file: its validated frontmatter (with the slug) and the MDX below it, still to be compiled. */
export interface Document<Meta> {
    meta: Meta;
    body: string;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function readFolder<Meta extends { slug: string; order: number }>(
    folder: string,
    schema: z.ZodType<Omit<Meta, "slug">>
): Document<Meta>[] {
    const dir = path.join(CONTENT_DIR, folder);
    const files = fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".mdx"))
        .sort();
    const documents = files.map((name): Document<Meta> => {
        const file = path.join("content", folder, name);
        const match = FRONTMATTER.exec(fs.readFileSync(path.join(dir, name), "utf8"));
        if (!match) throw new Error(`${file}: expected YAML frontmatter between --- lines at the top of the file.`);
        const [, yaml, body] = match;
        const result = schema.safeParse(parseYaml(yaml));
        if (!result.success) throw new Error(`${file}: invalid frontmatter.\n${z.prettifyError(result.error)}`);
        return { meta: { ...result.data, slug: name.slice(0, -".mdx".length) } as Meta, body };
    });
    // Lower `order` first; the slug settles ties so the result never depends on the file system's order.
    return documents.sort((a, b) => a.meta.order - b.meta.order || a.meta.slug.localeCompare(b.meta.slug));
}

let projectCache: Document<Project>[] | undefined;
let postCache: Document<JournalPost>[] | undefined;

const projectDocuments = () => (projectCache ??= readFolder<Project>("projects", projectFrontmatterSchema));
const postDocuments = () => (postCache ??= readFolder<JournalPost>("blog", postFrontmatterSchema));

/** Every project, hidden ones included, in `order`. */
export const getProjects = (): Project[] => projectDocuments().map((doc) => doc.meta);

/** One project with its write-up, or undefined when there is no such file. */
export const getProject = (slug: string): Document<Project> | undefined =>
    projectDocuments().find((doc) => doc.meta.slug === slug);

/** Every post, hidden ones included, in `order`. */
export const getPosts = (): JournalPost[] => postDocuments().map((doc) => doc.meta);

/** One post with its text, or undefined when there is no such file. */
export const getPost = (slug: string): Document<JournalPost> | undefined =>
    postDocuments().find((doc) => doc.meta.slug === slug);

/** The posts that show in the list, the feed, and the sitemap. */
export const getVisiblePosts = (): JournalPost[] => getPosts().filter((post) => !post.hidden);

/** Visible posts grouped by year, newest year first; within a year they keep their `order`. */
export function getVisiblePostsByYear(): Map<number, JournalPost[]> {
    const byYear = new Map<number, JournalPost[]>();
    for (const post of getVisiblePosts()) {
        byYear.set(post.year, [...(byYear.get(post.year) ?? []), post]);
    }
    return new Map([...byYear.entries()].sort((a, b) => b[0] - a[0]));
}
