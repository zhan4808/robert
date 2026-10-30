import { getVisibleJournals, type JournalPost } from "../../lib/data";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, absoluteUrl, parseContentDate } from "../../lib/site";

/** The feed is built once at build time from the data file, like the pages it lists. */
export const dynamic = "force-static";

const FEED_TITLE = `${SITE_NAME} — Writing`;

const escapeXml = (text: string): string =>
    text.replace(/[<>&'"]/g, (char) => {
        switch (char) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            default:
                return "&quot;";
        }
    });

/** Newest first; posts whose date cannot be read go last, in their written order. */
function byDateDesc(posts: JournalPost[]): { post: JournalPost; date: Date | undefined }[] {
    return posts
        .map((post, index) => ({ post, date: parseContentDate(post.date), index }))
        .sort((a, b) => {
            if (a.date && b.date) return b.date.getTime() - a.date.getTime();
            if (a.date) return -1;
            if (b.date) return 1;
            return a.index - b.index;
        });
}

function item({ post, date }: { post: JournalPost; date: Date | undefined }): string {
    const url = absoluteUrl(`/writing/${post.slug}`);
    return [
        "        <item>",
        `            <title>${escapeXml(post.month)}</title>`,
        `            <link>${url}</link>`,
        `            <guid isPermaLink="true">${url}</guid>`,
        `            <description>${escapeXml(post.subtitle)}</description>`,
        ...(date ? [`            <pubDate>${date.toUTCString()}</pubDate>`] : []),
        "        </item>",
    ].join("\n");
}

export function GET(): Response {
    const posts = byDateDesc(getVisibleJournals());
    const newest = posts.find((entry) => entry.date)?.date;
    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "    <channel>",
        `        <title>${escapeXml(FEED_TITLE)}</title>`,
        `        <link>${absoluteUrl("/writing")}</link>`,
        `        <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
        "        <language>en-us</language>",
        `        <managingEditor>${escapeXml(`${AUTHOR.email} (${AUTHOR.name})`)}</managingEditor>`,
        ...(newest ? [`        <lastBuildDate>${newest.toUTCString()}</lastBuildDate>`] : []),
        `        <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />`,
        ...posts.map(item),
        "    </channel>",
        "</rss>",
        "",
    ].join("\n");

    return new Response(xml, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
}
