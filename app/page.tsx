'use client';

import GradientBackground from './components/GradientBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const projects = [
    {
      title: 'AI Hardware Optimizer',
      description: 'A tool for optimizing AI hardware performance.',
      image: '/projects/ai-hardware.png',
      link: '/projects/ai-hardware',
    },
    {
      title: 'Generative Design Platform',
      description: 'A platform for generative design in AI-driven EDA.',
      image: '/projects/generative-design.png',
      link: '/projects/generative-design',
    },
    {
      title: 'Productivity Dashboard',
      description: 'A custom dashboard for managing tasks and workflows.',
      image: '/projects/productivity-dashboard.png',
      link: '/projects/productivity-dashboard',
    },
    {
      title: 'Tech Vlog Series',
      description: 'A video series exploring tech trends and insights.',
      image: '/projects/tech-vlog.png',
      link: '/projects/tech-vlog',
    },
    {
      title: 'Open Source Contributions',
      description: 'Contributions to popular open-source tech projects.',
      image: '/projects/open-source.png',
      link: '/projects/open-source',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Gradient Background with Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <GradientBackground />
          <motion.div
            className="absolute z-10 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Hey, Robert here!
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            I&apos;m an electrical engineer and computer scientist from the Bay Area
            building for the future of AI-driven hardware and software optimizations.
            On the side, I create videos about tech and productivity and projects for
            learning.
          </p>
          </motion.div>
    </div>

      {/* Projects Section */}
      <div className="bg-white dark:bg-black py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-8">
            Projects
          </h2>
          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                } items-center`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Project Image */}
                <Link
                  href={project.link}
                  className="relative group w-full md:w-1/2 cursor-pointer"
                  style={{ aspectRatio: '16/9' }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full rounded-lg shadow-lg group-hover:opacity-80 transition-opacity"
                  />
                  {/* Title and Description */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white p-4 rounded-lg">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="mt-2 text-sm">{project.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}