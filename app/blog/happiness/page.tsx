'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import ImageIcon from '../../components/ImageIcon';
import ImageGallery from '../../components/ImageGallery';
import { FloatingGallery } from '../../components/ImageGallery';

export default function HappinessPost() {
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
  
  // Toggle loop
  const toggleLoop = () => {
    if (!audioRef.current) return;
    
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };
  
  // Scrubbing functionality
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
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // Generate grainy animated gradient
  const GrainyGradient = ({ colorClass }: { colorClass: string }) => {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <div className={`absolute inset-0 ${colorClass} animate-gradient-x`}></div>
        <div className="absolute inset-0 opacity-40" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          filter: 'contrast(150%) brightness(1000%)',
          mixBlendMode: 'multiply',
        }}></div>
      </div>
    );
  };
  
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
  
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900" ref={contentRef}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/sunflowerfeelings.mp3" preload="metadata" loop={isLooping} />
      
      {/* Reading progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 z-50"
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
              src="/oai1.jpg"
              size="lg"
              borderGradient="from-purple-200 via-pink-300 to-indigo-200"
              withHoverEffect={true}
              alt="Happiness post icon"
            />
          </div>
          
          <div>
            <motion.h1 
              className="text-3xl font-semibold mb-2 text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              happiness
            </motion.h1>
            
            <motion.h2
              className="text-xl mb-3 text-gray-600 dark:text-gray-400 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ambition has made college lose true happiness
            </motion.h2>
            
            <motion.div
              className="text-sm text-gray-500 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              April 25, 2025
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
          <div className="relative p-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 mr-4 relative">
                {/* Album art with subtle breathing animation when playing */}
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
                    src="/sunflowerfeelings.jpeg" 
                    alt="Sunflower Feelings - Kuzu Mellow" 
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
                    Now Playing
                  </span>
                </div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  Sunflower Feelings
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Kuzu Mellow
                </div>
              </div>
              
              <div className="flex">
                <button 
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors"
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
            
            {/* Progress bar */}
            <div className="mt-4 mx-1" ref={progressBarRef} onClick={handleProgressBarClick}>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="h-full bg-gradient-to-r from-pink-300 to-purple-300 rounded-full" 
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
        
        {/* First grainy gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-red-400 via-orange-300 to-indigo-300" />
        </motion.div>
        
        {/* Article content with cleaner typography */}
        <motion.div className="space-y-6 text-gray-800 dark:text-gray-200">
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            two years into college, and i've become someone i don't recognize. last night at 3 am, surrounded by empty coffee cups and scattered textbooks, i had this moment of clarity that knocked the wind out of me. what the hell am i doing? who am i becoming? i've spent the past two years meticulously constructing my resume, obsessing over internships, and judging everyone—including myself—by a single metric: career potential.
          </motion.p>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            it started innocently enough. my first semester, i was just trying to "get ahead," to "set myself up for success." now i find myself categorizing people within seconds of meeting them. engineering major? respect. art history? what's your backup plan? i've become the human embodiment of linkedin, constantly calculating everyone's professional value while ignoring what makes them... human.
          </motion.p>
          
          {/* Quote box with minimal design */}
          <motion.div 
            className="my-12 py-6 px-8 border-l-4 border-pink-300 bg-gray-50 dark:bg-gray-800/40"
            initial={{ opacity: 0, x: -5 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl italic font-light text-gray-700 dark:text-gray-300">
              "i've been so busy building a career-worthy life that i forgot to build a life worth living."
            </p>
          </motion.div>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            i wonder if my friends or classmates think i'm crushing it. from the outside, i'm this put-together, ambitious, cracked sophomore with a five-year plan and his shit figured out. they don't see me staring at the ceiling at night, wondering why success feels so empty. or scrolling through texts from high school friends i never grew close to again because who knows why. or realizing i haven't laughed—really laughed—in months.
          </motion.p>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            last week, my roommate invited me to a concert. my first instinct wasn't "sounds fun" but "who will be there that could be useful for my career?" that's when i knew something was broken in me. i'm 20 years old, and i've already turned my life into a never-ending job interview. the worst part? i'm not even passionate about the career i'm killing myself for. i'm chasing status, not fulfillment.
          </motion.p>
          
          {/* Second grainy gradient */}
          <motion.div
            className="w-full h-40 rounded-lg overflow-hidden my-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GrainyGradient colorClass="bg-gradient-to-r from-indigo-300 via-purple-400 to-fuchsia-300" />
          </motion.div>
          
          {/* Section with minimal design */}
          <motion.div
            className="my-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            
            <motion.p
              className="font-light text-lg leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              it hit me hard during winter break. i went home and couldn't connect with anyone. old friends were talking about road trips and relationships and stupid, wonderful memories, while i was mentally drafting cover letters. my parents noticed something was off—asked if i was okay. "just tired from finals," i said. but really, i was tired of myself.
            </motion.p>
            
            <motion.p
              className="font-light text-lg leading-relaxed mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              i've become so focused on being impressive that i've forgotten how to be present. i scroll through social media and mentally rank everyone's career trajectories instead of appreciating their joy. i have 1500+ linkedin connections but can't name five people who really know me. i've sacrificed deep connections for shallow networking, genuine interests for resume-building activities.
            </motion.p>
          </motion.div>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={7}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            the most messed up part? i've internalized capitalism so completely that i evaluate my own worth through the lens of productivity. watching a movie feels like wasted time. going for a walk without listening to an educational podcast feels irresponsible. my self-worth has become completely entangled with my perceived market value. no wonder i'm miserable.
          </motion.p>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={8}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            i can't even remember the last time i genuinely talked to someone for hours to someone not about internships or classes, but about our families, our fears, our favorite movies from childhood. i don't feel like a real person, more like a walking resume. now i wait for something revolutionary to come to me, most likely the reality is not. still, i know i will be the one to dig myself out of this as i have so many times before. i've noticed i've built this terrible habit of just dropping things and not caring about them when things get hard, and this needs to change. desperately waiting for someone to change me but i think i've realized that person is myself. still, i'm lost and confused. ive slowly lost motivation discipline and commitment to work and becoming someone that is fine with whatever comes to them in life while not giving something their everything. i go in cycles of hyper productivity to extremely low points of doing zero work in a week. i dont think this is me burning out, its just me being lazy. how should i go about fixing this?
          </motion.p>
          
          {/* Third grainy gradient */}
          <motion.div
            className="w-full h-40 rounded-lg overflow-hidden my-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GrainyGradient colorClass="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-red-400" />
          </motion.div>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={9}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            being happy scares me. i don't think i deserve happiness, but it's more so the fear of happiness blinding me and inevitably causing more misery to ppl i care abt. tbh im so emotionally detached from everything. isn't there the saying of how being alone means nobody can hurt you and you cannot hurt anyone who cares about you. i don't have some grand solution yet. i'm not suddenly "fixed." small steps. i'm trying to relearn how to value people—including myself—not for what we can achieve, but for who we are. because i'm starting to realize that being the perfect job candidate means nothing if you've lost yourself along the way.
          </motion.p>
          
          <motion.p 
            className="font-light text-lg leading-relaxed"
            custom={10}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            so if you're like me—someone who's been measuring life in linkedin endorsements and forgotten how to just be—maybe we can figure this out together. because i think there's more to these college years, more to life, than just preparing for some hypothetical career. at least, i really hope there is.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
} 