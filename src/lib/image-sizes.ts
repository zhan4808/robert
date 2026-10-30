// Shared by server and client components; kept apart from images.ts so the manifest never enters a client bundle.

/** Write-ups sit in a 56rem frame; below the breakpoint an image spans the viewport. */
export const CONTENT_IMAGE_SIZES = "(min-width: 1024px) 56rem, 100vw";
/** Next re-encodes at 75 by default, which smears the small text in plots and diagrams. */
export const CONTENT_IMAGE_QUALITY = 90;
