import type { ReactNode } from "react";
import { H2 } from "./prose";

/**
 * One titled part of a project write-up. The id is the anchor (`/projects/tiny-gemm#results`), so it is written down
 * rather than derived from the title, and stays put when the title is reworded. The heading is the same <H2> a post
 * uses, so a project's sections read like a post's.
 */
export function Section({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
    return (
        <section className="flex flex-col gap-5 [&+&]:mt-5">
            <H2 id={id}>{title}</H2>
            {children}
        </section>
    );
}
