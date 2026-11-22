import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "next-themes";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_TEMPLATE, SITE_URL } from "../lib/site";
import JsonLd from "./components/json-ld";
import { typefaceClassNames } from "./typefaces";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: SITE_TITLE_TEMPLATE },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: AUTHOR.name, url: SITE_URL }],
    creator: AUTHOR.name,
    alternates: {
        canonical: "/",
        types: { "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} — Blog` }] },
    },
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
        url: "/",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        creator: AUTHOR.xHandle,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    // The favicon and home-screen icon come from icon.tsx and apple-icon.tsx beside this file.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // next-themes sets the theme class on <html> before React hydrates, which React would otherwise flag.
        // overflow-x-clip on <html> too: a body-only clip propagates to the viewport, where iOS still lets a photo's
        // ripple canvas (which bleeds past its frame) pan the page sideways on a phone.
        <html lang="en" suppressHydrationWarning className="overflow-x-clip">
            <body
                className={`${typefaceClassNames} scroll-smooth motion-reduce:scroll-auto overflow-x-clip bg-background text-foreground`}
            >
                {/* Hidden until it is tabbed to; every page's <main> carries id="main". */}
                <a href="#main" className="skip-link focus-ring">
                    skip to content
                </a>
                <JsonLd />
                {/* Paper by default; the toggle's choice is kept. */}
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
