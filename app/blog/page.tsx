'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BlogPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Generate grainy animated triangle gradient for post icons
  const GrainyTriangleGradient = ({ colorOne, colorTwo, colorThree }: { colorOne: string, colorTwo: string, colorThree: string }) => {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom right, ${colorOne}, transparent), 
                       linear-gradient(to bottom left, ${colorTwo}, transparent), 
                       linear-gradient(to top, ${colorThree}, transparent)`
        }}></div>
        <div className="absolute inset-0 opacity-40" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          filter: 'contrast(150%) brightness(1000%)',
          mixBlendMode: 'multiply',
        }}></div>
      </div>
    );
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="mx-auto min-h-screen max-w-[55%] px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle background gradient effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute rounded-full bg-gradient-to-r from-purple-300/10 via-pink-300/10 to-blue-300/10 opacity-30 dark:opacity-20 blur-3xl"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 100
          }}
          style={{
            width: 800,
            height: 800,
          }}
        />
      </div>
      
      {/* Title and Subtitle */}
      <div className="mb-10 text-left">
        <h1 className="mt-12 text-2xl font-bold text-black dark:text-white">
          Blog
        </h1>
        <p className="mt-0 text-small text-gray-600 dark:text-gray-400">
          Thoughts and reflections
        </p>
      </div>
      
      {/* Blog posts grid */}
      <div className="mt-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/blog/happiness" className="group block">
            <div className="overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all dark:bg-gray-800/60 hover:shadow-md p-4">
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                  <GrainyTriangleGradient 
                    colorOne="#f9a8d4" 
                    colorTwo="#c4b5fd" 
                    colorThree="#a5b4fc" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-black group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                      happiness
                    </h2>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                    <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    finding joy in the little moments rather than endless pursuit of achievement
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/blog/college" className="group block">
            <div className="overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all dark:bg-gray-800/60 hover:shadow-md p-4">
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                  <GrainyTriangleGradient 
                    colorOne="#bfdbfe" 
                    colorTwo="#a5b4fc" 
                    colorThree="#c4b5fd" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-black group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                      college
                    </h2>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                    <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    embracing new friendships and experiences in this unique chapter of life
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}