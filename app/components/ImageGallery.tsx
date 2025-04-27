'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define our image collections
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

type GalleryType = 'grid' | 'masonry' | 'carousel' | 'floating';
type ImageCollection = 'ai' | 'webp' | 'all';

interface ImageGalleryProps {
  type?: GalleryType;
  collection?: ImageCollection;
  count?: number;
  className?: string;
  imageClassName?: string;
  withTitle?: boolean;
  titleText?: string;
}

export default function ImageGallery({
  type = 'grid',
  collection = 'all',
  count = 6,
  className = '',
  imageClassName = '',
  withTitle = false,
  titleText = 'Image Gallery',
}: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    let selectedImages: string[] = [];
    
    switch (collection) {
      case 'ai':
        selectedImages = [...AI_IMAGES];
        break;
      case 'webp':
        selectedImages = [...WEBP_IMAGES];
        break;
      default:
        selectedImages = [...ALL_IMAGES];
        break;
    }
    
    // Shuffle images
    const shuffled = [...selectedImages].sort(() => 0.5 - Math.random());
    
    // Limit to count
    setImages(shuffled.slice(0, count));
  }, [collection, count]);
  
  // Return appropriate component based on type
  switch (type) {
    case 'grid':
      return <GridGallery images={images} className={className} imageClassName={imageClassName} withTitle={withTitle} titleText={titleText} />;
    case 'masonry':
      return <MasonryGallery images={images} className={className} imageClassName={imageClassName} withTitle={withTitle} titleText={titleText} />;
    case 'carousel':
      return <CarouselGallery images={images} className={className} imageClassName={imageClassName} withTitle={withTitle} titleText={titleText} />;
    case 'floating':
      return <FloatingGallery images={images} className={className} imageClassName={imageClassName} withTitle={withTitle} titleText={titleText} />;
    default:
      return <GridGallery images={images} className={className} imageClassName={imageClassName} withTitle={withTitle} titleText={titleText} />;
  }
}

// Grid Gallery
function GridGallery({
  images,
  className = '',
  imageClassName = '',
  withTitle = false,
  titleText = 'Image Gallery',
}: {
  images: string[];
  className?: string;
  imageClassName?: string;
  withTitle?: boolean;
  titleText?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      {withTitle && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{titleText}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, index) => (
          <motion.div
            key={src}
            className="aspect-square rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={src} 
              alt={`Gallery image ${index + 1}`} 
              className={`w-full h-full object-cover ${imageClassName}`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Masonry Gallery
function MasonryGallery({
  images,
  className = '',
  imageClassName = '',
  withTitle = false,
  titleText = 'Image Gallery',
}: {
  images: string[];
  className?: string;
  imageClassName?: string;
  withTitle?: boolean;
  titleText?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      {withTitle && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{titleText}</h2>
      )}
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {images.map((src, index) => (
          <motion.div
            key={src}
            className="break-inside-avoid mb-3 rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={src} 
              alt={`Gallery image ${index + 1}`} 
              className={`w-full h-auto ${imageClassName}`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Carousel Gallery
function CarouselGallery({
  images,
  className = '',
  imageClassName = '',
  withTitle = false,
  titleText = 'Image Gallery',
}: {
  images: string[];
  className?: string;
  imageClassName?: string;
  withTitle?: boolean;
  titleText?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className={`w-full ${className}`}>
      {withTitle && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{titleText}</h2>
      )}
      <div className="relative w-full rounded-xl overflow-hidden aspect-video mb-2">
        {images.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={src} 
              alt={`Carousel image ${index + 1}`} 
              className={`w-full h-full object-cover ${imageClassName}`}
            />
          </motion.div>
        ))}
        
        {/* Controls */}
        <button 
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Thumbnails */}
      <div className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide">
        {images.map((src, index) => (
          <button
            key={src}
            onClick={() => setActiveIndex(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
              activeIndex === index 
                ? 'border-purple-500 opacity-100 scale-105' 
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={src} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Floating Gallery
function FloatingGallery({
  images,
  className = '',
  imageClassName = '',
  withTitle = false,
  titleText = 'Image Gallery',
}: {
  images: string[];
  className?: string;
  imageClassName?: string;
  withTitle?: boolean;
  titleText?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      {withTitle && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{titleText}</h2>
      )}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {images.slice(0, Math.min(6, images.length)).map((src, index) => {
          // Calculate random positions
          const top = `${10 + Math.random() * 50}%`;
          const left = `${10 + Math.random() * 60}%`;
          const zIndex = 10 + index;
          const rotate = Math.random() * 20 - 10; // -10 to 10 degrees
          
          return (
            <motion.div
              key={src}
              className="absolute rounded-xl overflow-hidden shadow-lg"
              style={{ 
                top, 
                left, 
                zIndex,
                width: '180px',
                height: '180px',
                transform: `rotate(${rotate}deg)`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.1, 
                zIndex: 50,
                transition: { duration: 0.3 }
              }}
              drag
              dragConstraints={{
                top: -100,
                left: -100,
                right: 100,
                bottom: 100,
              }}
            >
              <img 
                src={src} 
                alt={`Floating image ${index + 1}`} 
                className={`w-full h-full object-cover ${imageClassName}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Export individual components too
export { GridGallery, MasonryGallery, CarouselGallery, FloatingGallery }; 