import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/** The foreground at a share of its strength, which is how every secondary colour on the site is made. */
const ink = (percent: number) => `color-mix(in srgb, var(--foreground-color) ${percent}%, transparent)`;

export default {
    // next-themes puts `dark` or `light` on <html>.
    darkMode: "selector",
    // Content files name gradient stops (<Gradient className="from-orange-300 ...">), so they are scanned too.
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./content/**/*.mdx"],
    theme: {
        extend: {
            colors: {
                "light-foreground": "#262523",
                "light-background": "#f5f4f1",
                "dark-foreground": "#fff7f0",
                "dark-background": "#1a1917",
                background: "var(--background-color)",
                foreground: "var(--foreground-color)",
                // Secondary text: dates, captions, labels, descriptions. Set per theme in the plugin below.
                muted: "var(--muted-color)",
                // Running prose, a step quieter than the foreground so headings and emphasis stand out from it.
                prose: ink(72),
                // Underlines at rest, before hover firms them up.
                faint: ink(35),
                // Borders and rules.
                hairline: ink(10),
                // Quiet surfaces: thumbnail tiles, inline code, hovered rows.
                tile: ink(6),
            },
            // The type scale, in pixels, so it doesn't drift with the browser's font size the way the layout does.
            fontSize: {
                label: "11px", // the smallest mono: footnote marks, sub-entries in the contents, card hints
                caption: "12px", // mono labels: dates, captions, the contents rail, code titles
                meta: "13px", // the nav, code, lists' years, the mobile tagline
                small: "14px", // secondary sans: descriptions, subtitles, the desktop tagline
                ui: "15px", // names and titles in lists and cards
                body: "16px", // prose and the page intro
                lede: "17px", // the phone project list's text
                heading: "21px", // the phone project list's titles
                title: ["28px", { lineHeight: "1.2", letterSpacing: "-0.015em" }], // the page title of a write-up
            },
            lineHeight: {
                body: "1.7", // prose
                compact: "1.6", // headings, intros, and the phone's front page
            },
            letterSpacing: {
                tagline: "0.02em", // the lowercase mono one-liners
            },
            borderRadius: {
                chip: "4px", // inline code, small media, thumbnails in cards
                card: "6px", // panels, figures, code blocks
                panel: "8px", // floating cards
            },
            maxWidth: {
                column: "56rem", // the reading column of the write-ups and the blog list
            },
            spacing: {
                gutter: "20vw", // the desktop page gutter
            },
            keyframes: {
                blink: {
                    "0%, 49%": { opacity: "1" },
                    "50%, 100%": { opacity: "0" },
                },
            },
            animation: {
                blink: "blink 1.1s step-end infinite",
            },
            fontFamily: {
                inter: "var(--font-inter)",
                playfairDisplay: "var(--font-playfair-display)",
                geistMono: "var(--font-geist-mono)",
                geistSans: "var(--font-geist-sans)",
            },
        },
    },
    plugins: [
        plugin(({ addBase, theme }) => {
            addBase({
                // Dark text on a light page needs a heavier mix to read as clearly (both land near 4.5:1).
                ":root": {
                    "--background-color": theme("colors.light-background"),
                    "--foreground-color": theme("colors.light-foreground"),
                    "--muted-color": ink(64),
                },
                ".dark": {
                    "--background-color": theme("colors.dark-background"),
                    "--foreground-color": theme("colors.dark-foreground"),
                    "--muted-color": ink(50),
                },
            });
        }),
    ],
} satisfies Config;
