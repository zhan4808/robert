/** What the strip, the pages, and their client components all need to know about a project; safe to import anywhere. */
import type { Project } from "../../lib/content-schema";

export type { Project };

/** sessionStorage key for the project last opened, so the strip can land back on it. */
export const LAST_PROJECT_KEY = "projects-last-viewed";

/** Where a project's tile goes: its own page, or straight out to an external write-up. */
export const projectHref = (p: Project) => p.externalUrl ?? `/projects/${p.slug}`;

export const isExternal = (href: string) => /^https?:/.test(href);

/** True when the project has a page on this site. */
export const hasPage = (p: Project) => !p.externalUrl;

/** The short name used on tiles and in pagers; falls back to the full title. */
export const nameOf = (p: Project) => p.shortTitle ?? p.title;

/** The link shown under a project's intro: the paper first, then code, then a live site. */
export const primaryLink = (p: Project) => p.paperUrl ?? p.githubUrl ?? p.liveUrl;

/** Newest first; projects from the same year keep their order. */
export const byDate = (list: Project[]) => [...list].sort((a, b) => b.year - a.year);
