import Link from "next/link";

const LINKS = [
    { label: "GitHub", href: "https://github.com/zhan4808" },
    { label: "LinkedIn", href: "https://linkedin.com/in/robert05" },
    { label: "X", href: "https://x.com/robdobflob" },
    { label: "RSS", href: "/feed.xml" },
    { label: "Archive", href: "/archive" },
];

/** The foot of every page: where else to find me, and the site's past designs. */
export default function SiteFooter() {
    return (
        <footer className="mx-auto w-full max-w-column px-6 pb-14 pt-20">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-5 text-small text-muted">
                <span>Robert Zhang</span>
                <span aria-hidden className="text-faint">
                    ·
                </span>
                {LINKS.map(({ label, href }) => {
                    const external = /^https?:/.test(href);
                    return external ? (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ink-link text-muted"
                        >
                            {label}
                        </a>
                    ) : (
                        <Link key={label} href={href} className="ink-link text-muted">
                            {label}
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
}
