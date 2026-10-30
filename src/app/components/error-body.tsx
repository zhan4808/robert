"use client";

import Link from "next/link";
import Cursor from "./cursor";

/**
 * What an error page says, in the same voice as the taglines: one lowercase line, a way out underneath, and the
 * error's digest in small print for a bug report. Used inside the layout by error.tsx and on its own by global-error.
 */
export default function ErrorBody({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main
            id="main"
            tabIndex={-1}
            className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center font-geistMono outline-none"
        >
            <p className="text-small lowercase leading-relaxed tracking-tagline opacity-60">
                something broke.
                <Cursor />
            </p>
            <p className="text-caption text-muted">
                <button type="button" onClick={reset} className="ink-link">
                    try again
                </button>
                , or back to the{" "}
                <Link href="/" className="ink-link">
                    pond
                </Link>
                .
            </p>
            {error.digest && <p className="text-label text-muted">digest {error.digest}</p>}
        </main>
    );
}
