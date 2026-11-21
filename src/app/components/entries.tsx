import Link from "next/link";
import type { JournalPost, Project } from "../../lib/content-schema";

/** What a post is, as the index labels it, with the colour of its dot. */
export const KINDS = {
    technical: { label: "research", dot: "bg-koi" },
    journal: { label: "life", dot: "bg-[#5b8aa6] dark:bg-[#8fb6cc]" },
} as const;

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

export function KindTag({ kind, className = "" }: { kind: JournalPost["kind"]; className?: string }) {
    const k = KINDS[kind];
    return (
        <span className={`inline-flex items-center gap-1.5 font-geistMono text-label text-muted ${className}`}>
            <span aria-hidden className={`h-[5px] w-[5px] rounded-full ${k.dot}`} />
            {k.label}
        </span>
    );
}

/**
 * One line of a list: date, title, and the kind on the right. The title firms its underline on hover; nothing else
 * moves.
 */
export function PostRow({ post, bare = false }: { post: JournalPost; bare?: boolean }) {
    const row = (
        <Link
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-[3.75rem_1fr_auto] items-baseline gap-x-4 py-[7px] focus-ring"
        >
            <span className="font-geistMono text-caption tabular-nums text-muted">{shortDate(post.date)}</span>
            <span className="min-w-0 text-body leading-snug">
                <span className="underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors duration-150 group-hover:decoration-koi group-focus-visible:decoration-koi">
                    {post.title}
                </span>
                {post.part && (
                    <span className="ml-2 font-geistMono text-label tabular-nums text-muted">{post.part}/4</span>
                )}
            </span>
            <KindTag kind={post.kind} className="max-sm:hidden" />
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
                className="group flex flex-col gap-0.5 py-2 focus-ring"
            >
                <span className="flex items-baseline gap-3">
                    <span className="text-body leading-snug underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors duration-150 group-hover:decoration-koi group-focus-visible:decoration-koi">
                        {project.shortTitle ?? project.title}
                    </span>
                    {(showYear || project.date !== String(project.year)) && (
                        <span className="ml-auto shrink-0 font-geistMono text-label tabular-nums text-muted">
                            {project.date}
                        </span>
                    )}
                </span>
                <span className="text-small leading-relaxed text-muted [text-wrap:pretty]">{project.description}</span>
            </Link>
        </li>
    );
}

/** A small mono heading over a list, with a hairline running out to the right. */
export function ListHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <div className="mb-2 flex items-center gap-3 font-geistMono text-caption text-muted">
            <h2>{children}</h2>
            <span aria-hidden className="h-px flex-1 bg-hairline" />
            {action}
        </div>
    );
}
