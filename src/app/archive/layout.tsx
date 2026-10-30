import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    title: "Archive",
    description: "Every version of this site since 2023, each run from its commit and photographed as it was.",
    path: "/archive",
});

export default function ArchiveLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
