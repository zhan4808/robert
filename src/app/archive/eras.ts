import { AUTHOR, SITE_URL } from "../../lib/site";

/** One design of this site: a commit it can be checked out from, what it looked like, and what it was built with. */
export type Era = {
    /** "v1", "v2", ... in the order the designs shipped; also names the screenshots under public/archive/. */
    id: string;
    /** When the design was live, lowercase, "jan 2025 – aug 2025". */
    span: string;
    /** One line on the design itself. */
    description: string;
    /** What it was built with, as a quiet mono line. */
    stack: string;
    /** The commit the screenshots were taken from. The current design has none; it links to the live site instead. */
    commit?: { sha: string; date: string };
    /** What the second desktop screenshot shows. */
    inner: string;
};

export const SOURCE_TREE = `${AUTHOR.github}/robert/tree`;

/** Where an era's "source" link goes: the commit on GitHub, or the live site for the design that is running now. */
export const eraLink = (era: Era) =>
    era.commit ? { href: `${SOURCE_TREE}/${era.commit.sha}`, label: "source" } : { href: SITE_URL, label: "live" };

export const shots = (era: Era) => ({
    home: `/archive/${era.id}-home.webp`,
    inner: `/archive/${era.id}-inner.webp`,
    mobile: `/archive/${era.id}-mobile.webp`,
});

/** Newest first. */
export const ERAS: Era[] = [
    {
        id: "v5",
        span: "oct 2026 – now",
        description:
            "The pixel koi pond, after Dao Ho's portfolio: a lowercase mono nav, a pond you can feed, a strip of projects, a gallery, and MDX write-ups with a contents rail.",
        stack: "next 16 · react 19 · tailwind 3 · motion · mdx · shiki",
        inner: "projects",
    },
    {
        id: "v4",
        span: "may 2026 – oct 2026",
        description:
            "Everything on one light monospace page, after annmariaantony.com: collapsible sections, experience written as paragraphs with inline links, and no nav bar at all.",
        stack: "next 15 · react 18 · tailwind 3 · geist mono",
        commit: { sha: "aee39dc2c20a4145346c4cae3acdab80501de6f3", date: "2026-05-30" },
        inner: "a project write-up",
    },
    {
        id: "v3",
        span: "jan 2026 – mar 2026",
        description:
            "A dark, text-first index: a logo and underlined nav, a bio with pill links, then selected work and experience as lists. Projects became long write-ups with figures, a lightbox, and papers.",
        stack: "next 15 · react 18 · tailwind 3 · shadcn/ui · shiki · katex",
        commit: { sha: "9a3520a1565bb72eb5021da838a82a463307d3d8", date: "2026-03-16" },
        inner: "projects",
    },
    {
        id: "v2",
        span: "jan 2025 – aug 2025",
        description:
            "Rebuilt on Next: a drifting pastel gradient behind a bold greeting, a light and dark toggle, and separate about, projects, and blog pages. The blog and project pages grew through the spring.",
        stack: "next 15 · react 19 · tailwind 3 · framer motion · sass",
        commit: { sha: "43cab95a6920f08f8853a2acbb9a024e45648d39", date: "2025-08-01" },
        inner: "projects",
    },
    {
        id: "v1",
        span: "dec 2023 – dec 2024",
        description:
            "The first site, one page of plain HTML from a tutorial: Poppins, a round photo, pill buttons, and anchors down to about, experience, projects, and contact.",
        stack: "html · css · vanilla js",
        commit: { sha: "64e7e8635b90d8a4d8a8b72e7daf4851275bd7cc", date: "2024-03-10" },
        inner: "the projects section",
    },
];
