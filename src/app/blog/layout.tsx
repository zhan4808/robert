import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    title: "Blog",
    description: "Notes on kernels, chips, and everything else.",
    path: "/blog",
});

export default function BlogLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
