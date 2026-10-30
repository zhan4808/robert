const WORDS_PER_MINUTE = 230;

/**
 * How long the write-up takes to read, in whole minutes, from the words in its MDX source. Code blocks, math blocks,
 * and the tags of components are left out; what remains is the running text, captions included.
 */
export function readingMinutes(body: string): number {
    const text = body
        .replace(/^```[\s\S]*?^```\s*$/gm, " ")
        .replace(/^\s*\$\$[\s\S]*?\$\$\s*$/gm, " ")
        .replace(/^(import|export)\s.*$/gm, " ")
        // Component tags, with their attributes: `<Figure src="..." caption="..." />` and `</Section>`.
        .replace(/<\/?[A-Z][^>]*>/g, " ");
    const words = text.match(/[^\s]+/g)?.length ?? 0;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
