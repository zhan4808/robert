/** The site's identity, written down once so page metadata, the feed, the sitemap, and the share cards agree. */

export const SITE_URL = "https://robertzhang.me";
export const SITE_NAME = "Robert Zhang";
/** Page titles end with the site name, "Projects · Robert Zhang"; the home page is just the name. */
export const SITE_TITLE_TEMPLATE = `%s · ${SITE_NAME}`;
export const SITE_DESCRIPTION =
    "Electrical engineering at Purdue, applied AI at Astera Labs. GPU kernels, ML systems, and the hardware underneath.";
/** The one line under the name on the site's share card. */
export const SITE_TAGLINE = "GPU kernels, ML systems, and the hardware underneath.";
/** The host as shown in the corner of share cards. */
export const SITE_HOST = new URL(SITE_URL).host;

export const AUTHOR = {
    name: "Robert Zhang",
    email: "robertzhang930@gmail.com",
    github: "https://github.com/zhan4808",
    x: "https://x.com/robdobflob",
    xHandle: "@robdobflob",
    linkedin: "https://linkedin.com/in/robert05",
    instagram: "https://instagram.com/robert.zhang_",
} as const;

/** A site-relative path as a full URL, for places that cannot resolve against `metadataBase` (feeds, sitemaps, JSON-LD). */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();

const MONTHS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

/**
 * Dates in the content are written for people: "2026", "October 2025", or "January 21, 2026". This reads them as UTC
 * midnight on the first day they could mean, or undefined when the string is in some other shape.
 */
export function parseContentDate(value: string): Date | undefined {
    const match = /^(?:([A-Za-z]+)\s+)?(?:(\d{1,2}),\s+)?(\d{4})$/.exec(value.trim());
    if (!match) return undefined;
    const [, monthName, day, year] = match;
    const month = monthName ? MONTHS.indexOf(monthName.toLowerCase()) : 0;
    if (month < 0) return undefined;
    if (day && !monthName) return undefined;
    const date = new Date(Date.UTC(Number(year), month, day ? Number(day) : 1));
    return Number.isNaN(date.getTime()) ? undefined : date;
}

/** An ISO date ("2026-03-04") written the way the content writes dates: "March 4, 2026". */
export function formatIsoDate(value: string): string {
    const [year, month, day] = value.split("-").map(Number);
    const name = MONTHS[month - 1];
    return `${name[0].toUpperCase()}${name.slice(1)} ${day}, ${year}`;
}
