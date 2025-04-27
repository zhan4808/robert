'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Define image collections
const AI_IMAGES = [
  '/oai1.jpg',
  '/oai2.jpeg',
  '/oai3.jpg',
  '/oai4.jpg',
  '/oai5.png',
  '/oai6.png',
  '/oai7.png',
];

const WEBP_IMAGES = [
  '/WEBP to JPG 1.jpg',
  '/WEBP to JPG 2.jpg',
  '/WEBP to JPG 3.jpg',
  '/WEBP to JPG 4.jpg',
  '/WEBP to JPG 5.jpg',
  '/WEBP to JPG Conversion.jpg',
];

// Combine all images
const ALL_IMAGES = [...AI_IMAGES, ...WEBP_IMAGES];

interface ImageIconProps {
  src?: string;
  randomFromCollection?: 'ai' | 'webp' | 'all';
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGradientBorder?: boolean;
  withHoverEffect?: boolean;
  className?: string;
  borderGradient?: string;
}

export default function ImageIcon({
  src,
  randomFromCollection,
  alt = 'Image icon',
  size = 'md',
  withGradientBorder = true,
  withHoverEffect = true,
  className = '',
  borderGradient = 'from-purple-400 via-pink-500 to-blue-500',
}: ImageIconProps) {
  // Determine the image source
  const imageSrc = React.useMemo(() => {
    if (src) return src;
    
    // If no src provided, get random from collection
    let collection = ALL_IMAGES;
    
    if (randomFromCollection === 'ai') {
      collection = AI_IMAGES;
    } else if (randomFromCollection === 'webp') {
      collection = WEBP_IMAGES;
    }
    
    const randomIndex = Math.floor(Math.random() * collection.length);
    return collection[randomIndex];
  }, [src, randomFromCollection]);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  }[size];
  
  // Border size
  const borderSize = {
    sm: 'p-0.5',
    md: 'p-0.5',
    lg: 'p-1',
    xl: 'p-1.5',
  }[size];
  
  return (
    <motion.div
      className={`flex-shrink-0 rounded-lg overflow-hidden ${sizeClasses} ${
        withGradientBorder ? `${borderSize} bg-gradient-to-br ${borderGradient}` : ''
      } ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={withHoverEffect ? { scale: 1.05 } : {}}
    >
      <div className="w-full h-full rounded-md overflow-hidden">
        <img 
          src={imageSrc} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
} 