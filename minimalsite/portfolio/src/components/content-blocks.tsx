import type { ContentBlock } from "@/lib/data";

interface ContentBlocksProps {
  blocks: ContentBlock[];
}

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
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
              <img src={block.src} alt={block.alt} className="w-full rounded-lg" />
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

        return null;
      })}
    </div>
  );
}
