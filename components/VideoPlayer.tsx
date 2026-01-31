"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({
  src = "/videos/maxtest-demo.mp4",
  poster = "/images/video-poster.jpg",
  className,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Placeholder when no video source is provided
  if (!src) {
    return (
      <div
        className={cn(
          "relative w-full aspect-video rounded-xl border border-white/10 bg-[#0a0f18] overflow-hidden group shadow-2xl",
          className
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[80px] rounded-full" />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <svg
              className="w-10 h-10 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Demo Video Coming Soon</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full aspect-video rounded-xl border border-white/10 bg-[#0a0f18] overflow-hidden group shadow-2xl",
        className
      )}
    >
      <video
        className="w-full h-full object-cover"
        poster={poster}
        controls={isPlaying}
        onClick={() => setIsPlaying(true)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
          aria-label="Play video"
        >
          <div className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-all shadow-neon">
            <svg
              className="w-10 h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
