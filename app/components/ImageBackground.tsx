'use client';

import React, { useState, useEffect } from 'react';
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

type BackgroundEffect = 'parallax' | 'crossfade' | 'blur' | 'particles';

interface ImageBackgroundProps {
  effect?: BackgroundEffect;
  images?: string[];
  fromCollection?: 'ai' | 'webp' | 'all';
  count?: number;
  interval?: number; // For crossfade effect
  className?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export default function ImageBackground({
  effect = 'parallax',
  images,
  fromCollection = 'all',
  count = 1,
  interval = 5000, // Default 5 seconds for crossfade
  className = '',
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  overlayOpacity = 0.4,
  children,
}: ImageBackgroundProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    
    if (effect === 'parallax') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [effect]);
  
  // Select images
  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImages(images.slice(0, count));
      return;
    }
    
    // Otherwise select from collection
    let collection = ALL_IMAGES;
    
    if (fromCollection === 'ai') {
      collection = AI_IMAGES;
    } else if (fromCollection === 'webp') {
      collection = WEBP_IMAGES;
    }
    
    // Shuffle and select
    const shuffled = [...collection].sort(() => 0.5 - Math.random());
    setSelectedImages(shuffled.slice(0, count));
  }, [images, fromCollection, count]);
  
  // Change image for crossfade
  useEffect(() => {
    if (effect !== 'crossfade' || selectedImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % selectedImages.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [effect, selectedImages, interval]);
  
  // Render based on effect
  const renderBackground = () => {
    if (selectedImages.length === 0) return null;
    
    switch (effect) {
      case 'parallax':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {selectedImages.map((src, index) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                style={{
                  zIndex: index,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                animate={{
                  x: mousePosition.x / 50,
                  y: mousePosition.y / 50,
                }}
                transition={{ type: 'spring', damping: 40, stiffness: 100 }}
              />
            ))}
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              }}
            />
          </div>
        );
        
      case 'crossfade':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {selectedImages.map((src, index) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === activeIndex ? 1 : 0 }}
                transition={{ duration: 1.5 }}
                style={{
                  zIndex: index,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              }}
            />
          </div>
        );
        
      case 'blur':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 filter blur-sm"
              style={{
                backgroundImage: `url(${selectedImages[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              }}
            />
          </div>
        );
        
      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${selectedImages[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.3)',
              }}
            />
            <ParticleOverlay count={20} />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {renderBackground()}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Helper component for particles effect
function ParticleOverlay({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }).map((_, i) => {
    const size = 5 + Math.random() * 20;
    const initialX = Math.random() * 100;
    const initialY = Math.random() * 100;
    const duration = 20 + Math.random() * 40;
    
    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white/10 backdrop-blur-md"
        style={{
          width: size,
          height: size,
          top: `${initialY}%`,
          left: `${initialX}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  });
  
  return <>{particles}</>;
} 