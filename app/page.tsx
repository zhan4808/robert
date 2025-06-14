'use client';

import GradientBackground from './components/GradientBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeContext';

export default function HomePage() {
  // Separate hover states for experiences and projects
  const [hoveredExperienceIndex, setHoveredExperienceIndex] = useState<number | null>(null);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);

  const { darkMode } = useTheme();

  const projects = [
    {
      title: 'Triton GEMM Kernel for Small Batch Transformer Inference on Low Resource Hardware',
      description: 'Open-source GEMM kernel for small batch transformer inference workloads with improved latency and throughput for low resource accelerated inference. Identifying efficient quantization algorithms in Triton.',
      image: '/Qyyy.gif',
      mediaType: 'gif',
      link: 'https://github.com/zhan4808/gemmopt',
    },
    {
      title: 'VeriGen: Agents for Accelerated Chip Design',
      description: 'Integrated RTL design verification tool for testbench generation, script and trace analysis with multi-agent collaboration for accelerated RTL development.',
      image: '/QwQ1.gif',
      mediaType: 'gif',
      link: '/projects/verigen',
    },
    {
      title: 'ArtSage',
      description: 'Interactive AI museum exploration tool with image recognition and RAG workflows to identify art, retrieve museum data, and answer user prompts for enriched museum experience. Expanding with agentic features and AR.',
      image: '/QwQ1.gif',
      mediaType: 'gif',
      link: '/projects/artsage',
    },
    {
      title: 'OmNom | TreeHacks 2025 Most Creative Hack Grand Prize',
      description: 'An autonomous end-to-end 6-foot tall autonomous food delivery robot that navigates novel outdoor and indoor campus environments, interacts with ordering iPads, fetches and delives late-night food, allowing students to focus on their work while satisfying their cravings.',
      image: '/murmure6.mp4',
      mediaType: 'video',
      link: 'https://devpost.com/software/omnom-hg16v3',
    },
    {
      title: 'slynk: Turning Ads into Experiences',
      description: 'Reimagining ads with interactive AR avatars. meet and talk with your favorite celebrities with sylnk, our AR app offering a new personalized immersive experience for discovering advertisements.',
      image: '/murmure3.gif',
      mediaType: 'gif',
      link: 'https://devpost.com/software/slynk',
    },
    {
      title: 'Using an Ensemble of GANs and CNNs to More Accurately Generate and Diagnose Skin Condition Datasets in Diverse Skin Types',
      description: 'Generated and validated synthetic images to address ethical AI bias due to lack of diverse skin condition images.',
      image: '/Murmure7.svg',
      mediaType: 'image',
      link: '/projects/open-source',
    },
  ];

  const experiences = [
    {
      title: 'Advanced Memory Intern',
      company: 'SanDisk',
      logo: '/sandisk.svg',
      period: 'Jan 2025 - May 2025',
    },
    {
      title: 'ASIC Design Flow Researcher',
      company: 'SoCET Lab',
      logo: '/socetlogo.svg',
      period: '2023 - ',
    },
    {
      title: 'Chip Design Intern',
      company: 'STARS @Purdue',
      logo: '/purduelogo.svg',
      period: 'Summer 2024',
    },
    {
      title: 'Student Researcher',
      company: 'Stanford Cornfield Lab',
      logo: '/stanfordlogo.svg',
      period: '2022 - 2022',
    },
    {
      title: 'Research Intern',
      company: 'IBM Almaden',
      logo: '/ibmlogo.svg',
      period: '2021 - 2021',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Gradient Background with Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <GradientBackground />
        <motion.div
          className="absolute z-10 text-left px-4 max-w-[50%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Hey, Robert here!
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            I&apos;m an electrical engineer and computer scientist from the Bay
            Area building for the future of AI-driven hardware and software
            optimizations. On the side, I create videos about tech and
            productivity and projects for learning.
          </p>

          {/* Social Buttons */}
          <div className="flex space-x-4 mt-4">
            {[
              { name: 'GitHub', url: 'https://github.com/zhan4808' },
              { name: 'LinkedIn', url: 'https://linkedin.com/in/robert05' },
              { name: 'X', url: 'https://x.com/robdobflob' },
            ].map((button) => (
              <Link
                key={button.name}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {button.name}
                <img
                  src={`/diagarrow-${darkMode ? 'light' : 'dark'}.svg`}
                  alt={`${button.name} Arrow Icon`}
                  className="ml-2 w-4 h-4"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Experience Section */}
      <div className="bg-white dark:bg-black py-12">
        <div className="max-w-[52%] mx-auto px-4">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Experience
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            I specialize in RTL, ASIC design, transformers, compilers,
            and product design. But I am always learning new things. Here
            are some of the places I have worked.
          </p>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.title}
                className={`flex items-center justify-between p-4 rounded-md transition-opacity ${
                  hoveredExperienceIndex === null ||
                  hoveredExperienceIndex === index
                    ? 'opacity-100'
                    : 'opacity-50'
                }`}
                onMouseEnter={() => setHoveredExperienceIndex(index)}
                onMouseLeave={() => setHoveredExperienceIndex(null)}
              >
                <div className="flex items-center">
                  {/* Logo */}
                  <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={experience.logo}
                      alt={`${experience.company} Logo`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Title and Company */}
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {experience.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {experience.company}
                    </p>
                  </div>
                </div>
                {/* Time Period */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {experience.period}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white dark:bg-black py-12">
        <div className="max-w-[52%] mx-auto px-4">
          <h2 className="text-4xl font-bold text-left text-black dark:text-white mb-8">
            Projects
          </h2>
          <div className="space-y-12">
            {projects.map((project, index) => {
              const reverse = index % 2 !== 0;
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
                  onMouseEnter={() => setHoveredProjectIndex(index)}
                  onMouseLeave={() => setHoveredProjectIndex(null)}
                >
                  {/* Project Media */}
                  <Link
                    href={project.link}
                    className={`relative group w-full md:w-[40%] mx-auto cursor-pointer ${
                      hoveredProjectIndex !== null &&
                      hoveredProjectIndex !== index
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
                      <p className="text-white text-lg font-light flex items-center">
                        Check it Out
                        <img
                          src="/diagarrow.svg"
                          alt="Arrow"
                          className="ml-2 w-6 h-6"
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
    </div>
  );
}