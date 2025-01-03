'use client';

import { motion } from 'framer-motion';

export default function BlogPage() {
  return (
    <motion.div
      className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-4 text-3xl font-semibold">Blog</h1>
      <p className="mb-2 text-center text-lg text-gray-600">
        Welcome to my blog. I write about tech, design, and more.
      </p>
      <p className="text-center text-sm text-gray-400">
        *No posts yet. Stay tuned!*
      </p>
    </motion.div>
  );
}