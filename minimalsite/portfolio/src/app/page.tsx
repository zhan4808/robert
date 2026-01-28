import type { Metadata } from "next";
import { ExperienceList } from "@/components/experience-list";
import { Navigation } from "@/components/navigation";
import { experiences, journalPosts, projects, socialLinks } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  const latestJournals = journalPosts.slice(0, 3);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="mx-auto mt-8 mb-16 flex max-w-[652px] flex-col gap-12 px-6 md:mt-16 md:gap-16">
      <Navigation />

      <main className="flex flex-col gap-16">
        {/* Bio Section */}
        <section className="flex flex-col gap-6">
          <h1 className="font-medium text-lg">Robert Zhang</h1>
          <p className="text-muted-foreground leading-relaxed">
            Hi! I'm Robert, an EE student at Purdue University passionate about
            optimized compute systems for AI. I'm interested in the intersection
            of compilers, ML systems, and hardware that turn models into fast
            usable systems at scale. Currently exploring accelerator operator
            libraries, compiler-hardware codesign, and agent-based systems.
            Building side projects with passion. Love all things sports, nature,
            and jazz related.
          </p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="flex flex-col gap-6">
          <h2 className="font-medium">Selected Work</h2>
          <div className="-mx-4 flex flex-col gap-2">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={project.externalUrl ?? `/projects/${project.slug}`}
                  target={project.externalUrl ? "_blank" : undefined}
                  rel={project.externalUrl ? "noopener noreferrer" : undefined}
                  className="group block px-4 py-3 rounded-md hover:bg-secondary transition-colors"
                >
                  <h3 className="font-medium group-hover:text-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {project.description}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground px-4">
                I enjoy building products and experimenting with new technologies.
              </p>
            )}
          </div>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm w-fit"
          >
            View all projects
          </Link>
        </section>

        {/* Experience Section */}
        <section className="flex flex-col gap-6">
          <h2 className="font-medium">Experience</h2>
          <p className="text-muted-foreground">
            Research and industry roles spanning hardware, systems, and applied AI.
          </p>
          <ExperienceList experiences={experiences} />
        </section>

        {/* Latest Journals Section */}
        <section className="flex flex-col gap-6">
          <h2 className="font-medium">Recent Writings</h2>
          <ul className="-mx-4 -my-3 flex flex-col gap-1">
            {latestJournals.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <li className="hover:bg-secondary rounded-md px-4 py-3 transition-all duration-300 group">
                  <article>
                    <div className="flex items-center gap-3">
                      <h3 className="group-hover:text-foreground transition-colors lowercase">
                        {post.month}
                      </h3>
                      {post.tracks.length > 0 && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm mt-1">
                      {post.subtitle}
                    </p>
                  </article>
                </li>
              </Link>
            ))}
          </ul>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm w-fit"
          >
            View all writings
          </Link>
        </section>

        {/* Connect Section */}
        <section className="flex flex-col gap-6">
          <h2 className="font-medium">Connect</h2>
          <p className="text-muted-foreground">
            Reach me at{" "}
            <a href="mailto:robertzhang930@gmail.com" className="connect-link">
              robertzhang930@gmail.com
            </a>{" "}
            for business inquiries or just to say hi. Connect with me on the platforms below.
          </p>
          <ul className="flex flex-col gap-3">
            {socialLinks.map((link) => (
              <li key={link.name} className="group w-fit">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="connect-link text-sm hover:bg-secondary -mx-3 -my-1.5 px-3 py-1.5 rounded-md transition-all"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>2026</span>
            <span>Built with care</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "robert zhang",
};
