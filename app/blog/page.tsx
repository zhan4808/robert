'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ImageIcon from '../components/ImageIcon';

export default function BlogPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);
  
  // Add TailwindCSS classes to ensure they are included in the build
  const gradientClasses = `
    bg-gradient-to-r
    from-red-400 via-orange-300 to-indigo-300
    from-pink-400 via-rose-300 to-orange-300
    from-indigo-400 via-purple-300 to-fuchsia-300
    from-blue-400 via-indigo-300 to-purple-300
  `;
  
  // Gradient backgrounds for blog posts
  const blogPosts = [
    {
      slug: 'may',
      title: 'may',
      description: 'redefining balance, purpose, and connections',
      date: 'May 17, 2025',
      image: '/WEBPtoJPG4.jpg',
      colors: ['yellow', 'blue', 'red'],
      gradientClass: 'from-yellow-100 via-blue-100 to-red-200',
      href: '/blog/may',
    },
    {
      slug: 'happiness',
      title: 'happiness',
      description: 'ambition and happiness',
      date: 'April 25, 2025',
      image: '/oai1.jpg',
      colors: ['red', 'orange', 'indigo'],
      gradientClass: 'from-red-400 via-orange-300 to-indigo-300',
      href: '/blog/happiness',
    },
    {
      slug: 'college',
      title: 'college',
      description: 'unexpected friends and experiences',
      date: 'April 14, 2025',
      image: '/oai3.jpg',
      colors: ['pink', 'rose', 'orange'],
      gradientClass: 'from-pink-400 via-rose-300 to-orange-300',
      href: '/blog/college',
    },
    {
      slug: 'purpose',
      title: 'purpose',
      description: 'finding what makes me',
      date: 'December 22, 2024',
      image: '/oai5.png',
      colors: ['blue', 'purple', 'pink'],
      gradientClass: 'from-blue-400 via-purple-400 to-pink-400',
      href: '/blog/purpose',
    },
  ];
  
  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-gray-900 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="mt-12 text-2xl font-bold text-black dark:text-white">
          blog
          </h1>
          <p className="mt-0 mb-8 text-sm text-gray-600 dark:text-gray-400">
            thoughts, ideas, and explorations
          </p>
        </motion.div>
        
        <div className="space-y-6">
          {blogPosts.map((post, index) => {
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <Link 
                  href={post.href}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <ImageIcon 
                          src={post.image} 
                          size="md"
                          borderGradient={`from-${post.colors[0]}-200 via-${post.colors[1]}-300 to-${post.colors[2]}-200`}
                          withHoverEffect={true}
                          alt={`${post.title} post icon`}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                          {post.title}
                        </h2>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {post.description}
                        </p>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span>{post.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div 
                          className={`h-10 w-10 rounded-full bg-gradient-to-r ${post.gradientClass} group-hover:scale-110 transition-transform duration-300`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}