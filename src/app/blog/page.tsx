import { getEntriesByYear } from "../../lib/content";
import SiteFooter from "../components/site-footer";
import TopNav from "../components/top-nav";
import BlogIndex from "./blog-index";

/** Every post and project, newest year first. */
export default function Blog() {
    const years = getEntriesByYear();

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <TopNav />
            <main id="main" tabIndex={-1} className="mx-auto w-full max-w-column px-6 pt-14 outline-none sm:pt-20">
                <header className="mb-8">
                    <h1 className="font-serif text-[28px] font-normal leading-[1.15] sm:text-title">Blog</h1>
                    <p className="mt-2 font-serif text-[19px] italic text-muted">
                        writing and projects: kernels, chips, and everything else.
                    </p>
                </header>
                <BlogIndex years={years} />
            </main>
            <SiteFooter />
        </div>
    );
}
