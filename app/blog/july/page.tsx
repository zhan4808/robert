'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import ImageIcon from '../../components/ImageIcon';

export default function JulyPost() {
  const [scrollY, setScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (contentRef.current) {
        const { height } = contentRef.current.getBoundingClientRect();
        const scrollableHeight = height - window.innerHeight;
        setProgress(Math.min(1, window.scrollY / scrollableHeight));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Audio player controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const toggleLoop = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  // Grainy animated gradient
  const GrainyGradient = ({ colorClass }: { colorClass: string }) => (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div className={`absolute inset-0 ${colorClass} animate-gradient-x`}></div>
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        filter: 'contrast(150%) brightness(1000%)',
        mixBlendMode: 'multiply',
      }}></div>
    </div>
  );

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  // Custom Image Gallery Component
  const CustomImageGallery = () => {
    const images = [
      {
        src: '/IMG_1493.JPG',
        alt: 'Horseback riding on the beach',
        caption: 'first time on horseback in years, feeling the ocean breeze'
      },
      {
        src: '/IMG_1760.JPG',
        alt: 'Coastal landscape at sunset',
        caption: 'sea ranch views that remind me to slow down'
      },
      {
        src: '/IMG_1887.JPG',
        alt: 'Rocky shoreline at golden hour',
        caption: 'finding beauty in the rugged coastline'
      },
      {
        src: '/IMG_2767.JPG',
        alt: 'Mountain camping at dawn',
        caption: 'backpacking for the first time in years'
      },
      {
        src: '/IMG_2847.jpg',
        alt: 'Night sky over mountains',
        caption: 'stargazing in the wilderness'
      },
      {
        src: '/IMG_3691.JPG',
        alt: 'City skyline from rooftop',
        caption: 'new york city weekend getaway'
      }
    ];

    return (
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              className="group relative aspect-square rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-light leading-tight">
                    {image.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900" ref={contentRef}>
      {/* Reading progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-300 via-pink-300 to-blue-300 z-50"
        style={{ scaleX: progress, transformOrigin: 'left' }}
      />

      <motion.div
        className="mx-auto max-w-[55%] px-8 pt-24 pb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back link with animation */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            back to blog
          </Link>
        </motion.div>

        {/* Header with square gradient icon */}
        <div className="flex items-start mb-8">
          <div className="mr-5 flex-shrink-0">
            <ImageIcon
              src="/oai2.jpeg"
              size="lg"
              borderGradient="from-orange-200 via-pink-300 to-blue-200"
              withHoverEffect={true}
              alt="july post icon"
            />
          </div>

          <div>
            <motion.h1
              className="text-3xl font-semibold mb-2 text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              july
            </motion.h1>

            <motion.h2
              className="text-xl mb-3 text-gray-600 dark:text-gray-400 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              finding excitement in the everyday
            </motion.h2>

            <motion.div
              className="text-sm text-gray-500 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              July 31, 2025
            </motion.div>
          </div>
        </div>

        {/* Custom Player Widget */}
        <motion.div
          className="w-full mb-10 overflow-hidden rounded-lg shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative p-4 rounded-lg bg-white dark:bg-black">
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 mr-4 relative">
                {/* Album art with animated transition */}
                <motion.div
                  className="w-12 h-12 rounded-md overflow-hidden shadow-md relative"
                  animate={isPlaying ? 
                    { scale: [1, 1.02, 1], boxShadow: ["0px 2px 8px rgba(0,0,0,0.1)", "0px 4px 12px rgba(0,0,0,0.2)", "0px 2px 8px rgba(0,0,0,0.1)"] } 
                    : {}}
                  transition={{ 
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src="/whereyouare.jpg"
                    alt="where you are - john summit"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay for playing indicator */}
                  {isPlaying && (
                    <div className="absolute bottom-1 right-1">
                      <div className="flex space-x-0.5">
                        <motion.div
                          className="w-1 h-2 bg-white rounded-full"
                          animate={{ height: [2, 5, 2] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="w-1 h-2 bg-white rounded-full"
                          animate={{ height: [4, 2, 4] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        />
                        <motion.div
                          className="w-1 h-2 bg-white rounded-full"
                          animate={{ height: [3, 6, 3] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
              <div className="flex-grow">
                <div className="mb-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    now playing
                  </span>
                </div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  where you are
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  john summit
                </div>
              </div>
              {/* Controls */}
              <div className="flex items-center ml-4 space-x-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={toggleLoop}
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    isLooping
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40'
                      : 'bg-gray-100 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/40'
                  } transition-colors`}
                  title={isLooping ? 'Disable repeat' : 'Enable repeat'}
                  aria-label="Toggle repeat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3a7 7 0 00-7 7v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1H6.414l1.293-1.293a5 5 0 017.07-7.07l-1.06 1.06a3 3 0 00-4.242 0L8.172 4H9a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h1.657l1.414-1.414A7 7 0 0110 3zm7 11v-1a1 1 0 00-1-1h-4a1 1 0 00-1 1v1a1 1 0 001 1h1.586l-1.293 1.293a5 5 0 01-7.07 7.07l1.06-1.06a3 3 0 004.242 0L11.828 16H11a1 1 0 01-1-1v-1a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-1.657l-1.414 1.414A7 7 0 0110 17a7 7 0 007-7z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Audio element and controls */}
            <audio ref={audioRef} src="/whereyouare.mp3" preload="metadata" loop={isLooping} />
            {/* Progress bar */}
            <div className="mt-4 mx-1" ref={progressBarRef} onClick={handleProgressBarClick}>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-gradient-to-r from-orange-300 to-pink-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* First gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-orange-300 via-pink-300 to-blue-300" />
        </motion.div>

        {/* Quote box */}
        <motion.div
          className="my-12 py-6 px-8 border-l-4 border-orange-300 bg-pink-50 dark:bg-pink-900/40"
          initial={{ opacity: 0, x: -5 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl italic font-light text-gray-700 dark:text-gray-300">
            "music has been the fuel for a lot of my optimism and positivity."
          </p>
        </motion.div>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          july passed by pretty fast, but there were many experiences to look back fondly on. i've been overcoming a hurdle of thinking that my life wasn't exciting enough to share with others. instead, i'm learning to normalize repetitiveness while taking on new adventures and being intentional with my time with others.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          this month has been about enjoying meeting new people and catching up with old friends. there's something beautiful about the rhythm of familiar faces and the excitement of new connections. i've realized that life doesn't need to be constantly groundbreaking to be meaningful—sometimes the most profound moments happen in the spaces between the big events.
        </motion.p>

        {/* Custom Image Gallery */}
        <motion.div
          className="my-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <CustomImageGallery />
        </motion.div>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i backpacked for the first time in years, feeling the weight of my pack and the freedom of the trail. weekend getaways to sea ranch, ca and new york city reminded me that adventure doesn't have to be far-flung to be transformative. weekend bbq + poker with friends became these perfect moments of connection and laughter.
        </motion.p>

        {/* Second gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-pink-300 via-blue-300 to-orange-300" />
        </motion.div>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          music has been the fuel for a lot of my optimism and positivity. i love house, techno, afro, progressive house, everything electronic dance music. there's something about the rhythm and energy that connects me to a deeper sense of joy and possibility. when i'm listening to the right track, everything feels possible.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i've been learning to find excitement in the everyday. it's not about constantly seeking the next big thing, but about being present in the moments that make up a life. the coffee with a friend, the walk in the park, the late-night conversation—these are the threads that weave together into something beautiful.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={6}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          there's a certain magic in being intentional with time. when i'm fully present with someone, whether it's an old friend or someone i just met, i feel more alive. it's like each interaction is a small adventure, a chance to learn something new or see the world through different eyes.
        </motion.p>

        {/* Third gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-blue-300 via-orange-300 to-pink-300" />
        </motion.div>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={7}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          july taught me that life doesn't need to be constantly extraordinary to be extraordinary. sometimes the most profound experiences come from the simple act of showing up, being present, and allowing yourself to be moved by the people and places around you. it's about finding the music in the everyday rhythm.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={8}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          as the month comes to a close, i'm grateful for these moments of connection and discovery. for the friends who make me laugh, the music that moves me, and the adventures that remind me of the beauty in both the grand and the simple. here's to finding excitement in the everyday and letting the rhythm carry us forward.
        </motion.p>

        {/* Final gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-orange-300 via-pink-300 to-blue-300" />
        </motion.div>

        <motion.div
          className="mt-16 text-center text-xl font-light text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          here&apos;s to the rhythm of life and the people who make it dance.
        </motion.div>
      </motion.div>
    </div>
  );
} 