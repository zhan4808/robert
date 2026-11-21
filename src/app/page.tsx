import Link from "next/link";
import { getEntries } from "../lib/content";
import { EntryRow, ListHeading } from "./components/entries";
import FrontPage from "./components/front-page";
import KoiBanner from "./components/koi-banner";
import SiteFooter from "./components/site-footer";
import TopNav from "./components/top-nav";

const RECENT = 7;

const MORE = "ink-link text-small text-muted";

export default function Home() {
    const entries = getEntries().slice(0, RECENT);

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
                                Everything
                            </Link>
                        }
                    >
                        Recent
                    </ListHeading>
                    <ul>
                        {entries.map((entry) => (
                            <EntryRow key={entry.href} entry={entry} />
                        ))}
                    </ul>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
