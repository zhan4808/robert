import { projectsByDate } from "../data/projects";
import { ProjectRow } from "../components/entries";
import SiteFooter from "../components/site-footer";
import TopNav from "../components/top-nav";

/** The projects, newest year first, each with a line on what it is. */
export default function ProjectsRoute() {
    const years = new Map<number, typeof projectsByDate>();
    for (const p of projectsByDate) years.set(p.year, [...(years.get(p.year) ?? []), p]);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <TopNav />
            <main id="main" tabIndex={-1} className="mx-auto w-full max-w-column px-6 pt-14 outline-none sm:pt-20">
                <header className="mb-10">
                    <h1 className="font-serif text-[28px] font-normal leading-[1.15] sm:text-title">Projects</h1>
                    <p className="mt-2 font-serif text-[19px] italic text-muted">
                        kernels, accelerators, and the measurements in between.
                    </p>
                </header>
                <div className="flex flex-col gap-9">
                    {[...years.entries()].map(([year, list]) => (
                        <section key={year}>
                            <h2 className="mb-2 border-b border-hairline pb-2 font-serif text-[20px] tabular-nums">
                                {year}
                            </h2>
                            <ul className="flex flex-col gap-1">
                                {list.map((project) => (
                                    <ProjectRow key={project.slug} project={project} />
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
