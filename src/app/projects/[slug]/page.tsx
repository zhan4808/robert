import type { Metadata } from "next";
import { ContentBlocks } from "@/components/content-blocks";
import { projects } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return projects
    .filter((project) => !project.externalUrl)
    .map((project) => ({
      slug: project.slug,
    }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto mt-10 mb-24 flex max-w-[680px] flex-col gap-8 px-6 md:mt-16">
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <Link
            href="/"
            className="inline-link text-[hsl(var(--muted-foreground))] text-sm w-fit"
          >
            Robert Zhang
          </Link>

          <h1 className="text-sm font-bold mt-2">{project.title}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {project.longDescription}
          </p>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
            <time>{project.date}</time>
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Paper
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                GitHub
              </a>
            )}
          </div>
        </header>

        {project.hero && (
          <div>
            {project.hero.type === "video" ? (
              <video
                src={project.hero.src}
                controls
                playsInline
                className="w-full"
              />
            ) : (
              <img
                src={project.hero.src}
                alt={project.hero.alt}
                className="w-full"
              />
            )}
          </div>
        )}

        <div className="flex flex-col gap-10">
          {project.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="text-sm font-bold mb-4">{section.title}</h2>
              <ContentBlocks blocks={section.blocks} />
            </section>
          ))}
        </div>

        <footer className="mt-8 pt-6 border-t border-[hsl(var(--border))]">
          <Link
            href="/"
            className="inline-link text-sm text-[hsl(var(--muted-foreground))]"
          >
            ← Back
          </Link>
        </footer>
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  return {
    title: project ? project.title.toLowerCase() : "projects",
  };
}
