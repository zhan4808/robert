import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { projects } from "@/lib/data";
import Link from "next/link";

const visibleProjects = projects.filter((p) => !p.hidden);

export default function ProjectsPage() {
  return (
    <div className="mx-auto mt-8 mb-16 flex max-w-[652px] flex-col gap-12 px-6 md:mt-16 md:gap-16">
      <Navigation />

      <main className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h1 className="font-medium text-lg">Projects</h1>
          <p className="text-muted-foreground">
            Product work, experiments, and research with focused notes and visuals.
          </p>
        </section>

        <div className="flex flex-col gap-2">
          {visibleProjects.map((project) => (
            <Link
              key={project.slug}
              href={project.externalUrl ?? `/projects/${project.slug}`}
              target={project.externalUrl ? "_blank" : undefined}
              rel={project.externalUrl ? "noopener noreferrer" : undefined}
              className="group block p-4 -mx-4 rounded-lg hover:bg-secondary transition-colors"
            >
              <article>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium group-hover:text-foreground transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {project.description}
                    </p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>2026</span>
            <span>Made with care</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "projects",
};
