"use client";

import "./globals.css";
import ErrorBody from "./components/error-body";
import { typefaceClassNames } from "./typefaces";

/**
 * Picks the theme the way next-themes does, since this page renders without the root layout and its provider: the
 * stored choice if there is one, otherwise the system's.
 */
const PICK_THEME = `try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

/** The root layout itself failed, so this is the whole document: the same body as error.tsx, without the nav. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: PICK_THEME }} />
            </head>
            <body className={`${typefaceClassNames} bg-background text-foreground`}>
                <ErrorBody error={error} reset={reset} />
            </body>
        </html>
    );
}
