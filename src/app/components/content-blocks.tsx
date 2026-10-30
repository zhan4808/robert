import type { ContentBlock } from "../../lib/data";
import { codeToHtml } from "shiki";
import katex from "katex";
import { ImageLightbox } from "./image-lightbox";

const BODY = "text-[16px] leading-[1.7] [text-wrap:pretty]";
const PROSE = "text-[color-mix(in_srgb,var(--foreground-color)_72%,transparent)]";
const MUTED = "text-[var(--muted-color)]";
const HAIRLINE = "border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]";
const PANEL = `rounded-[6px] border ${HAIRLINE}`;

interface ContentBlocksProps {
    blocks: ContentBlock[];
}

/** The write-up's blocks in order. Runs on the server: code highlighting and math render to HTML here. */
export async function ContentBlocks({ blocks }: ContentBlocksProps) {
    const rendered = await Promise.all(
        blocks.map(async (block, index) => {
            if (block.type === "paragraph") {
                return (
                    <p key={index} className={`${BODY} ${PROSE}`}>
                        {block.text}
                    </p>
                );
            }

            if (block.type === "quote") {
                return (
                    <blockquote key={index} className={`border-l ${HAIRLINE} pl-5`}>
                        <p className={`${BODY} ${PROSE} italic`}>&ldquo;{block.text}&rdquo;</p>
                        {block.author && (
                            <cite className={`mt-2 block font-geistMono text-[12px] not-italic ${MUTED}`}>
                                — {block.author}
                            </cite>
                        )}
                    </blockquote>
                );
            }

            if (block.type === "gradient") {
                return <div key={index} className={`h-32 w-full rounded-[6px] bg-gradient-to-br ${block.className}`} />;
            }

            if (block.type === "image") {
                return (
                    <ImageLightbox
                        key={index}
                        src={block.src}
                        alt={block.alt}
                        caption={block.caption}
                        className={block.invert ? "invert" : undefined}
                    />
                );
            }

            if (block.type === "gallery") {
                return (
                    <div key={index} className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {block.images.map((image, imageIndex) => (
                            <ImageLightbox key={imageIndex} src={image.src} alt={image.alt} caption={image.caption} />
                        ))}
                    </div>
                );
            }

            if (block.type === "video") {
                return (
                    <figure key={index} className="flex flex-col gap-2">
                        <video src={block.src} controls playsInline className="w-full rounded-[6px] bg-black" />
                        {block.caption && (
                            <figcaption className={`font-geistMono text-[12px] ${MUTED}`}>{block.caption}</figcaption>
                        )}
                    </figure>
                );
            }

            if (block.type === "list") {
                return (
                    <ul key={index} className={`list-disc space-y-1.5 pl-5 ${BODY} ${PROSE}`}>
                        {block.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                        ))}
                    </ul>
                );
            }

            if (block.type === "link") {
                return (
                    <div key={index} className="flex flex-col gap-0.5">
                        <a
                            href={block.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ink-link w-fit text-[15px]"
                        >
                            {block.label}
                        </a>
                        {block.description && <p className={`text-[14px] ${MUTED}`}>{block.description}</p>}
                    </div>
                );
            }

            if (block.type === "code") {
                return (
                    <pre
                        key={index}
                        data-scrolls
                        className={`${PANEL} overflow-x-auto px-4 py-3 font-geistMono text-[13px] leading-[1.6] ${PROSE}`}
                    >
                        <code>{block.code}</code>
                    </pre>
                );
            }

            if (block.type === "heading") {
                if (block.level === 2) {
                    return (
                        <h2 key={index} className="mt-6 text-[16px] font-medium leading-[1.6]">
                            {block.text}
                        </h2>
                    );
                }
                return (
                    <h3 key={index} className={`mt-3 text-[15px] font-medium leading-[1.6] ${MUTED}`}>
                        {block.text}
                    </h3>
                );
            }

            if (block.type === "code-highlighted") {
                // Both themes are rendered; globals.css picks one by the theme class on <html>.
                const html = await codeToHtml(block.code, {
                    lang: block.language,
                    themes: { light: "github-light", dark: "github-dark" },
                    defaultColor: false,
                });
                return (
                    <div
                        key={index}
                        data-scrolls
                        className={`${PANEL} overflow-x-auto font-geistMono text-[13px] leading-[1.6] [&>pre]:!bg-transparent [&>pre]:p-4`}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                );
            }

            if (block.type === "math") {
                const mathHtml = katex.renderToString(block.latex, {
                    displayMode: block.display ?? false,
                    throwOnError: false,
                });
                if (block.display) {
                    return (
                        <div
                            key={index}
                            data-scrolls
                            className="my-2 overflow-x-auto text-center"
                            dangerouslySetInnerHTML={{ __html: mathHtml }}
                        />
                    );
                }
                return <span key={index} dangerouslySetInnerHTML={{ __html: mathHtml }} />;
            }

            if (block.type === "visualization") {
                return (
                    <section key={index} className={`${PANEL} flex flex-col gap-3 p-4`}>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-medium">{block.title}</h3>
                            <p className={`text-[14px] ${MUTED}`}>{block.caption}</p>
                        </div>
                        {block.media &&
                            (block.media.type === "video" ? (
                                <video src={block.media.src} controls playsInline className="w-full rounded-[4px]" />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element -- sizes vary per figure
                                <img src={block.media.src} alt={block.media.alt} className="w-full rounded-[4px]" />
                            ))}
                    </section>
                );
            }

            if (block.type === "table") {
                return (
                    <div key={index} data-scrolls className="overflow-x-auto">
                        <table className="w-full border-collapse text-[14px]">
                            <thead>
                                <tr className={`border-b ${HAIRLINE}`}>
                                    {block.headers.map((h, i) => (
                                        <th
                                            key={i}
                                            className="whitespace-nowrap py-2 pr-4 text-left font-geistMono text-[12px] font-medium"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {block.rows.map((row, ri) => (
                                    <tr key={ri} className={`border-b ${HAIRLINE}`}>
                                        {row.map((cell, ci) => (
                                            <td key={ci} className={`whitespace-nowrap py-2 pr-4 ${PROSE}`}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }

            return null;
        })
    );

    return <div className="flex flex-col gap-5">{rendered}</div>;
}
