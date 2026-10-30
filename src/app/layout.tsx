import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "next-themes";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_TEMPLATE, SITE_URL } from "../lib/site";
import JsonLd from "./components/json-ld";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const fontPlayfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair-display",
    weight: "400",
});

const fontGeistSans = localFont({
    src: [
        { path: "./fonts/geist-sans-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/geist-sans-latin-500-normal.woff2", weight: "500" },
    ],
    variable: "--font-geist-sans",
});

const fontGeistMono = localFont({
    src: "./fonts/geist-mono-latin-400-normal.woff2",
    variable: "--font-geist-mono",
});

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
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${fontPlayfairDisplay.variable} ${fontGeistMono.variable} ${fontGeistSans.variable} scroll-smooth overflow-x-clip bg-background text-foreground`}
            >
                <JsonLd />
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
