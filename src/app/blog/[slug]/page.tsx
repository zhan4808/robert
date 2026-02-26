import type { Metadata } from "next";
import { AudioPlayer } from "@/components/audio-player";
import { ContentBlocks } from "@/components/content-blocks";
import { Navigation } from "@/components/navigation";
import { journalPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return journalPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto mt-8 mb-16 flex max-w-[652px] flex-col gap-8 px-6 md:mt-16">
      <Navigation />

      <article className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm w-fit flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            back to journal
          </Link>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium lowercase">{post.month}</h1>
            <p className="text-muted-foreground">{post.subtitle}</p>
            <time className="text-muted-foreground text-sm">{post.date}</time>
          </div>
        </header>

        {/* Audio Player */}
        {post.tracks.length > 0 && <AudioPlayer tracks={post.tracks} />}

        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={`${post.month} cover`}
            className="w-full rounded-lg"
          />
        )}

        {/* Content */}
        <ContentBlocks blocks={post.blocks} />

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Back to journal
          </Link>
        </footer>
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPosts.find((entry) => entry.slug === slug);
  return {
    title: post ? post.month : "blog",
  };
}
