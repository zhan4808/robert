import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { aboutLinks } from "@/lib/data";

const aboutImages = [
  { src: "/robert1.svg", alt: "Robert" },
  { src: "/sf1.svg", alt: "San Francisco" },
  { src: "/tahoe1.svg", alt: "Lake Tahoe" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto mt-8 mb-16 flex max-w-[900px] flex-col gap-12 px-6 md:mt-16">
      <Navigation />

      <main className="flex flex-col gap-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">About</h1>
          <p className="text-muted-foreground">A glimpse into me.</p>
        </header>

        {/* Top row — 3 photos only */}
        <section className="grid gap-4 md:grid-cols-3">
          {aboutImages.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full transition-transform duration-500 ease-out hover:scale-[1.03]"
              />
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-[140px,1fr]">
          <h2 className="text-lg font-medium">Hello</h2>
          <div className="text-muted-foreground leading-relaxed">
            <p>
              Hey there, I'm Robert! Growing up in San Francisco and Palo Alto, I'm now
              based in San Jose.
            </p>
            <p className="mt-4">
              My curiosity for computers began at age 10, which naturally led me to
              pursue a career in tech. I study electrical engineering and computer
              science at Purdue University with interests in hardware-software codesign
              and optimization.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[140px,1fr]">
          <h2 className="text-lg font-medium">Connect</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {aboutLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <img src={link.icon} alt="" className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                  {link.name}
                </span>
                <span className="text-xs opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">→</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "about",
};
