'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface LinkButtonProps {
  href: string;
  label: string;
  iconSrc: string;     // e.g. '/instagram.svg'
  arrowSrc: string;    // e.g. '/diagonal-arrow.svg'
}

export function LinkButton({ href, label, iconSrc, arrowSrc }: LinkButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        {/* Icon on the left */}
        <img src={iconSrc} alt="icon" className="mr-2 h-4 w-4" />
        {label}
        {/* Diagonal arrow icon on the right */}
        <img
          src={arrowSrc}
          alt="arrow"
          className="ml-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </Link>
    </motion.div>
  );
}