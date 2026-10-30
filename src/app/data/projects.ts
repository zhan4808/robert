/**
 * The projects strip and pages read the site's content from content/projects through these helpers. Reading the files
 * is server-only; client components get the lists as props and import what else they need from project-helpers.
 */
import { getProjects } from "../../lib/content";
import { byDate } from "./project-helpers";

export * from "./project-helpers";

/** Projects that show on the site, in their written order. */
export const projects = getProjects().filter((p) => !p.hidden);

/** Newest first; projects from the same year keep their written order. */
export const projectsByDate = byDate(projects);
