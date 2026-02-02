"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoId?: string;
  className?: string;
}

export default function VideoPlayer({
  videoId = "klrrIiq9TyM",
  className,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full aspect-video rounded-xl border border-white/10 bg-[#0a0f18] overflow-hidden group shadow-2xl",
        className
      )}
    >
      {isPlaying ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Maxtest AI Demo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <div className="relative w-full h-full">
          {/* Thumbnail / Placeholder */}
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            {/* We can use a high-res youtube thumbnail if we want, or the abstract background we had */}
            {/* Using the abstract background from before for consistency, but maybe thumbnail is better */}
            {/* Let's try fetching the max res default thumbnail from youtube */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text/button visibility */}
          </div>

          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group-hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Play video"
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-all shadow-neon scale-100 group-hover:scale-110">
              <svg
                className="w-10 h-10 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
