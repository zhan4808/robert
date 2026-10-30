/** The write-up's type and hairlines, shared by every MDX component so they read as one page. */

export const BODY = "text-[16px] leading-[1.7] [text-wrap:pretty]";
export const PROSE = "text-[color-mix(in_srgb,var(--foreground-color)_72%,transparent)]";
export const MUTED = "text-[var(--muted-color)]";
export const HAIRLINE = "border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]";
export const PANEL = `rounded-[6px] border ${HAIRLINE}`;
