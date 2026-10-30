import Image from "next/image";
import { CONTENT_IMAGE_QUALITY, CONTENT_IMAGE_SIZES } from "../../../lib/image-sizes";
import { imageMeta } from "../../../lib/images";
import { MUTED, PANEL } from "./styles";

type Media = { type: "image" | "video"; src: string; alt: string };

interface VisualizationProps {
    title: string;
    /** The prompt or question the figure answers; kept with the content, not shown. */
    prompt: string;
    caption: string;
    media?: Media;
}

/** A titled, captioned panel with a figure in it. */
export function Visualization({ title, caption, media }: VisualizationProps) {
    return (
        <section className={`${PANEL} flex flex-col gap-3 p-4`}>
            <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-medium">{title}</h3>
                <p className={`text-[14px] ${MUTED}`}>{caption}</p>
            </div>
            {media && <VisualizationMedia media={media} />}
        </section>
    );
}

/** The panel's figure: a video as-is, or an image sized and blurred in from the manifest. */
function VisualizationMedia({ media }: { media: Media }) {
    if (media.type === "video") {
        return <video src={media.src} controls playsInline className="w-full rounded-[4px]" />;
    }
    const meta = imageMeta(media.src);
    if (!meta) {
        // eslint-disable-next-line @next/next/no-img-element -- no manifest entry (an SVG, or not yet optimized)
        return <img src={media.src} alt={media.alt} className="w-full rounded-[4px]" />;
    }
    return (
        <Image
            src={media.src}
            alt={media.alt}
            width={meta.width}
            height={meta.height}
            placeholder="blur"
            blurDataURL={meta.blurDataURL}
            sizes={CONTENT_IMAGE_SIZES}
            quality={CONTENT_IMAGE_QUALITY}
            unoptimized={media.src.endsWith(".gif")}
            className="h-auto w-full rounded-[4px]"
        />
    );
}
