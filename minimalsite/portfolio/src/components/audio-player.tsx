"use client";

import { useEffect, useRef, useState } from "react";
import type { JournalTrack } from "@/lib/data";

interface AudioPlayerProps {
  tracks: JournalTrack[];
}

export function AudioPlayer({ tracks }: AudioPlayerProps) {
  const playableTracks = tracks.filter((track) => track.audioSrc);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = playableTracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (playableTracks.length > 1) {
        setTrackIndex((prev) => (prev + 1) % playableTracks.length);
        setIsPlaying(true);
      } else if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isLooping, playableTracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.play();
    }
  }, [trackIndex, isPlaying]);

  if (playableTracks.length === 0) {
    return null;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const toggleLoop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextLoop = !isLooping;
    audio.loop = nextLoop;
    setIsLooping(nextLoop);
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const nextTime = ratio * duration;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        {currentTrack.albumArt && (
          <img
            src={currentTrack.albumArt}
            alt={`${currentTrack.title} album art`}
            className="h-14 w-14 rounded-md object-cover"
          />
        )}
        <div className="flex-1 min-w-[160px]">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            now playing
          </p>
          <p className="font-medium">{currentTrack.title}</p>
          <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          {playableTracks.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setTrackIndex((prev) =>
                  prev === 0 ? playableTracks.length - 1 : prev - 1
                )
              }
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Prev
            </button>
          )}
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={toggleLoop}
            className={`rounded-full border border-border px-3 py-1 text-xs transition-colors ${
              isLooping ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Loop
          </button>
          {playableTracks.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setTrackIndex((prev) => (prev + 1) % playableTracks.length)
              }
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div
        ref={progressRef}
        onClick={handleSeek}
        className="mt-4 h-1 w-full cursor-pointer rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-[hsl(var(--link))]"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <audio ref={audioRef} src={currentTrack.audioSrc} preload="metadata" />
    </div>
  );
}
