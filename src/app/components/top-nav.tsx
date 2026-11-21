"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import ThemeIcon from "./theme-icon";

const LINKS = [
    { label: "home", href: "/" },
    { label: "blog", href: "/blog" },
    { label: "photos", href: "/gallery" },
];

/**
 * The site's one row of navigation, at the top of the reading column on every page. The current section is in ink
 * with a small koi-coloured mark under it; the rest sit back in the muted colour until hovered.
 */
export default function TopNav() {
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();

    /**
     * Switches theme inside a view transition: the new theme is revealed in a circle that grows out of the toggle
     * until it covers the window. Without view transitions, or with reduced motion, the switch is instant.
     */
    const toggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        const root = document.documentElement;
        const apply = () => {
            // Set the class right away so the new snapshot is already in the new theme; next-themes agrees a beat later.
            root.classList.remove("light", "dark");
            root.classList.add(next);
            root.style.colorScheme = next;
            flushSync(() => setTheme(next));
        };
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || still) {
            apply();
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        root.dataset.transition = "theme";
        const transition = document.startViewTransition(apply);
        transition.ready.then(() => {
            root.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`] },
                {
                    duration: 650,
                    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
        transition.finished.finally(() => delete root.dataset.transition);
    };
    // A post or project page still counts as being in its section.
    // Projects live in the blog's index, so a project page counts as being in the blog.
    const active = (href: string) =>
        pathname === href ||
        (href !== "/" && pathname.startsWith(`${href}/`)) ||
        (href === "/blog" && pathname.startsWith("/projects"));

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
                    onClick={toggleTheme}
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
