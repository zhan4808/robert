(()=>{var e={};e.id=985,e.ids=[985],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},9021:e=>{"use strict";e.exports=require("fs")},3873:e=>{"use strict";e.exports=require("path")},8006:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>f,routeModule:()=>m,serverHooks:()=>v,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>g});var r={};s.r(r),s.d(r,{PUT:()=>c});var o=s(2706),a=s(8203),i=s(5994),n=s(9021),l=s(9187),d=s(3873),u=s.n(d);async function c(e){try{let t=await e.json();if(!t.slug||!t.title||!t.description||!t.content)return l.NextResponse.json({error:"Missing required fields"},{status:400});let{slug:s,title:r,description:o,content:a,date:i,icon:d,song:c,songTitle:m,songArtist:p,songCover:g,colors:v}=t,f=u().join(process.cwd(),"app","blog");try{await n.promises.access(u().join(f,s))}catch(e){return l.NextResponse.json({error:`Blog post with slug "${s}" does not exist`},{status:404})}let x=`'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ImageIcon from '../../components/ImageIcon';

export default function ${r.replace(/\s+/g,"")}Post() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });
  
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const titleY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLooping]);
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleLoop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.loop = !isLooping;
    setIsLooping(!isLooping);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    audio.currentTime = percent * audio.duration;
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;
  };
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-r from-${v[0]}-400 via-${v[1]}-300 to-${v[2]}-300">
      <div className="relative min-h-screen bg-gradient-to-r from-${v[2]}-300 via-${v[3]}-400 to-${v[4]}-300">
        <div className="relative min-h-screen bg-gradient-to-r from-${v[4]}-300 via-${v[5]}-300 to-${v[0]}-400">
          <div 
            className="absolute w-full h-full opacity-70"
            style={{
              backgroundImage: 'url("/noise.png")',
              backgroundRepeat: 'repeat',
              mixBlendMode: 'overlay'
            }}
          />
          
          <audio ref={audioRef} src="${c}" loop={isLooping} />
          
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  src="${g}"
                  alt="${m} cover"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">${m}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">${p}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                onClick={togglePlayPause}
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
                className={\`w-8 h-8 flex items-center justify-center rounded-full \${isLooping ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}\`}
                onClick={toggleLoop}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.635 1.55C6.015 9.235 6.5 10.5 7 12a.5.5 0 00.5.5h5a.5.5 0 000-1H7.864c-.258-.693-.496-1.342-.635-2.05a2.95 2.95 0 01.507-2.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 max-w-[200px]">
              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer" onClick={handleProgressClick}>
                <div
                  className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
                  style={{ width: \`\${progress}%\` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-40">
            <div className="fixed top-6 left-6 z-50">
              <Link
                href="/blog"
                className="text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                back
              </Link>
            </div>
            
            <div className="fixed top-6 right-6 z-50">
              <div className="text-white bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                {new Date("${i}").toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            
            <motion.div
              className="relative max-w-3xl mx-auto text-center mb-20"
              style={{
                opacity: titleOpacity,
                scale: titleScale,
                y: titleY
              }}
            >
              <div className="mb-6 w-32 h-32 relative mx-auto">
                <ImageIcon src="${d}" borderGradient="true" />
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-4">${r}</h1>
              <h2 className="text-2xl font-light text-white/80">${o}</h2>
            </motion.div>
            
            <div className="max-w-2xl mx-auto prose prose-lg dark:prose-invert prose-p:text-gray-200 prose-headings:text-white">
              ${a.split("\n\n").map(e=>`<p>${e}</p>`).join("\n              ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;return await n.promises.writeFile(u().join(f,s,"page.tsx"),x),l.NextResponse.json({success:!0})}catch(e){return console.error("Error updating blog post:",e),l.NextResponse.json({error:"An unexpected error occurred"},{status:500})}}let m=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/blog/edit/route",pathname:"/api/blog/edit",filename:"route",bundlePath:"app/api/blog/edit/route"},resolvedPagePath:"/Users/robertzhang/Documents/GitHub/robert/app/api/blog/edit/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:p,workUnitAsyncStorage:g,serverHooks:v}=m;function f(){return(0,i.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:g})}},6487:()=>{},8335:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[638,452],()=>s(8006));module.exports=r})();