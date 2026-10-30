import Link from "next/link";
import Cursor from "./components/cursor";
import MobileNav from "./components/mobile-nav";
import TopNav from "./components/top-nav";

/** The 404: the nav, one lowercase line in the middle of the page, and the ways back. */
export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main
                id="main"
                tabIndex={-1}
                className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center font-geistMono outline-none"
            >
                <p className="text-small lowercase leading-relaxed tracking-tagline opacity-60">
                    nothing here.
                    <Cursor />
                </p>
                <p className="text-caption text-muted">
                    back to the{" "}
                    <Link href="/" className="ink-link">
                        pond
                    </Link>
                    ,{" "}
                    <Link href="/projects" className="ink-link">
                        projects
                    </Link>
                    , or the{" "}
                    <Link href="/blog" className="ink-link">
                        blog
                    </Link>
                    .
                </p>
            </main>
        </div>
    );
}
