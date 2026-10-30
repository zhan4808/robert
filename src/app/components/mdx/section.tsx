import type { ReactNode } from "react";

/**
 * One titled part of a project write-up. The id is the anchor (`/projects/tiny-gemm#results`), so it is written down
 * rather than derived from the title, and stays put when the title is reworded.
 */
export function Section({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
    return (
        <section id={id} className="[&:not(:first-child)]:mt-16">
            <h2 className="mb-5 text-[16px] font-medium leading-[1.6]">{title}</h2>
            <div className="flex flex-col gap-5">{children}</div>
        </section>
    );
}
