"use client";

import ErrorBody from "./components/error-body";
import MobileNav from "./components/mobile-nav";
import TopNav from "./components/top-nav";

/** A page that threw while rendering: the nav stays, and the body says so and offers another go. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <ErrorBody error={error} reset={reset} />
        </div>
    );
}
