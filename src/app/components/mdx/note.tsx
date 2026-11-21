import type { ReactNode } from "react";

/**
 * A callout: a hairline panel with a marker down its left edge and a mono label, "note" unless the title says
 * otherwise ("warning", "tip", or anything short).
 */
export function Note({ title = "note", children }: { title?: string; children?: ReactNode }) {
    return (
        <aside className="flex flex-col gap-2 rounded-card bg-tile px-5 py-4">
            <p className="text-small font-medium text-foreground first-letter:uppercase">{title}</p>
            <div className="flex flex-col gap-3">{children}</div>
        </aside>
    );
}
