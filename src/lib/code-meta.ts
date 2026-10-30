/**
 * What a fence's info string can say after the language: a title for the header bar, line numbers, and lines to
 * highlight. Written as ```` ```ts title="kernel.cu" showLineNumbers {3-5,8} ````, in any order.
 */
export interface CodeMeta {
    title?: string;
    lineNumbers: boolean;
    /** 1-based line numbers to highlight. */
    highlight: Set<number>;
}

export function parseCodeMeta(meta: string | undefined): CodeMeta {
    const parsed: CodeMeta = { lineNumbers: false, highlight: new Set() };
    if (!meta) return parsed;
    const title = /\btitle=(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(meta);
    if (title) parsed.title = title[1] ?? title[2] ?? title[3];
    parsed.lineNumbers = /\bshowLineNumbers\b/.test(meta);
    const ranges = /\{([\d,\s-]+)\}/.exec(meta);
    for (const range of ranges?.[1].split(",") ?? []) {
        const [from, to = from] = range.trim().split("-").map(Number);
        if (!Number.isInteger(from) || !Number.isInteger(to)) continue;
        for (let line = from; line <= to; line++) parsed.highlight.add(line);
    }
    return parsed;
}
