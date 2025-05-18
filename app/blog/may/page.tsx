'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import ImageIcon from '../../components/ImageIcon';

export default function SummerPost() {
  const [scrollY, setScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Song list
  const songs = [
    {
      title: 'house of love',
      artist: 'smooth touch',
      src: '/houseoflove.mp3',
      image: '/houseoflove.jpg',
    },
    {
      title: 'unforgettable',
      artist: 'smokepurpp',
      src: '/unforgettable.mp3',
      image: '/unforgettable.jpg',
    },
  ];
  const [songIndex, setSongIndex] = useState(0);
  const currentSong = songs[songIndex];

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
    const handleEnded = () => {
      if (songIndex < songs.length - 1) {
        setSongIndex(songIndex + 1);
        setIsPlaying(true);
      } else if (isLooping) {
        setSongIndex(0);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songIndex, isLooping, songs.length]);
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  // When songIndex changes, reset audio
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [songIndex]);

  // Song switch handlers
  const nextSong = () => setSongIndex((i) => (i + 1) % songs.length);
  const prevSong = () => setSongIndex((i) => (i - 1 + songs.length) % songs.length);

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

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900" ref={contentRef}>
      {/* Reading progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-red-200 z-50"
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
              src="/WEBPtoJPG4.jpg"
              size="lg"
              borderGradient="from-yellow-200 via-blue-200 to-red-200"
              withHoverEffect={true}
              alt="summer post icon"
            />
          </div>

          <div>
            <motion.h1
              className="text-3xl font-semibold mb-2 text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              may
            </motion.h1>

            <motion.h2
              className="text-xl mb-3 text-gray-600 dark:text-gray-400 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              redefining balance, purpose, and connections
            </motion.h2>

            <motion.div
              className="text-sm text-gray-500 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              May 17, 2025
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
                  key={currentSong.image}
                  className="w-12 h-12 rounded-md overflow-hidden shadow-md relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={currentSong.image}
                    alt={currentSong.title}
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
                <motion.div
                  key={currentSong.title + currentSong.artist}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      now playing
                    </span>
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {currentSong.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentSong.artist}
                  </div>
                </motion.div>
              </div>
              {/* Controls: play/pause, repeat, next/prev */}
              <div className="flex items-center ml-4 space-x-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-blue-900/30 text-yellow-700 dark:text-blue-400 hover:bg-yellow-200 dark:hover:bg-blue-800/40 transition-colors"
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
                      ? 'bg-blue-100 dark:bg-yellow-900/30 text-blue-700 dark:text-yellow-400 hover:bg-blue-200 dark:hover:bg-yellow-800/40'
                      : 'bg-gray-100 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/40'
                  } transition-colors`}
                  title={isLooping ? 'Disable repeat' : 'Enable repeat'}
                  aria-label="Toggle repeat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3a7 7 0 00-7 7v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1H6.414l1.293-1.293a5 5 0 017.07-7.07l-1.06 1.06a3 3 0 00-4.242 0L8.172 4H9a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h1.657l1.414-1.414A7 7 0 0110 3zm7 11v-1a1 1 0 00-1-1h-4a1 1 0 00-1 1v1a1 1 0 001 1h1.586l-1.293 1.293a5 5 0 01-7.07 7.07l1.06-1.06a3 3 0 004.242 0L11.828 16H11a1 1 0 01-1-1v-1a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-1.657l-1.414 1.414A7 7 0 0110 17a7 7 0 007-7z" />
                  </svg>
                </button>
                {/* Song switch button (prev) */}
                <button
                  onClick={prevSong}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Previous song"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M13 15V5a1 1 0 00-1.707-.707l-6 5a1 1 0 000 1.414l6 5A1 1 0 0013 15z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* Song switch button (next) */}
                <button
                  onClick={nextSong}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Next song"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 5v10a1 1 0 001.707.707l6-5a1 1 0 000-1.414l-6-5A1 1 0 007 5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Audio element and controls */}
            <audio ref={audioRef} src={currentSong.src} preload="metadata" loop={isLooping} />
            {/* Progress bar */}
            <div className="mt-4 mx-1" ref={progressBarRef} onClick={handleProgressBarClick}>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-gradient-to-r from-yellow-200 to-blue-200 rounded-full"
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
          <GrainyGradient colorClass="bg-gradient-to-r from-yellow-100 via-blue-100 to-red-200" />
        </motion.div>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i am living may with more purpose—balancing adventure, friendship, and self-discovery. may always feels like a season of possibility, but also a time when i am questioning my place in the world.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i have always hated being the one reaching out to others to catch up. it has felt like no one wants to reach out to me, and i have wondered if i am just forcing connections. but i have grown fine with that reality. i am seeing my initiative to catch up as a strength, not a weakness. i am proud to be the one who brings people together, even if it sometimes feels one-sided.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          my friends are all incredibly progress- and career-driven. i admire that, but i hope we all see each other for more than just our career value. i want our friendships to be about more than what we achieve. i want us to celebrate the small moments, the spontaneous adventures, and the simple joy of being together.
        </motion.p>

        {/* Second gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-blue-100 via-yellow-100 to-red-200" />
        </motion.div>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i have been realizing that most things i enjoy doing are not meaningful without friends. that is a tough truth, but it is also an opportunity. now, i am growing some passions on my own—finding things that light me up, even when i am alone. i want people to discover me for who i am, not just for what i do or who i know.
        </motion.p>

        <motion.p
          className="font-light text-lg leading-relaxed"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i am excited for what is ahead. this may, i am embracing adventure, seeking out new opportunities, and learning to enjoy my own company. i am reaching out, not because i have to, but because i want to. and i am hopeful that the connections i am making—old and new—are deeper and more genuine than ever before.
        </motion.p>

        {/* Third gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-red-200 via-yellow-100 to-blue-100" />
        </motion.div>

        <motion.div
          className="mt-16 text-center text-xl font-light text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          here&apos;s to a may of purpose, friendship, and discovery.
        </motion.div>
      </motion.div>
    </div>
  );
} 