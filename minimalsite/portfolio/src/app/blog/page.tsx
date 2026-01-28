import { Navigation } from "@/components/navigation";
import { getJournalsByYear } from "@/lib/data";
import Link from "next/link";

export default function BlogPage() {
  const journalsByYear = getJournalsByYear();

  return (
    <div className="mx-auto mt-8 mb-16 flex max-w-[652px] flex-col gap-12 px-6 md:mt-16 md:gap-16">
      <Navigation />

      <main className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h1 className="font-medium text-lg">Blog</h1>
          <p className="text-muted-foreground">
            Project journals, monthly reflections, and visual notes. Each entry
            includes a soundtrack.
          </p>
        </section>

        <div className="flex flex-col gap-2">
          {Array.from(journalsByYear.entries()).map(([year, yearPosts]) => (
            <div key={year} className="flex flex-col">
              {yearPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="flex items-start gap-6 md:gap-8 py-4 border-b border-border hover:bg-secondary/50 -mx-4 px-4 rounded-md transition-colors group">
                    <span className="text-muted-foreground text-sm w-10 md:w-12 shrink-0">
                      {index === 0 ? year : ""}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-medium group-hover:text-foreground transition-colors lowercase">
                        {post.month}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                        {post.subtitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0">
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
                        >
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
