'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { projects } from './projectsData';

export default function ProjectsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-black py-12 min-h-screen">
      <div className="max-w-[50%] mx-auto px-4">
        <h1 className="mt-12 text-2xl font-bold text-black dark:text-white">
          Projects
        </h1>
        <p className="mt-0 mb-8 text-sm text-gray-600 dark:text-gray-400">
          what i've been building
        </p>
        <div className="space-y-12">
          {projects.map((project, index) => {
            const reverse = index % 2 !== 0;
            const href = project.external
              ? project.link
              : `/projects/${project.slug}`;
            return (
              <motion.div
                key={project.title}
                className={`flex flex-col md:flex-row ${
                  reverse ? 'md:flex-row-reverse' : ''
                } items-center`}
                initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Project Media */}
                <Link
                  href={href as string}
                  target={project.external ? '_blank' : undefined}
                  rel={project.external ? 'noopener noreferrer' : undefined}
                  className={`relative group w-full md:w-[40%] mx-auto cursor-pointer ${
                    hoveredIndex !== null && hoveredIndex !== index
                      ? 'opacity-50'
                      : 'opacity-100'
                  } transition-opacity`}
                  style={{ aspectRatio: '16/9' }}
                >
                  {project.mediaType === 'video' ? (
                    <video
                      src={project.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full rounded-lg shadow-lg group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full rounded-lg shadow-lg group-hover:opacity-80 transition-opacity"
                    />
                  )}
                  {/* Hover Text */}
                  <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-lg font-semibold flex items-center">
                      Check it Out{' '}
                      <img
                        src="/diagarrow.svg"
                        alt="Arrow Icon"
                        className="ml-2 w-4 h-4"
                      />
                    </p>
                  </div>
                </Link>

                {/* Project Title and Description */}
                <div
                  className={`w-full md:w-[40%] mx-auto ${
                    reverse ? 'text-right md:mr-auto' : 'text-left md:ml-auto'
                  }`}
                >
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}