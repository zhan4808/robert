import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { parseContentDate } from "./site";
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

/**
 * Whether a post gets a page in this build. Hidden posts render under `next dev`, so drafts can be read locally,
 * and get no page in production, like hidden projects.
 */
export const hasPostPage = (post: JournalPost): boolean => !post.hidden || process.env.NODE_ENV !== "production";

const postTime = (post: JournalPost) => parseContentDate(post.date)?.getTime() ?? Date.UTC(post.year, 0, 1);

/** The posts that show in the list, the feed, and the sitemap: newest first, `order` settling posts on one date. */
export const getVisiblePosts = (): JournalPost[] =>
    getPosts()
        .filter((post) => !post.hidden)
        .sort((a, b) => postTime(b) - postTime(a) || a.order - b.order);

/** Visible posts grouped by year, newest year first, newest first within a year. */
export function getVisiblePostsByYear(): Map<number, JournalPost[]> {
    const byYear = new Map<number, JournalPost[]>();
    for (const post of getVisiblePosts()) {
        byYear.set(post.year, [...(byYear.get(post.year) ?? []), post]);
    }
    return new Map([...byYear.entries()].sort((a, b) => b[0] - a[0]));
}

/** A post inside a series row: its place, the name the list shows, and where it lives. */
export type EntryPart = { part: number; title: string; href: string };

/** One line in the combined index: a post, a project, or a whole series, with where it lives. */
export type Entry = {
    slug: string;
    href: string;
    title: string;
    date: string;
    year: number;
    kind: "technical" | "journal" | "project";
    external?: boolean;
    /** Set on a series row: every visible part, in order. */
    parts?: EntryPart[];
};

type Sortable = Entry & { time: number; order: number; monthly: boolean };

/** Whether a written date names a month ("November 2026", "Nov 15, 2026") rather than only a year ("2026"). */
const hasMonth = (date: string) => /[A-Za-z]/.test(date);

/**
 * Visible posts and projects together, newest first: the blog index and the home page's list read this. A series is
 * one row, titled with the series name, dated by its newest part, and linking to part 1. Within a year, entries with
 * only a year for a date go after the ones with a month.
 */
export function getEntries(): Entry[] {
    const posts = getVisiblePosts();
    const series = new Map<string, JournalPost[]>();
    for (const p of posts) if (p.series) series.set(p.series, [...(series.get(p.series) ?? []), p]);

    const rows: Sortable[] = [];
    for (const p of posts) {
        if (!p.series) {
            rows.push({
                slug: p.slug,
                href: `/blog/${p.slug}`,
                title: p.title,
                date: p.date,
                year: p.year,
                kind: p.kind,
                time: postTime(p),
                order: p.order,
                monthly: hasMonth(p.date),
            });
            continue;
        }
        const members = series.get(p.series);
        if (!members) continue; // already added
        series.delete(p.series);
        const ordered = [...members].sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
        const latest = [...members].sort((a, b) => postTime(b) - postTime(a))[0];
        rows.push({
            slug: ordered[0].slug,
            href: `/blog/${ordered[0].slug}`,
            title: p.series,
            date: latest.date,
            year: latest.year,
            kind: "technical",
            parts: ordered.map((m, i) => ({
                part: m.part ?? i + 1,
                title: m.shortTitle ?? m.title,
                href: `/blog/${m.slug}`,
            })),
            time: postTime(latest),
            order: Math.min(...members.map((m) => m.order)),
            monthly: hasMonth(latest.date),
        });
    }
    for (const p of getProjects()) {
        if (p.hidden) continue;
        rows.push({
            slug: p.slug,
            href: p.externalUrl ?? `/projects/${p.slug}`,
            title: p.shortTitle ?? p.title,
            date: p.date,
            year: p.year,
            kind: "project",
            external: !!p.externalUrl,
            time: parseContentDate(p.date)?.getTime() ?? Date.UTC(p.year, 0, 1),
            order: p.order,
            monthly: hasMonth(p.date),
        });
    }
    return rows
        .sort(
            (a, b) => b.year - a.year || Number(b.monthly) - Number(a.monthly) || b.time - a.time || a.order - b.order
        )
        .map((e): Entry => ({
            slug: e.slug,
            href: e.href,
            title: e.title,
            date: e.date,
            year: e.year,
            kind: e.kind,
            external: e.external,
            parts: e.parts,
        }));
}

/** Entries grouped by year, newest year first. */
export function getEntriesByYear(): [number, Entry[]][] {
    const byYear = new Map<number, Entry[]>();
    for (const e of getEntries()) byYear.set(e.year, [...(byYear.get(e.year) ?? []), e]);
    return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
}
