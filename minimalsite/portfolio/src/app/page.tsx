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
            Electrical engineer and computer scientist from the Bay Area building
            for AI-driven hardware and software optimizations. I also share the
            process through project journals, visual experiments, and writing.
          </p>
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
          <ul className="flex flex-col gap-4">
            {experiences.map((experience) => (
              <li
                key={experience.title}
                className="flex items-center justify-between gap-6 rounded-md border border-border px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    className="h-10 w-10 rounded-full object-contain"
                  />
                  <div>
                    <p className="font-medium">{experience.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {experience.company}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{experience.period}</span>
              </li>
            ))}
          </ul>
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
