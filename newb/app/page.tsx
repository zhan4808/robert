'use client';

import GradientBackground from './components/GradientBackground';
import { LinkButton } from './components/LinkButton';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-transparent text-black dark:text-white">
      {/* Interactive gradient */}
      <GradientBackground />

      {/* Main Content */}
      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="mb-4 text-6xl font-bold">Robert Zhang</h1>
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Welcome to my minimalist personal website.
        </p>

        {/* Instagram Button */}
        <LinkButton
          href="https://instagram.com/yourprofile"
          label="Instagram"
          iconSrc="/icons/instagram.svg" // Replace with actual path
          arrowSrc="/icons/arrow.svg"   // Replace with actual path
        />
      </motion.div>
    </div>
  );
}