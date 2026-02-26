import type { Metadata } from "next";
import { ContentBlocks } from "@/components/content-blocks";
import { Navigation } from "@/components/navigation";
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
    <div className="mx-auto mt-8 mb-16 flex max-w-[900px] flex-col gap-12 px-6 md:mt-16 md:gap-16">
      <Navigation />

      <div className="flex gap-12">
        {/* Table of Contents - Desktop Sidebar */}
        {project.sections.length > 0 && (
          <aside className="hidden lg:block w-44 shrink-0">
            <nav className="sticky top-8">
              <ul className="flex flex-col gap-3">
                {project.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <article className="flex-1 max-w-[652px]">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-xl font-medium mb-2">{project.title}</h1>
            <p className="text-muted-foreground mb-4">{project.longDescription}</p>
            <div className="flex items-center gap-4 text-sm">
              <time className="text-muted-foreground">{project.date}</time>
              <div className="flex gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="connect-link"
                  >
                    {project.liveUrl.endsWith(".pdf") ? "Paper" : "Live Demo"}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="connect-link"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* Hero Media */}
          {project.hero && (
            <div className="mb-12">
              {project.hero.type === "video" ? (
                <video
                  src={project.hero.src}
                  controls
                  playsInline
                  className="w-full rounded-lg"
                />
              ) : (
                <img
                  src={project.hero.src}
                  alt={project.hero.alt}
                  className="w-full rounded-lg"
                />
              )}
            </div>
          )}

          {/* Sections */}
          <div className="flex flex-col gap-12">
            {project.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-8">
                <h2 className="font-medium mb-4">{section.title}</h2>

                <ContentBlocks blocks={section.blocks} />
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border">
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Back to all projects
            </Link>
          </div>
        </article>
      </div>
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
