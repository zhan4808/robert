import Link from "next/link";
import type { ReactNode } from "react";
import type { Entry } from "../../lib/content";
import type { JournalPost, Project } from "../../lib/content-schema";

/** What a post is, as the index labels it, with the colour of its dot and its label. */
export const KINDS = {
    technical: { label: "Research", dot: "bg-koi", text: "text-koi" },
    project: { label: "Project", dot: "bg-kind-project", text: "text-kind-project" },
    journal: { label: "Life", dot: "bg-kind-life", text: "text-kind-life" },
} as const;
export type Kind = keyof typeof KINDS;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = MONTHS.map((m) => m.toLowerCase());

/**
 * One precision everywhere: the month ("January 21, 2026" and "January 2026" are both "Jan"), since the year heads
 * the group. A date that is only a year ("2026") shows the year rather than a blank.
 */
export function shortDate(date: string) {
    const written = date.trim();
    if (/^\d{4}$/.test(written)) return written;
    const m = /^([A-Za-z]+)\s+(?:\d{1,2},\s+)?\d{4}$/.exec(written);
    if (!m) return "";
    const i = MONTH_NAMES.indexOf(m[1].slice(0, 3).toLowerCase());
    return i < 0 ? "" : MONTHS[i];
}

/** The kind, tinted with its dot's colour. On phones only the dot shows; the label stays for screen readers. */
export function KindTag({ kind, className = "" }: { kind: Kind; className?: string }) {
    const k = KINDS[kind];
    return (
        <span className={`inline-flex items-center gap-2 text-small ${k.text} ${className}`}>
            <span aria-hidden className={`h-[6px] w-[6px] rounded-full ${k.dot}`} />
            <span className="max-sm:sr-only">{k.label}</span>
        </span>
    );
}

const COUNT = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
/** "four parts": the count spelt out while it is small. */
const partsLabel = (n: number) => `${COUNT[n] ?? n} part${n === 1 ? "" : "s"}`;

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
            <span className="min-w-0 text-body leading-snug">
                <span className={TITLE}>{post.title}</span>
            </span>
            {tag && <KindTag kind={post.kind} />}
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
                    <span className={`text-body leading-snug ${TITLE}`}>{project.shortTitle ?? project.title}</span>
                    {(showYear || project.date !== String(project.year)) && (
                        <span className="ml-auto shrink-0 text-small tabular-nums text-muted">{project.date}</span>
                    )}
                </span>
                <span className="text-ui leading-relaxed text-muted [text-wrap:pretty]">{project.description}</span>
            </Link>
        </li>
    );
}

/** A section heading over a list on the home page, with a quiet link to the rest on the right. */
export function ListHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
    return (
        <div className="mb-3 flex items-baseline justify-between border-b border-hairline pb-3">
            <h2 className="font-serif text-heading font-normal leading-none">{children}</h2>
            {action}
        </div>
    );
}

const ROW = "grid grid-cols-[4rem_1fr_auto] items-baseline gap-x-5";

/**
 * One line of the combined index: date, title and what it is. Posts and projects share the same row. A series is
 * its name, how many parts it has, and a line for each part underneath, each linking to its post.
 */
export function EntryRow({ entry, bare = false }: { entry: Entry; bare?: boolean }) {
    const head = (
        <Link
            href={entry.href}
            target={entry.external ? "_blank" : undefined}
            rel={entry.external ? "noopener noreferrer" : undefined}
            className={`group ${ROW} py-2 focus-ring`}
        >
            <span className="text-small tabular-nums text-muted">{shortDate(entry.date)}</span>
            <span className="min-w-0 text-body leading-snug">
                <span className={TITLE}>{entry.title}</span>
                {entry.parts && <span className="ml-2 text-small text-muted">{partsLabel(entry.parts.length)}</span>}
            </span>
            <KindTag kind={entry.kind} />
        </Link>
    );
    const row = entry.parts ? (
        <div>
            {head}
            <div className={`${ROW} -mt-1 pb-2`}>
                <ol aria-label={`Parts of ${entry.title}`} className="col-start-2 flex flex-col gap-1 pl-4">
                    {entry.parts.map((p) => (
                        <li key={p.href}>
                            <Link
                                href={p.href}
                                className="group inline-flex gap-2 text-small leading-snug text-muted transition-colors duration-150 hover:text-foreground focus-ring"
                            >
                                <span className="tabular-nums">{p.part}</span>
                                <span className={TITLE}>{p.title}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    ) : (
        head
    );
    return bare ? row : <li>{row}</li>;
}
