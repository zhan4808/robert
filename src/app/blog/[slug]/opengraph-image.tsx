import { notFound } from "next/navigation";
import { getVisiblePosts } from "../../../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, articleCard } from "../../../lib/og";
import { SITE_NAME } from "../../../lib/site";

/** Drawn at build time for every visible post; hidden posts share the site-wide card instead. */
export const dynamicParams = false;

export function generateStaticParams() {
    return getVisiblePosts().map((post) => ({ slug: post.slug }));
}

export const alt = `Blog by ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getVisiblePosts().find((entry) => entry.slug === slug);
    if (!post) notFound();
    return articleCard({ section: "blog", when: post.date, title: post.title, line: post.subtitle });
}
