import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    title: "Projects",
    description:
        "Write-ups on GPU kernels, ML systems, and hardware: matmul kernels, MLA serving, sparse attention, a RISC-V CPU.",
    path: "/projects",
});

export default function ProjectsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
