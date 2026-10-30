import manifest from "./image-meta.json";

/** What scripts/optimize-media.mjs records for every raster image under public/. */
export interface ImageMeta {
    width: number;
    height: number;
    /** A 10px WebP as a data URL, for <Image placeholder="blur">. */
    blurDataURL: string;
}

const images: Record<string, ImageMeta> = manifest;

/**
 * Size and blur placeholder for a file under public/, by its site path ("/cuda-mmm/split_k.webp"). Undefined for
 * SVGs, files the manifest predates (run `npm run media:optimize`), and anything that isn't a raster image.
 */
export function imageMeta(src: string): ImageMeta | undefined {
    return images[src];
}
