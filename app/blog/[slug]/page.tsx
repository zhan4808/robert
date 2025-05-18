import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const postPath = path.join(process.cwd(), 'app/blog', `${params.slug}.md`);
  let content = '';
  let data: any = {};
  try {
    const file = fs.readFileSync(postPath, 'utf8');
    const parsed = matter(file);
    content = parsed.content;
    data = parsed.data;
  } catch {
    return notFound();
  }

  return (
    <div className={`min-h-screen py-16 px-4 bg-white dark:bg-gray-900 bg-gradient-to-br ${data.gradient || ''}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2 text-center">{data.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">{data.date}</div>
        <div className="prose dark:prose-invert max-w-none mx-auto">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 