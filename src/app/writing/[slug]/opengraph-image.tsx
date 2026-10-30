import { notFound } from "next/navigation";
import { getVisibleJournals } from "../../../lib/data";
import { OG_CONTENT_TYPE, OG_SIZE, articleCard } from "../../../lib/og";
import { SITE_NAME } from "../../../lib/site";

/** Drawn at build time for every visible post; hidden posts share the site-wide card instead. */
export const dynamicParams = false;

export function generateStaticParams() {
    return getVisibleJournals().map((post) => ({ slug: post.slug }));
}

export const alt = `Writing by ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getVisibleJournals().find((entry) => entry.slug === slug);
    if (!post) notFound();
    return articleCard({ section: "writing", when: post.date, title: post.month, line: post.subtitle });
}
