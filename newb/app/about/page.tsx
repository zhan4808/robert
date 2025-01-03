'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <motion.div
      className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-4 text-3xl font-semibold">About Me</h1>
      <p className="mb-2 text-center text-lg text-gray-600">
        I am a software developer, designer, and technology enthusiast. I love
        creating beautiful experiences using Next.js, Tailwind, and Framer
        Motion!
      </p>
    </motion.div>
  );
}