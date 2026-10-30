import { z } from "zod";

/**
 * Frontmatter for the files under content/. Every field a page, list, feed, or share card reads is declared here;
 * the MDX body is everything below the frontmatter. `.strict()` makes a misspelt key a build error instead of a
 * silently missing field.
 */

const nonEmpty = z.string().trim().min(1);

/** A hero or visualization figure: an image or a video under public/, with alt text. */
export const mediaSchema = z
    .object({
        type: z.enum(["image", "video"]),
        src: nonEmpty,
        alt: z.string(),
    })
    .strict();

export const projectFrontmatterSchema = z
    .object({
        title: nonEmpty,
        /** Short name for tiles, pagers, and hover cards; the full title heads the page. */
        shortTitle: nonEmpty.optional(),
        description: nonEmpty,
        longDescription: nonEmpty,
        /** Written for people: "2026", "October 2025", or "January 21, 2026". */
        date: nonEmpty,
        /** When the write-up was last revised, as an ISO date ("2026-03-04"); shown beside the date when set. */
        updated: z.iso.date().optional(),
        year: z.number().int(),
        /** Where it sits among the projects; lower comes first. */
        order: z.number().int(),
        tags: z.array(nonEmpty).default([]),
        featured: z.boolean().optional(),
        /** Hidden projects get no page and stay out of every list. */
        hidden: z.boolean().optional(),
        /** 3:2 preview on the projects strip. */
        thumb: nonEmpty.optional(),
        /**
         * How the preview sits in its tile. "cover" (default) crops to fill, for photos and renders. "figure" fits a
         * white-background plot or diagram inside the tile, knocks the white out, and inverts it in dark mode.
         */
        thumbStyle: z.enum(["cover", "figure"]).optional(),
        hero: mediaSchema.optional(),
        /** Set when the write-up lives elsewhere: the tile links out and no page is built. */
        externalUrl: nonEmpty.optional(),
        liveUrl: nonEmpty.optional(),
        paperUrl: nonEmpty.optional(),
        githubUrl: nonEmpty.optional(),
    })
    .strict();

export const trackSchema = z
    .object({
        title: nonEmpty,
        artist: nonEmpty,
        albumArt: nonEmpty.optional(),
        spotifyUrl: nonEmpty.optional(),
        audioSrc: nonEmpty.optional(),
    })
    .strict();

export const postFrontmatterSchema = z
    .object({
        title: nonEmpty,
        subtitle: nonEmpty,
        /** Written for people: "October 2025" or "July 31, 2025". */
        date: nonEmpty,
        /** When the post was last revised, as an ISO date ("2026-03-04"); shown beside the date when set. */
        updated: z.iso.date().optional(),
        year: z.number().int(),
        /** Where it sits among the posts; lower comes first. */
        order: z.number().int(),
        /** Hidden posts still build at their URL (with noindex) but stay out of the list, the feed, and the sitemap. */
        hidden: z.boolean().optional(),
        coverImage: nonEmpty.optional(),
        /** Tailwind gradient stops, e.g. "from-orange-300 via-pink-300 to-blue-300". */
        coverGradient: nonEmpty.optional(),
        /** What was playing while it was written. */
        tracks: z.array(trackSchema).default([]),
    })
    .strict();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type JournalTrack = z.infer<typeof trackSchema>;

/** A project's frontmatter plus its slug (the file name). The write-up itself is the MDX body. */
export type Project = ProjectFrontmatter & { slug: string };
/** A post's frontmatter plus its slug (the file name). The text itself is the MDX body. */
export type JournalPost = PostFrontmatter & { slug: string };
