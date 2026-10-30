import type { ReactNode } from "react";
import { PANEL } from "./styles";

/**
 * A callout: a hairline panel with a marker down its left edge and a mono label, "note" unless the title says
 * otherwise ("warning", "tip", or anything short).
 */
export function Note({ title = "note", children }: { title?: string; children?: ReactNode }) {
    return (
        <aside className={`${PANEL} flex flex-col gap-3 border-l-2 border-l-[var(--muted-color)] py-4 pl-5 pr-4`}>
            <p className="font-geistMono text-[12px] lowercase text-foreground">{title}</p>
            <div className="flex flex-col gap-3">{children}</div>
        </aside>
    );
}
