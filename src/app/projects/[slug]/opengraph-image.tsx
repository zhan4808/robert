import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, articleCard } from "../../../lib/og";
import { SITE_NAME } from "../../../lib/site";
import { hasPage, projects } from "../../data/projects";

/** Drawn at build time for every visible project with a page, like the pages themselves. */
export const dynamicParams = false;

export function generateStaticParams() {
    return projects.filter(hasPage).map((p) => ({ slug: p.slug }));
}

export const alt = `Project write-up by ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug && hasPage(p));
    if (!project) notFound();
    return articleCard({ section: "projects", when: project.date, title: project.title, line: project.description });
}
