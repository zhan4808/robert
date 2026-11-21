import Link from "next/link";
import type { ReactNode } from "react";
import type { Entry } from "../../lib/content";
import type { JournalPost, Project } from "../../lib/content-schema";

/** What a post is, as the index labels it, with the colour of its dot. */
export const KINDS = {
    technical: { label: "Research", dot: "bg-koi" },
    project: { label: "Project", dot: "bg-[#8b7f6a] dark:bg-[#b8ab92]" },
    journal: { label: "Life", dot: "bg-[#5b8aa6] dark:bg-[#8fb6cc]" },
} as const;
export type Kind = keyof typeof KINDS;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = MONTHS.map((m) => m.toLowerCase());

/** "January 21, 2026" → "Jan 21", "November 2026" → "Nov"; the year is the group heading above. */
export function shortDate(date: string) {
    const m = /^([A-Za-z]+)\s+(?:(\d{1,2}),\s+)?\d{4}$/.exec(date.trim());
    if (!m) return "";
    const i = MONTH_NAMES.indexOf(m[1].slice(0, 3).toLowerCase());
    if (i < 0) return "";
    return m[2] ? `${MONTHS[i]} ${m[2]}` : MONTHS[i];
}

export function KindTag({ kind, className = "" }: { kind: Kind; className?: string }) {
    const k = KINDS[kind];
    return (
        <span className={`inline-flex items-center gap-2 text-small text-muted ${className}`}>
            <span aria-hidden className={`h-[6px] w-[6px] rounded-full ${k.dot}`} />
            {k.label}
        </span>
    );
}

const TITLE =
    "underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors duration-150 group-hover:decoration-koi group-focus-visible:decoration-koi";

/**
 * One line of a list: date, title, and (on the blog index) the kind on the right. The title firms its underline on
 * hover; nothing else moves.
 */
export function PostRow({ post, bare = false, tag = false }: { post: JournalPost; bare?: boolean; tag?: boolean }) {
    const row = (
        <Link
            href={`/blog/${post.slug}`}
            className={`group grid items-baseline gap-x-5 py-2 focus-ring ${
                tag ? "grid-cols-[4rem_1fr_auto]" : "grid-cols-[4rem_1fr]"
            }`}
        >
            <span className="text-small tabular-nums text-muted">{shortDate(post.date)}</span>
            <span className="min-w-0 text-[16px] leading-snug">
                <span className={TITLE}>{post.title}</span>
            </span>
            {tag && <KindTag kind={post.kind} className="max-sm:hidden" />}
        </Link>
    );
    return bare ? row : <li>{row}</li>;
}

/** A project in a list: its title and one line on what it is. */
export function ProjectRow({ project, showYear = false }: { project: Project; showYear?: boolean }) {
    const href = project.externalUrl ?? `/projects/${project.slug}`;
    const external = !!project.externalUrl;
    return (
        <li>
            <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex flex-col gap-1 py-2.5 focus-ring"
            >
                <span className="flex items-baseline gap-3">
                    <span className={`text-[16px] leading-snug ${TITLE}`}>{project.shortTitle ?? project.title}</span>
                    {(showYear || project.date !== String(project.year)) && (
                        <span className="ml-auto shrink-0 text-small tabular-nums text-muted">{project.date}</span>
                    )}
                </span>
                <span className="text-[15px] leading-relaxed text-muted [text-wrap:pretty]">{project.description}</span>
            </Link>
        </li>
    );
}

/** A section heading over a list on the home page, with a quiet link to the rest on the right. */
export function ListHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
    return (
        <div className="mb-3 flex items-baseline justify-between border-b border-hairline pb-3">
            <h2 className="font-serif text-[22px] font-normal leading-none">{children}</h2>
            {action}
        </div>
    );
}

/** One line of the combined index: date, title and what it is. Posts and projects share the same row. */
export function EntryRow({ entry, bare = false }: { entry: Entry; bare?: boolean }) {
    const row = (
        <Link
            href={entry.href}
            target={entry.external ? "_blank" : undefined}
            rel={entry.external ? "noopener noreferrer" : undefined}
            className="group grid grid-cols-[4rem_1fr_auto] items-baseline gap-x-5 py-2 focus-ring"
        >
            <span className="text-small tabular-nums text-muted">{shortDate(entry.date)}</span>
            <span className="min-w-0 text-[16px] leading-snug">
                <span className={TITLE}>{entry.title}</span>
            </span>
            <KindTag kind={entry.kind} className="max-sm:hidden" />
        </Link>
    );
    return bare ? row : <li>{row}</li>;
}
