import type { ContentBlock } from "@/lib/data";
import { codeToHtml } from "shiki";
import katex from "katex";
import { ImageLightbox } from "@/components/image-lightbox";

interface ContentBlocksProps {
  blocks: ContentBlock[];
}

export async function ContentBlocks({ blocks }: ContentBlocksProps) {
  const rendered = await Promise.all(
    blocks.map(async (block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} className="text-[hsl(var(--muted-foreground))] leading-relaxed text-sm">
            {block.text}
          </p>
        );
      }

      if (block.type === "quote") {
        return (
          <blockquote key={index} className="border-l-2 border-[hsl(var(--foreground))]/20 pl-4 py-1">
            <p className="text-[hsl(var(--muted-foreground))] italic leading-relaxed text-sm">
              &ldquo;{block.text}&rdquo;
            </p>
            {block.author && (
              <cite className="text-[hsl(var(--muted-foreground))] text-xs mt-2 block">
                — {block.author}
              </cite>
            )}
          </blockquote>
        );
      }

      if (block.type === "gradient") {
        return (
          <div
            key={index}
            className={`w-full h-32 bg-gradient-to-br ${block.className}`}
          />
        );
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
              <ImageLightbox
                key={imageIndex}
                src={image.src}
                alt={image.alt}
                caption={image.caption}
              />
            ))}
          </div>
        );
      }

      if (block.type === "video") {
        return (
          <figure key={index} className="flex flex-col gap-1.5">
            <video src={block.src} controls playsInline className="w-full" />
            {block.caption && (
              <figcaption className="text-xs text-[hsl(var(--muted-foreground))]">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }

      if (block.type === "list") {
        return (
          <ul key={index} className="list-disc pl-5 text-[hsl(var(--muted-foreground))] space-y-1.5 text-sm">
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
              className="inline-link w-fit text-sm"
            >
              {block.label}
            </a>
            {block.description && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {block.description}
              </p>
            )}
          </div>
        );
      }

      if (block.type === "code") {
        return (
          <pre
            key={index}
            className="border border-[hsl(var(--border))] px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] overflow-x-auto"
          >
            <code>{block.code}</code>
          </pre>
        );
      }

      if (block.type === "heading") {
        if (block.level === 2) {
          return (
            <h2 key={index} className="text-sm font-bold mt-3">
              {block.text}
            </h2>
          );
        }
        return (
          <h3 key={index} className="text-sm font-medium mt-2 text-[hsl(var(--muted-foreground))]">
            {block.text}
          </h3>
        );
      }

      if (block.type === "code-highlighted") {
        const html = await codeToHtml(block.code, {
          lang: block.language,
          theme: "github-light",
        });
        return (
          <div
            key={index}
            className="border border-[hsl(var(--border))] overflow-x-auto text-xs [&>pre]:!bg-transparent [&>pre]:p-4"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is trusted
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
              className="text-center my-2 overflow-x-auto"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: katex output is trusted
              dangerouslySetInnerHTML={{ __html: mathHtml }}
            />
          );
        }
        return (
          <span
            key={index}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: katex output is trusted
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      }

      if (block.type === "visualization") {
        return (
          <section key={index} className="border border-[hsl(var(--border))] p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold">{block.title}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {block.caption}
                </p>
              </div>
              {block.media && (
                <div className="border border-[hsl(var(--border))] p-2">
                  {block.media.type === "video" ? (
                    <video src={block.media.src} controls playsInline className="w-full" />
                  ) : (
                    <img src={block.media.src} alt={block.media.alt} className="w-full" />
                  )}
                </div>
              )}
            </div>
          </section>
        );
      }

      if (block.type === "table") {
        return (
          <div key={index} className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  {block.headers.map((h, i) => (
                    <th key={i} className="py-2 pr-4 text-left text-xs font-bold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[hsl(var(--border))]/50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 pr-4 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
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
