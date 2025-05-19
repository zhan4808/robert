'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import ImageIcon from '../../components/ImageIcon';
import ImageGallery from '../../components/ImageGallery';
import { FloatingGallery } from '../../components/ImageGallery';

export default function PurposePost() {
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

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900" ref={contentRef}>
      <audio ref={audioRef} src="/herewithme.mp3" preload="metadata" loop={isLooping} />
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 z-50"
        style={{ scaleX: progress, transformOrigin: 'left' }}
      />
      <motion.div
        className="mx-auto max-w-[55%] px-8 pt-24 pb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
        <div className="flex items-start mb-8">
          <div className="mr-5 flex-shrink-0">
            <ImageIcon 
              src="/oai5.png"
              size="lg"
              borderGradient="from-blue-200 via-purple-300 to-pink-200"
              withHoverEffect={true}
              alt="Purpose post icon"
            />
          </div>
          <div>
            <motion.h1 
              className="text-3xl font-semibold mb-2 text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              purpose
            </motion.h1>
            <motion.h2
              className="text-xl mb-3 text-gray-600 dark:text-gray-400 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              finding what makes me
            </motion.h2>
            <motion.div
              className="text-sm text-gray-500 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              December 22, 2024
            </motion.div>
          </div>
        </div>
        <motion.div
          className="w-full mb-10 overflow-hidden rounded-lg shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative p-4 rounded-lg bg-gradient-to-r from-blue-100 to-pink-50 dark:from-blue-900 dark:to-pink-900/30">
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 mr-4 relative">
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
                    src="/herewithme.jpg" 
                    alt="here with me - d4v4d" 
                    className="w-full h-full object-cover"
                  />
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
                    Now Playing
                  </span>
                </div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  here with me
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  d4v4d
                </div>
              </div>
              <div className="flex">
                <button 
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
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
                  className={`ml-2 w-8 h-8 flex items-center justify-center rounded-full ${
                    isLooping 
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40' 
                      : 'bg-gray-100 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/40'
                  } transition-colors`}
                  title={isLooping ? "Disable loop" : "Enable loop"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3a7 7 0 00-7 7v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1H6.414l1.293-1.293a5 5 0 017.07-7.07l-1.06 1.06a3 3 0 00-4.242 0L8.172 4H9a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h1.657l1.414-1.414A7 7 0 0110 3zm7 11v-1a1 1 0 00-1-1h-4a1 1 0 00-1 1v1a1 1 0 001 1h1.586l-1.293 1.293a5 5 0 01-7.07 7.07l1.06-1.06a3 3 0 004.242 0L11.828 16H11a1 1 0 01-1-1v-1a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-1.657l-1.414 1.414A7 7 0 0110 17a7 7 0 007-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-4 mx-1" ref={progressBarRef} onClick={handleProgressBarClick}>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="h-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-full" 
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
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
        </motion.div>
        <motion.div className="space-y-6 text-gray-800 dark:text-gray-200">
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            lately, i keep coming back to the question: what gives me purpose? is it personal growth, the praise of others, or the rare moments when i actually feel proud of myself? is it the number of people i know, or the depth of the connections i have? does my sense of self shape how others see me, or is it the other way around? do i feel valued, seen as someone with potential, or am i just hoping for it?
          </motion.p>

          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            i keep wondering if my purpose should be about what i do for others, or if it should be about my own growth and fulfillment. even if i help people or give them purpose, is that really what gives me purpose? or am i just searching for something to fill the space where meaning should be? sometimes i think about how much of my self-worth is tied to being recognized, and how much is just about being able to look at myself and feel content with who i am becoming.
          </motion.p>

          <motion.div
            className="w-full h-40 rounded-lg overflow-hidden my-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GrainyGradient colorClass="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
          </motion.div>

          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            i've realized that a lot of my drive comes from wanting to be seen as someone with potential, someone who is going somewhere. but the more i chase that, the more i wonder if i'm just running from the fear of being ordinary. is it enough to just be, or do i need to be impressive? i think about the times i've felt most alive—usually not when i'm being praised, but when i'm deeply engaged in something, or when i'm with people who make me feel understood.
          </motion.p>

          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            i used to think purpose would just appear, but now i see it's something i have to build, one uncomfortable step at a time. the truth is, most of the time, it's a lot of not fully vibing with people, awkward conversations, and rejection. but i'm starting to value these moments—they help me figure out what i want, and who i want to be purposeful with. i'm learning that the quality of my connections matters more than the quantity, and that being vulnerable is the only way to find people who really get me.
          </motion.p>

          <motion.div
            className="w-full h-40 rounded-lg overflow-hidden my-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GrainyGradient colorClass="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400" />
          </motion.div>

          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={5}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            i'm still not sure if my purpose is supposed to be about others or just about me. maybe it's both. maybe it changes. i'm learning that it's okay to not have a clear answer. what matters is that i keep asking, keep trying, and keep showing up—even when it's awkward, even when it's hard. i'm starting to see that purpose isn't something you find—it's something you create, slowly, by being honest with yourself and others. it's in the moments you risk being misunderstood, the times you reach out even when you're scared, and the days you choose to keep going, even when you're not sure why.
          </motion.p>

          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={6}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            maybe purpose is about learning to be okay with not knowing, and finding meaning in the process of searching. maybe it's about letting go of the need to be perfect, and just being real. i'm still figuring it out, but for now, i'm grateful for the questions, the connections, and the chance to keep growing.
          </motion.p>

          <motion.div
            className="w-full h-40 rounded-lg overflow-hidden my-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GrainyGradient colorClass="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
          </motion.div>

          <motion.p
            className="font-light text-lg leading-relaxed text-center mt-8"
            custom={7}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            maybe purpose is just the courage to keep searching.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
} 