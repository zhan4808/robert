import { getProjectBySlug } from '../projectsData';
import { notFound } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return notFound();

  return (
    <div className="bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4 text-center">{project.title}</h1>
        <div className="flex justify-center mb-6">
          {project.mediaType === 'video' ? (
            <video src={project.image} autoPlay loop muted playsInline className="rounded-lg shadow-lg w-full max-h-96 object-cover" />
          ) : (
            <img src={project.image} alt={project.title} className="rounded-lg shadow-lg w-full max-h-96 object-cover" />
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">{project.description}</p>
        {project.content && (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
} 