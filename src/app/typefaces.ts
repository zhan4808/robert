import { Inter, Newsreader, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

/** The site's type, as CSS variables on <body>. Shared by the root layout and global-error, which has to be its own document. */

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const fontPlayfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair-display",
    weight: "400",
});

/** Titles and the odd italic line: a text serif with optical sizes, so it holds up at both 40px and 17px. */
export const fontNewsreader = Newsreader({
    subsets: ["latin"],
    variable: "--font-newsreader",
    weight: ["400", "500"],
    style: ["normal", "italic"],
    display: "swap",
});

export const fontGeistSans = localFont({
    src: [
        { path: "./fonts/geist-sans-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/geist-sans-latin-500-normal.woff2", weight: "500" },
    ],
    variable: "--font-geist-sans",
});

export const fontGeistMono = localFont({
    src: "./fonts/geist-mono-latin-400-normal.woff2",
    variable: "--font-geist-mono",
});

export const typefaceClassNames = `${inter.variable} ${fontPlayfairDisplay.variable} ${fontGeistMono.variable} ${fontGeistSans.variable} ${fontNewsreader.variable}`;
