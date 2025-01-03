'use client';

import { motion } from 'framer-motion';
import GradientBackground from './components/GradientBackground';
import { LinkButton } from './components/LinkButton';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      {/* Our interactive gradient */}
      <GradientBackground />
      <div className="text-container z-10">
        <p>Robert Zhang</p>
      </div>

      {/* A simple fade-in container */}
      <LinkButton
        href="https://instagram.com/yourprofile"
        label="Instagram"
        iconSrc="/ffile.svg"
        arrowSrc="/fglobe.svg"
      />
      <motion.div
        className="z-10 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="mb-4 text-4xl font-bold">Welcome!</h1>
        <p className="mb-4 text-lg text-gray-600">
          This is my minimalist personal website.
        </p>
      </motion.div>
    </div>
  );
}