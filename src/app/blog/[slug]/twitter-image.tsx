/** The same card as Open Graph; X reads its own tag. */
export { default, alt, size, contentType, generateStaticParams } from "./opengraph-image";

// Next reads segment config statically, so this one cannot be re-exported.
export const dynamicParams = false;
