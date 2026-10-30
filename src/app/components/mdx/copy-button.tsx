"use client";

import { useEffect, useRef, useState } from "react";
import { MUTED } from "./styles";

/** Puts the text in an off-screen textarea, selects it, and asks the browser to copy the selection. */
function copyBySelection(text: string): boolean {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let copied = false;
    try {
        copied = document.execCommand("copy");
    } finally {
        area.remove();
    }
    return copied;
}

/** Copies the code in the nearest `[data-code-block]` to the clipboard; reads "copied" for a moment after. */
export function CopyButton() {
    const ref = useRef<HTMLButtonElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    const copy = async () => {
        const code = ref.current?.closest("[data-code-block]")?.querySelector("pre")?.textContent;
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
        } catch {
            // No clipboard API or no permission for it (an embedded browser, say): the old way, through a selection.
            if (copyBySelection(code)) setCopied(true);
        }
    };

    return (
        <button
            ref={ref}
            type="button"
            onClick={copy}
            aria-live="polite"
            className={`rounded-chip px-1.5 py-0.5 font-geistMono text-caption focus-ring transition-colors hover:text-foreground focus-visible:text-foreground ${MUTED}`}
        >
            {copied ? "copied" : "copy"}
        </button>
    );
}
