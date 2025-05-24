'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const images = [
    { cover: '/robert1.svg', caption: '/Murmure2.svg' },
    { cover: '/sf1.svg', caption: '/Murmure7.svg' },
    { cover: '/tahoe1.svg', caption: '/Murmure5.svg' },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const connectLinks = [
    { name: 'Collaborations', icon: '/gmail.svg', url: 'mailto:robertzhang930@gmail.com' },
    { name: 'X', icon: '/x.svg', url: 'https://x.com/robdobflob' },
    { name: 'Instagram', icon: '/instagram.svg', url: 'https://instagram.com/robert.zhang_' },
    { name: 'LinkedIn', icon: '/linkedin.svg', url: 'https://www.linkedin.com/in/robert05/' },
    { name: 'GitHub', icon: '/github.svg', url: 'https://github.com/zhan4808' },
    { name: 'Beli', icon: '/beli.svg', url: 'https://beliapp.co/app/robertz' },
  ];


/*
  const [positions, setPositions] = useState(
    images.map(() => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 50 + 10,
      dx: Math.random() > 0.5 ? 1 : -1,
      dy: Math.random() > 0.5 ? 1 : -1,
    }))
  );

  // Handle collision detection and update positions
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos, index) => {
          let { x, y, dx, dy } = pos;

          // Bounce off walls
          if (x <= 0 || x >= 90) dx *= -1;
          if (y <= 0 || y >= 90) dy *= -1;

          // Bounce off other images
          prev.forEach((other, otherIndex) => {
            if (index !== otherIndex) {
              const distance = Math.sqrt(
                Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2)
              );
              if (distance < 10) {
                dx *= -1;
                dy *= -1;
              }
            }
          });

          // Update position
          x += dx;
          y += dy;

          return { x, y, dx, dy };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);
  */

  return (
    <motion.div
      className="mx-auto min-h-screen max-w-[55%] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title and Subtitle */}
      <div className="mb-10 text-left">
        <h1 className="mt-12 text-2xl font-bold text-black dark:text-white">
          About Me
        </h1>
        <p className="mt-0 text-small text-gray-600 dark:text-gray-400">
          A glimpse into me
        </p>
      </div>

      {/* Overlapping Image Section */}
      <div className="relative w-full h-[300px] mt-4">
        {images.map((image, index) => {
          // Creative overlap positioning
          const topOffset = index % 2 === 0 ? `${index * 5}px` : `${index * 10}px`;
          const leftOffset = index % 2 === 0 ? `${index * 30}%` : `${index * 30}%`;
          const rotation = index % 2 === 0 ? '-5deg' : '5deg';

          return (
            <motion.div
              key={index}
              className="absolute w-[300px] h-[225px] rounded-lg shadow-lg overflow-hidden"
              style={{
                top: topOffset,
                left: leftOffset,
                transform: `rotate(${rotation})`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Frame Flip Animation */}
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  rotateY: hoveredIndex === index ? 180 : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Front Side (Cover Image) */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <img
                    src={image.cover}
                    alt={`Cover ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Back Side (Caption Image) */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={image.caption}
                    alt={`Caption ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Hello Section */}
      <div className="flex w-">
        {/* "Hello!" Text */}
        <div className="w-1/4 text-left">
          <h2 className="text-2xl font-light text-black dark:text-white">
            Hello!
          </h2>
        </div>

        {/* Paragraph */}
        <div className="w-3/4 pl-8 mb-10">
          <p className="text-small text-gray-700 dark:text-gray-300 leading-relaxed">
            Hey there, I'm Robert! Growing up in San Francisco and Palo Alto, I'm now based
            in the vibrant place that is San Jose.
            <br />
            <br />
            My curiosity for computers began at age 10, which naturally led me to pursue
            a career in tech. I have been studying electrical engineering and computer 
            science at Purdue University and have interests in hardware-software codesign
            and optimizations!
          </p>
        </div>
      </div>

      {/* Connect Section */}
      <div className="flex w-full">
        {/* "Connect" Text */}
        <div className="w-1/4 text-left">
          <h2 className="text-2xl font-light text-black dark:text-white">
            Connect
          </h2>
        </div>

        {/* Buttons */}
        <div className="w-3/4 pl-8 grid grid-cols-2 gap-4">
          {connectLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center space-x-2">
                <img src={link.icon} alt={link.name} className="w-5 h-5" />
                <span>{link.name}</span>
              </div>
              <img
                src={'/diagarrow-light.svg'}
                alt="Arrow Icon"
                className="w-4 h-4"
              />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}