import type { Metadata } from "next";
import { ContentBlocks } from "@/components/content-blocks";
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
    <div className="mx-auto mt-10 mb-24 flex max-w-[680px] flex-col gap-8 px-6 md:mt-16">
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <Link
            href="/"
            className="inline-link text-[hsl(var(--muted-foreground))] text-sm w-fit"
          >
            Robert Zhang
          </Link>

          <h1 className="text-sm font-bold mt-2">{post.month}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {post.subtitle}
          </p>
          <time className="text-xs text-[hsl(var(--muted-foreground))]">
            {post.date}
          </time>
        </header>

        <ContentBlocks blocks={post.blocks} />

        <footer className="mt-8 pt-6 border-t border-[hsl(var(--border))]">
          <Link
            href="/"
            className="inline-link text-sm text-[hsl(var(--muted-foreground))]"
          >
            ← Back
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
