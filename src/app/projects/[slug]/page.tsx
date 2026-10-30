import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "../../../lib/metadata";
import { parseContentDate } from "../../../lib/site";
import { ContentBlocks } from "../../components/content-blocks";
import { hasPage, nameOf, projects } from "../../data/projects";
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

/** The write-up is rendered here, on the server, since code highlighting and math need Node. */
export default async function Page({ params }: Props) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug && hasPage(p));
    if (!project) notFound();
    return (
        <ProjectPage slug={project.slug}>
            {project.sections.map((section) => (
                <section key={section.id} id={section.id} className="[&:not(:first-child)]:mt-16">
                    <h2 className="mb-5 text-[16px] font-medium leading-[1.6]">{section.title}</h2>
                    <ContentBlocks blocks={section.blocks} />
                </section>
            ))}
        </ProjectPage>
    );
}
