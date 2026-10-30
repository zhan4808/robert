/**
 * Share cards and icons drawn with next/og, in the site's own type and colours: a dark card, a small mono label, the
 * title in Geist Sans, nothing else.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OG_IMAGE_SIZE } from "./metadata";
import { SITE_HOST, SITE_NAME, SITE_TAGLINE } from "./site";

export const OG_SIZE = { width: OG_IMAGE_SIZE.width, height: OG_IMAGE_SIZE.height };
export const OG_CONTENT_TYPE = "image/png";

const BACKGROUND = "#1a1917";
const FOREGROUND = "#fff7f0";
/** The foreground at the opacities the site uses for secondary text and hairlines. */
const MUTED = "rgba(255, 247, 240, 0.55)";
const HAIRLINE = "rgba(255, 247, 240, 0.12)";

type ImageOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;
type Fonts = NonNullable<ImageOptions["fonts"]>;

/**
 * Satori reads TTF/OTF, not woff2, so the vendored Geist files sit next to their woff2 originals as TTF. Resolved
 * from the project root: these routes run on Node and are prerendered at build time.
 */
const FONT_DIR = join(process.cwd(), "src", "app", "fonts");

async function loadFonts(): Promise<Fonts> {
    const [sans, sansMedium, mono] = await Promise.all(
        ["geist-sans-latin-400-normal.ttf", "geist-sans-latin-500-normal.ttf", "geist-mono-latin-400-normal.ttf"].map(
            (file) => readFile(join(FONT_DIR, file))
        )
    );
    return [
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: sansMedium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
    ];
}

/** Long titles step down in size so they still fit in three lines. */
function titleSize(title: string): number {
    if (title.length <= 24) return 88;
    if (title.length <= 48) return 72;
    if (title.length <= 80) return 58;
    return 48;
}

/** Cuts a description to roughly one or two lines on the card, at a word boundary. */
function clip(text: string, max = 150): string {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const atWord = cut.lastIndexOf(" ");
    return `${cut.slice(0, atWord > max / 2 ? atWord : max).replace(/[,;:.\s]+$/, "")}…`;
}

type CardProps = {
    /** Small mono line at the top, e.g. "projects / 2026". */
    label: string;
    title: string;
    /** Secondary line under the title. */
    line?: string;
    /** The two mono corners along the bottom. */
    footer: [string, string];
};

function Card({ label, title, line, footer }: CardProps) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "64px 80px 56px",
                backgroundColor: BACKGROUND,
                color: FOREGROUND,
                fontFamily: "Geist",
            }}
        >
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 26, color: MUTED }}>{label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 1040 }}>
                <div
                    style={{
                        display: "flex",
                        fontSize: titleSize(title),
                        fontWeight: 500,
                        lineHeight: 1.12,
                        letterSpacing: -1.5,
                    }}
                >
                    {title}
                </div>
                {line && (
                    <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: MUTED }}>{clip(line)}</div>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${HAIRLINE}`,
                    paddingTop: 28,
                    fontFamily: "Geist Mono",
                    fontSize: 24,
                    color: MUTED,
                }}
            >
                <span>{footer[0]}</span>
                <span>{footer[1]}</span>
            </div>
        </div>
    );
}

async function render(card: CardProps): Promise<ImageResponse> {
    return new ImageResponse(<Card {...card} />, { ...OG_SIZE, fonts: await loadFonts() });
}

/** The site-wide card: name and one line. */
export function siteCard(): Promise<ImageResponse> {
    return render({
        label: SITE_HOST,
        title: SITE_NAME,
        line: SITE_TAGLINE,
        footer: ["electrical engineering @ purdue", "applied ai @ astera labs"],
    });
}

/** A card for one project or post: "section / when" above the title, the site in the corners. */
export function articleCard({
    section,
    when,
    title,
    line,
}: {
    section: string;
    when: string;
    title: string;
    line?: string;
}) {
    return render({
        label: `${section} / ${when.toLowerCase()}`,
        title,
        line,
        footer: [SITE_NAME.toLowerCase(), SITE_HOST],
    });
}

/** A lowercase "r" on the site's dark background, for the favicon and the home-screen icon. */
export async function monogram(size: number, radius = 0): Promise<ImageResponse> {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: BACKGROUND,
                color: FOREGROUND,
                borderRadius: radius,
                fontFamily: "Geist",
                fontWeight: 500,
                fontSize: size * 0.85,
                lineHeight: 1,
                // Sits the x-height letter at the optical centre instead of the box's.
                paddingBottom: size * 0.06,
            }}
        >
            r
        </div>,
        { width: size, height: size, fonts: await loadFonts() }
    );
}
