import type { Metadata } from "next";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    title: "Gallery",
    description: "Photos from outside the lab.",
    path: "/gallery",
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
