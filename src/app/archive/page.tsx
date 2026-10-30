import Image from "next/image";
import Cursor from "../components/cursor";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import { imageMeta } from "../../lib/images";
import { CONTENT_IMAGE_SIZES } from "../../lib/image-sizes";
import { ERAS, eraLink, shots, type Era } from "./eras";

const MUTED = "text-muted";
const UNDERLINE =
    "underline decoration-faint decoration-1 underline-offset-[5px] focus-ring transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

/** Every design this site has had, newest first, each photographed from the commit it was checked out at. */
export default function Archive() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
            <main
                id="main"
                tabIndex={-1}
                className="mx-auto flex w-full max-w-column flex-col gap-14 px-6 pb-40 pt-28 outline-none lg:gap-20 lg:pt-40"
            >
                <header className="flex flex-col gap-4 font-geistMono">
                    <h1 className="sr-only">Archive</h1>
                    <p className="text-small lowercase leading-relaxed tracking-tagline opacity-60">
                        every version of this site.
                        <Cursor />
                    </p>
                    <p className={`max-w-[32rem] font-geistSans text-body leading-compact [text-wrap:pretty] ${MUTED}`}>
                        Five designs since 2023. Each one was checked out from its commit, run again, and photographed
                        at 1440 and 375 wide.
                    </p>
                </header>

                <section aria-label="Designs" className="flex flex-col gap-16 lg:gap-24">
                    {ERAS.map((era) => (
                        <EraSection key={era.id} era={era} />
                    ))}
                </section>
            </main>
        </div>
    );
}

function EraSection({ era }: { era: Era }) {
    const link = eraLink(era);
    const src = shots(era);
    const version = era.id.toUpperCase();
    return (
        <article aria-labelledby={`era-${era.id}`} className="flex flex-col gap-6 border-t border-hairline pt-6">
            <header className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-6 font-geistMono text-caption tabular-nums">
                    <h2 id={`era-${era.id}`} className="lowercase">
                        {era.id} <span className="opacity-40">·</span> <span className={MUTED}>{era.span}</span>
                    </h2>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${UNDERLINE} shrink-0 lowercase opacity-60 hover:opacity-100 focus-visible:opacity-100`}
                    >
                        {link.label} ↗
                    </a>
                </div>
                <p className="font-geistSans text-body leading-compact [text-wrap:pretty]">{era.description}</p>
                <p className={`font-geistMono text-caption ${MUTED}`}>{era.stack}</p>
            </header>

            <div className="flex flex-col gap-3">
                <Shot
                    src={src.home}
                    alt={`${version}: the home page at 1440 wide`}
                    sizes={CONTENT_IMAGE_SIZES}
                    preload={era === ERAS[0]}
                />
                {/* The two smaller shots share a row, their flex weights set by their aspect ratios so they come
                    out the same height. */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Shot
                        src={src.inner}
                        alt={`${version}: ${era.inner} at 1440 wide`}
                        sizes="(min-width: 1024px) 43rem, 77vw"
                        className="sm:flex-[1600_1_0]"
                    />
                    <Shot
                        src={src.mobile}
                        alt={`${version}: the home page at 375 wide`}
                        sizes="(min-width: 1024px) 13rem, 23vw"
                        className="max-sm:max-w-[14rem] sm:flex-[462_1_0]"
                    />
                </div>
            </div>
        </article>
    );
}

/** One screenshot, sized and blurred from the manifest, in a hairline frame so a white page reads on the dark theme. */
function Shot({
    src,
    alt,
    sizes,
    preload = false,
    className = "",
}: {
    src: string;
    alt: string;
    sizes: string;
    preload?: boolean;
    className?: string;
}) {
    const meta = imageMeta(src);
    return (
        <figure className={`min-w-0 overflow-hidden rounded-card border border-hairline ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={meta?.width ?? 2160}
                height={meta?.height ?? 1350}
                placeholder={meta ? "blur" : "empty"}
                blurDataURL={meta?.blurDataURL}
                preload={preload}
                sizes={sizes}
                className="block h-auto w-full"
            />
        </figure>
    );
}
