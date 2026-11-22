import Link from "next/link";
import { Fragment } from "react";
import { AUTHOR } from "../../lib/site";

const LINKS = [
    { label: "GitHub", href: AUTHOR.github },
    { label: "X", href: AUTHOR.x },
    { label: "LinkedIn", href: AUTHOR.linkedin },
    { label: "Email", href: `mailto:${AUTHOR.email}` },
    { label: "RSS", href: "/feed.xml" },
    { label: "Archive", href: "/archive" },
];

/**
 * The foot of every page: my name, then where else to find me and the site's past designs as one comma-separated
 * line. The line wraps between links, never inside one, so nothing is cut off on a narrow phone.
 */
export default function SiteFooter() {
    return (
        <footer className="mx-auto w-full max-w-column px-6 pb-14 pt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-hairline pt-5 text-small text-muted">
                <span>{AUTHOR.name}</span>
                <p>
                    {LINKS.map(({ label, href }, i) => {
                        const link = /^https?:/.test(href) ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="ink-link text-muted">
                                {label}
                            </a>
                        ) : href.startsWith("mailto:") ? (
                            <a href={href} className="ink-link text-muted">
                                {label}
                            </a>
                        ) : (
                            <Link href={href} className="ink-link text-muted">
                                {label}
                            </Link>
                        );
                        return (
                            <Fragment key={label}>
                                {i > 0 && " "}
                                <span className="whitespace-nowrap">
                                    {link}
                                    {i < LINKS.length - 1 && ","}
                                </span>
                            </Fragment>
                        );
                    })}
                </p>
            </div>
        </footer>
    );
}
