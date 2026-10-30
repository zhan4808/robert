import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "next-themes";

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
    title: "Robert Zhang",
    description: "Robert Zhang — EE student, systems builder.",
    icons: { icon: "/site-icon.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // next-themes sets the theme class on <html> before React hydrates, which React would otherwise flag.
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${fontPlayfairDisplay.variable} ${fontGeistMono.variable} ${fontGeistSans.variable} scroll-smooth overflow-x-clip bg-background text-foreground`}
            >
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
