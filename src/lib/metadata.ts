import type { Metadata } from "next";
import { AUTHOR, SITE_NAME, SITE_TITLE_TEMPLATE } from "./site";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

type PageMetadataInput = {
    /** Goes through the root template, so "Projects" renders as "Projects · Robert Zhang". */
    title: string;
    /** The full title for share cards, when it differs from the short one in the tab. */
    cardTitle?: string;
    description: string;
    /** Site-relative, e.g. "/projects/tiny-gemm". Doubles as the canonical URL. */
    path: string;
    /** Articles carry a published date; everything else is a plain website page. */
    article?: { publishedTime?: Date };
    /** Site-relative URL of the page's share image. Defaults to the site-wide card. */
    image?: string;
    /** Hidden pages stay reachable by URL but ask crawlers to leave them out. */
    hidden?: boolean;
};

/**
 * Metadata for one page, with everything a child must restate because Next replaces `openGraph`, `twitter`, and
 * `alternates` wholesale instead of merging them with the root layout's.
 */
export function pageMetadata({
    title,
    cardTitle = title,
    description,
    path,
    article,
    image = "/opengraph-image",
    hidden = false,
}: PageMetadataInput): Metadata {
    const images = [{ url: image, ...OG_IMAGE_SIZE, type: "image/png", alt: cardTitle }];
    return {
        // A plain string here would drop the root template for every segment below, so the template rides along.
        title: { default: title, template: SITE_TITLE_TEMPLATE },
        description,
        alternates: { canonical: path },
        openGraph: {
            siteName: SITE_NAME,
            locale: "en_US",
            url: path,
            title: cardTitle,
            description,
            images,
            ...(article
                ? {
                      type: "article",
                      authors: [AUTHOR.name],
                      ...(article.publishedTime ? { publishedTime: article.publishedTime.toISOString() } : {}),
                  }
                : { type: "website" }),
        },
        twitter: {
            card: "summary_large_image",
            creator: AUTHOR.xHandle,
            title: cardTitle,
            description,
            images,
        },
        ...(hidden ? { robots: { index: false, follow: false } } : {}),
    };
}
