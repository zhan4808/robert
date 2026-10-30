import type { MetadataRoute } from "next";
import { getVisiblePosts } from "../lib/content";
import { absoluteUrl, parseContentDate } from "../lib/site";
import { hasPage, projects } from "./data/projects";

/** Every public page. Hidden projects and posts stay out, as do projects that link out instead of having a page. */
export default function sitemap(): MetadataRoute.Sitemap {
    const buildTime = new Date();
    const dateOf = (written: string): Date => parseContentDate(written) ?? buildTime;
    const newest = (dates: Date[]): Date =>
        dates.length ? dates.reduce((latest, date) => (date > latest ? date : latest)) : buildTime;

    const projectPages = projects.filter(hasPage);
    const posts = getVisiblePosts();

    return [
        { url: absoluteUrl("/"), lastModified: buildTime, changeFrequency: "monthly", priority: 1 },
        {
            url: absoluteUrl("/projects"),
            lastModified: newest(projectPages.map((p) => dateOf(p.date))),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...projectPages.map((p) => ({
            url: absoluteUrl(`/projects/${p.slug}`),
            lastModified: dateOf(p.date),
            changeFrequency: "yearly" as const,
            priority: 0.7,
        })),
        {
            url: absoluteUrl("/blog"),
            lastModified: newest(posts.map((post) => dateOf(post.date))),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...posts.map((post) => ({
            url: absoluteUrl(`/blog/${post.slug}`),
            lastModified: dateOf(post.date),
            changeFrequency: "yearly" as const,
            priority: 0.6,
        })),
        { url: absoluteUrl("/gallery"), lastModified: buildTime, changeFrequency: "monthly", priority: 0.5 },
        { url: absoluteUrl("/archive"), lastModified: buildTime, changeFrequency: "yearly", priority: 0.4 },
    ];
}
