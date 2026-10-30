import Image from "next/image";
import type { JournalPost } from "../../lib/content-schema";
import type { ImageMeta } from "../../lib/images";

/** The fields of a post a thumbnail needs; the pager passes a plain object across to the client. */
export type CoverSource = Pick<JournalPost, "title" | "coverImage" | "coverGradient">;

/**
 * A post's small cover, 3:2: its photo (blurred in) when it has one, its gradient when it has only that, and the
 * first letter of its title set in mono on a quiet tile otherwise. The caller sets the size through `className`.
 */
export function PostCover({
    post,
    meta,
    sizes,
    className,
}: {
    post: CoverSource;
    /** Size and blur placeholder for the photo, from the manifest; looked up on the server. */
    meta?: ImageMeta;
    /** The rendered width, for the srcset. */
    sizes: string;
    className: string;
}) {
    const frame = `relative block aspect-[3/2] overflow-hidden rounded-chip bg-tile ${className}`;
    if (post.coverImage) {
        return (
            <span className={frame}>
                <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    placeholder={meta ? "blur" : "empty"}
                    blurDataURL={meta?.blurDataURL}
                    sizes={sizes}
                    className="object-cover"
                />
            </span>
        );
    }
    if (post.coverGradient) {
        return <span className={`${frame} bg-gradient-to-br ${post.coverGradient}`} />;
    }
    return (
        <span className={`${frame} flex items-end p-3 font-geistMono text-meta text-muted`}>
            {post.title.trim().charAt(0).toLowerCase()}
        </span>
    );
}
