'use client';

import GradientBackground from './components/GradientBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

export default function HomePage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { darkMode } = useTheme();

  const projects = [
    {
      title: 'Optimized Triton GEMM Kernel for Transformer Inference on Non-NVIDIA GPUs',
      description: 'GEMM kernel for efficient self-attention and feedforward mechanisms in LLMs. Targeting improvements in throughput, latency, and memory efficiency compared to cIBLAS.',
      image: '/Qyyy.gif',
      mediaType: 'gif',
      link: 'https://github.com/zhan4808/gemmopt',
    },
    {
      title: 'Darwin',
      description: 'A multimodal AI learning assistant that enhances online lecture learning and retention with personalized review and highlights.',
      image: '/QwQ1.gif',
      mediaType: 'gif',
      link: '/projects/generative-design',
      
    },
    {
      title: 'ROV Autonomous CV System',
      description: 'Dual-camera stereovision system for accurate depth estimation and 3D mapping, YOLOv5 integration for object detection and tracking.',
      image: '/murmure6.mp4',
      mediaType: 'video',
      link: '/projects/productivity-dashboard',
    },
    {
      title: 'HUGS: Haptic Under-Garment Support ',
      description: 'A Flexinol-contracting vest with custom PCB and smart app to deliver immediate DTP for anxiety/autism patients.',
      image: '/murmure3.gif',
      mediaType: 'gif',
      link: '/projects/tech-vlog',
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
              { name: 'Instagram', url: 'https://instagram.com/robert.zhang_' },
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
                  hoveredIndex === null || hoveredIndex === index
                    ? 'opacity-100'
                    : 'opacity-50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
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
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Project Media */}
                  <Link
                    href={project.link}
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
                      <p className="text-white text-lg font-light flex items-center">
                        Check it Out <img src="/diagarrow.svg" alt="Arrow" className="ml-2 w-6 h-6" />
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