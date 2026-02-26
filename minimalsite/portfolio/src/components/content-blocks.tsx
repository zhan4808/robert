import type { ContentBlock } from "@/lib/data";
import { codeToHtml } from "shiki";
import katex from "katex";

interface ContentBlocksProps {
  blocks: ContentBlock[];
}

export async function ContentBlocks({ blocks }: ContentBlocksProps) {
  const rendered = await Promise.all(
    blocks.map(async (block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} className="text-muted-foreground leading-relaxed">
            {block.text}
          </p>
        );
      }

      if (block.type === "quote") {
        return (
          <blockquote key={index} className="border-l-2 border-[hsl(var(--link))] pl-6 py-2">
            <p className="text-[hsl(var(--link))] italic leading-relaxed">
              "{block.text}"
            </p>
            {block.author && (
              <cite className="text-muted-foreground text-sm mt-2 block">
                -- {block.author}
              </cite>
            )}
          </blockquote>
        );
      }

      if (block.type === "gradient") {
        return (
          <div
            key={index}
            className={`w-full h-40 md:h-56 rounded-lg bg-gradient-to-br ${block.className}`}
          />
        );
      }

      if (block.type === "image") {
        return (
          <figure key={index} className="flex flex-col gap-2">
            <img
              src={block.src}
              alt={block.alt}
              className={`w-full rounded-lg${block.invert ? " invert hue-rotate-180" : ""}`}
            />
            {block.caption && (
              <figcaption className="text-xs text-muted-foreground">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }

      if (block.type === "gallery") {
        return (
          <div key={index} className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {block.images.map((image, imageIndex) => (
              <figure key={imageIndex} className="flex flex-col gap-2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full rounded-lg object-cover"
                />
                {image.caption && (
                  <figcaption className="text-xs text-muted-foreground">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        );
      }

      if (block.type === "video") {
        return (
          <figure key={index} className="flex flex-col gap-2">
            <video
              src={block.src}
              controls
              playsInline
              className="w-full rounded-lg"
            />
            {block.caption && (
              <figcaption className="text-xs text-muted-foreground">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }

      if (block.type === "list") {
        return (
          <ul key={index} className="list-disc pl-5 text-muted-foreground space-y-2">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
      }

      if (block.type === "link") {
        return (
          <div key={index} className="flex flex-col gap-1">
            <a
              href={block.href}
              target="_blank"
              rel="noopener noreferrer"
              className="connect-link w-fit"
            >
              {block.label}
            </a>
            {block.description && (
              <p className="text-xs text-muted-foreground">{block.description}</p>
            )}
          </div>
        );
      }

      if (block.type === "code") {
        return (
          <pre
            key={index}
            className="rounded-lg border border-border bg-muted px-4 py-3 text-xs text-muted-foreground overflow-x-auto"
          >
            <code>{block.code}</code>
          </pre>
        );
      }

      if (block.type === "heading") {
        if (block.level === 2) {
          return (
            <h2 key={index} className="text-lg font-medium mt-2">
              {block.text}
            </h2>
          );
        }
        return (
          <h3 key={index} className="text-base font-medium mt-1 text-muted-foreground">
            {block.text}
          </h3>
        );
      }

      if (block.type === "code-highlighted") {
        const html = await codeToHtml(block.code, {
          lang: block.language,
          theme: "github-dark",
        });
        return (
          <div
            key={index}
            className="rounded-lg border border-border overflow-x-auto text-xs [&>pre]:!bg-transparent [&>pre]:p-4"
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
          <section key={index} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium">{block.title}</h3>
                <p className="text-xs text-muted-foreground">{block.caption}</p>
              </div>
              {block.media && (
                <div className="rounded-md border border-border bg-muted p-3">
                  {block.media.type === "video" ? (
                    <video
                      src={block.media.src}
                      controls
                      playsInline
                      className="w-full rounded-md"
                    />
                  ) : (
                    <img
                      src={block.media.src}
                      alt={block.media.alt}
                      className="w-full rounded-md"
                    />
                  )}
                </div>
              )}
              <div className="rounded-md border border-dashed border-border bg-background px-3 py-2">
                <p className="text-xs text-muted-foreground">Diagram prompt</p>
                <p className="text-sm text-muted-foreground">{block.prompt}</p>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "table") {
        return (
          <div key={index} className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {block.headers.map((h, i) => (
                    <th key={i} className="py-2 pr-4 text-left text-xs font-medium text-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-border/50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 pr-4 text-xs text-muted-foreground whitespace-nowrap">
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

  return <div className="flex flex-col gap-6">{rendered}</div>;
}
