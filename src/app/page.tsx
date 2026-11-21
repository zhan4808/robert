import Link from "next/link";
import { getProjects, getVisiblePosts } from "../lib/content";
import { ListHeading, PostRow, ProjectRow } from "./components/entries";
import FrontPage from "./components/front-page";
import KoiBanner from "./components/koi-banner";
import SiteFooter from "./components/site-footer";
import TopNav from "./components/top-nav";

const RECENT_POSTS = 5;
const SELECTED_PROJECTS = 3;

const MORE = "ink-link font-geistMono text-caption text-muted";

export default function Home() {
    const posts = getVisiblePosts().slice(0, RECENT_POSTS);
    const projects = getProjects()
        .filter((p) => !p.hidden)
        .slice(0, SELECTED_PROJECTS);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <TopNav />
            <main
                id="main"
                tabIndex={-1}
                className="mx-auto flex w-full max-w-column flex-col gap-14 px-6 pt-10 outline-none sm:pt-14"
            >
                <KoiBanner />
                <FrontPage />
                <section>
                    <ListHeading
                        action={
                            <Link href="/blog" className={MORE}>
                                all posts
                            </Link>
                        }
                    >
                        writing
                    </ListHeading>
                    <ul>
                        {posts.map((post) => (
                            <PostRow key={post.slug} post={post} />
                        ))}
                    </ul>
                </section>
                <section>
                    <ListHeading
                        action={
                            <Link href="/projects" className={MORE}>
                                all projects
                            </Link>
                        }
                    >
                        projects
                    </ListHeading>
                    <ul>
                        {projects.map((project) => (
                            <ProjectRow key={project.slug} project={project} showYear />
                        ))}
                    </ul>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
