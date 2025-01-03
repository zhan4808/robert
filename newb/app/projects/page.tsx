'use client';

import { motion } from 'framer-motion';

export default function ProjectsPage() {
  return (
    <motion.div
      className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-4 text-3xl font-semibold">Projects</h1>
      <p className="mb-2 text-lg text-gray-600 text-center">
        Here are some of my favorite projects:
      </p>
      <ul className="mt-4 list-disc space-y-2 text-gray-700">
        <li>Project A - A wonderful project about XYZ.</li>
        <li>Project B - A second project focusing on ABC.</li>
        <li>Project C - Another fun project tackling 123.</li>
      </ul>
    </motion.div>
  );
}