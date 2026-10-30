/** The projects strip and pages read the site's content from lib/data.ts through these helpers. */
import { projects as all, type Project } from "../../lib/data";

export type { Project };

/** Projects that show on the site, in the order they are written down. */
export const projects = all.filter((p) => !p.hidden);

/** Newest first; projects from the same year keep their written order. */
export const projectsByDate = [...projects].sort((a, b) => b.year - a.year);

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
