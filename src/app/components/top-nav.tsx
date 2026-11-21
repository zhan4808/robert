"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import ThemeIcon from "./theme-icon";

const LINKS = [
    { label: "home", href: "/" },
    { label: "blog", href: "/blog" },
    { label: "projects", href: "/projects" },
    { label: "photos", href: "/gallery" },
];

/**
 * The site's one row of navigation, at the top of the reading column on every page. The current section is in ink
 * with a small koi-coloured mark under it; the rest sit back in the muted colour until hovered.
 */
export default function TopNav() {
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    // A post or project page still counts as being in its section.
    const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
        <header className="mx-auto w-full max-w-column px-6 pt-8 sm:pt-12">
            <nav aria-label="Main" className="flex items-center gap-5 text-small">
                {LINKS.map(({ label, href }) => {
                    const on = active(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={on ? "page" : undefined}
                            className={`relative focus-ring transition-colors duration-150 ${
                                on ? "text-foreground" : "text-muted hover:text-foreground"
                            }`}
                        >
                            {label}
                            {on && (
                                <span
                                    aria-hidden
                                    className="absolute -bottom-1.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-koi"
                                />
                            )}
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                    data-koi-ignore
                    className="ml-auto -m-2 p-2 text-muted transition-colors duration-150 hover:text-foreground focus-ring"
                >
                    <ThemeIcon size={15} />
                </button>
            </nav>
        </header>
    );
}
