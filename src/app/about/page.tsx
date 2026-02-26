import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { aboutLinks } from "@/lib/data";

const aboutImages = [
  { cover: "/robert1.svg", caption: "/Murmure2.svg" },
  { cover: "/sf1.svg", caption: "/Murmure7.svg" },
  { cover: "/tahoe1.svg", caption: "/Murmure5.svg" },
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

        <section className="grid gap-6 md:grid-cols-3">
          {aboutImages.map((image) => (
            <div key={image.cover} className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <img src={image.cover} alt="About cover" className="w-full" />
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <img src={image.caption} alt="About caption" className="w-full" />
              </div>
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
                className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <img src={link.icon} alt="" className="h-4 w-4" />
                  {link.name}
                </span>
                <span className="text-xs">-&gt;</span>
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
