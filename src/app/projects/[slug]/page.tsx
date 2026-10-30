import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "../../../lib/content";
import { imageMeta } from "../../../lib/images";
import { renderMdx } from "../../../lib/mdx";
import { pageMetadata } from "../../../lib/metadata";
import { parseContentDate } from "../../../lib/site";
import { hasPage, nameOf, projects, projectsByDate } from "../../data/projects";
import ProjectPage from "./project-page";

export const dynamicParams = false;

export function generateStaticParams() {
    return projects.filter(hasPage).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);
    if (!project || !hasPage(project)) return {};
    const path = `/projects/${project.slug}`;
    return pageMetadata({
        title: nameOf(project),
        cardTitle: project.title,
        description: project.description,
        path,
        article: { publishedTime: parseContentDate(project.date) },
        image: `${path}/opengraph-image`,
        hidden: project.hidden,
    });
}

/** The write-up is compiled here, on the server, since code highlighting and math need Node. */
export default async function Page({ params }: Props) {
    const { slug } = await params;
    const doc = getProject(slug);
    if (!doc || doc.meta.hidden || !hasPage(doc.meta)) notFound();
    const project = doc.meta;
    // Looked up here so the manifest stays out of the client bundle.
    const heroMeta = project.hero?.type === "image" ? imageMeta(project.hero.src) : undefined;
    return (
        <ProjectPage project={project} pages={projectsByDate.filter(hasPage)} heroMeta={heroMeta}>
            {await renderMdx(doc.body, `content/projects/${slug}.mdx`)}
        </ProjectPage>
    );
}
