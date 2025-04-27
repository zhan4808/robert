'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import ImageIcon from '../../components/ImageIcon';

export default function CollegePost() {
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
      <audio ref={audioRef} src="/charcoalbaby.mp3" preload="metadata" loop={isLooping} />
      
      {/* Reading progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 z-50"
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
              src="/oai3.jpg"
              size="lg"
              borderGradient="from-pink-200 via-rose-300 to-orange-200"
              withHoverEffect={true}
              alt="College post icon"
            />
          </div>
          
          <div>
            <motion.h1 
              className="text-3xl font-semibold mb-2 text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              college
            </motion.h1>
            
            <motion.h2
              className="text-xl mb-3 text-gray-600 dark:text-gray-400 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              unexpected friends and experiences
            </motion.h2>
            
            <motion.div
              className="text-sm text-gray-500 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              April 14, 2025
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
                    src="/charcoalbaby.jpg" 
                    alt="Charcoal Baby - Blood Orange" 
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
                  charcoal baby
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  blood orange
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
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40' 
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
                  className="h-full bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full" 
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
          <GrainyGradient colorClass="bg-gradient-to-r from-pink-400 via-rose-300 to-orange-300" />
        </motion.div>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          this past semester has been nothing short of transformative. i've met so many incredible people who've expanded my world in ways i never expected. startup founders with audacious visions, industry leaders who somehow make time to mentor, and classmates who are both terrifyingly brilliant and refreshingly down-to-earth. it's humbling and exhilarating all at once.
        </motion.p>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          one weekend, i ended up on an impromptu trip with people i barely knew from my econ class. we stayed in this tiny cabin upstate, and somehow between hiking mishaps and late-night conversations, these strangers became friends i now text daily. there's something about seeing people outside the classroom context—away from the polished performances we all put on—that accelerates closeness in ways that feel almost magical.
        </motion.p>
        
        <motion.div 
          className="my-12 py-6 px-8 border-l-4 border-indigo-300 bg-gray-50 dark:bg-gray-800/40"
          initial={{ opacity: 0, x: -5 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl italic font-light text-gray-700 dark:text-gray-300">
            "what connects us isn't just our ambitions but the moments we admit we're struggling to reach them."
          </p>
        </motion.div>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i've discovered pockets of creativity i didn't know existed on campus. a fashion collective that puts on guerrilla runway shows in unexpected campus locations. a group of art students who sneak onto rooftops to draw the cityscape at sunset. runners who meet at 5am and somehow make it seem fun rather than torturous. each community has its own language, inside jokes, and rituals that make being part of it feel special.
        </motion.p>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          what's fascinating is the undercurrent of "duck syndrome" that connects us all—we're gliding seemingly effortlessly on the surface while paddling frantically underneath. it's weirdly comforting when someone i admire admits they're struggling too. the most profound bonding happens in those moments of vulnerability, when the façade cracks and we acknowledge how hard we're all working to stay afloat.
        </motion.p>
        
        {/* Second grainy gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-orange-300 via-rose-300 to-pink-400" />
        </motion.div>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          there's something powerful about being surrounded by people who are unapologetically pursuing their passions. my roommate who codes until 3am because she's building something she believes in. the guy from my writing workshop who's already published two sci-fi novellas. the international student who's creating a platform to connect rural artisans from her home country with global markets. their drive doesn't make me feel inadequate; it ignites something in me.
        </motion.p>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={6}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i find myself wanting to match their energy, to contribute something meaningful. it's not competitive in a toxic way—it's this collective current pushing us all forward. when one person breaks through, achieves something remarkable, it expands our sense of what's possible. their success becomes proof that the rest of us can reach our goals too, even if those goals look completely different.
        </motion.p>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={7}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          we've created these core rituals that keep us grounded—weekly dinners where phones are banned, spontaneous study sessions that inevitably devolve into philosophical debates, celebrations for even minor victories. these shared experiences form a safety net. when imposter syndrome hits hard (which it does, regularly), there's always someone who can remind you of what you've already accomplished and why you belong here.
        </motion.p>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={8}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          i'm learning that being humbled by exceptional peers doesn't have to diminish me—it can actually expand my vision for myself. there's this quote i keep coming back to: "surround yourself with people who make you uncomfortable with settling for less." that's what this semester has given me—a community that simultaneously accepts me exactly as i am and inspires me to become more.
        </motion.p>
        
        {/* Third grainy gradient */}
        <motion.div
          className="w-full h-40 rounded-lg overflow-hidden my-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GrainyGradient colorClass="bg-gradient-to-r from-rose-300 via-pink-400 to-orange-300" />
        </motion.div>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={9}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          there are days when i wonder if i belong among these incredible people. days when the gap between where i am and where i want to be feels impossibly wide. but then i remember that everyone starts somewhere, and that even the most accomplished people i've met are still works in progress themselves. we're all just at different points on similar journeys.
        </motion.p>
        
        <motion.p 
          className="font-light text-lg leading-relaxed"
          custom={10}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          as the semester ends, i'm grateful not just for what i've learned in classrooms, but for these unexpected connections that have shaped me. for late-night conversations that helped clarify my own dreams. for witnessing peers overcome obstacles that once seemed insurmountable. for finding a community that celebrates ambition while acknowledging vulnerability. college isn't just about building a resume—it's about building a constellation of relationships that illuminate possibilities i couldn't have imagined on my own.
        </motion.p>
      </motion.div>
    </div>
  );
} 