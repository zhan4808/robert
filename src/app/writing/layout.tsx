import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    title: "Writing",
    description: "Notes on kernels, chips, and everything else.",
    path: "/writing",
});

export default function WritingLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
