"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getVideoProvider,
  getEmbedUrl,
  getVideoThumbnail,
} from "@/types/virtual-tours";

interface VideoTourPlayerProps {
  videoUrl: string;
  title?: string;
  thumbnail?: string | null;
  autoPlay?: boolean;
  className?: string;
}

export function VideoTourPlayer({
  videoUrl,
  title = "Video Tour",
  thumbnail,
  autoPlay = false,
  className = "",
}: VideoTourPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [error, setError] = useState(false);

  const provider = getVideoProvider(videoUrl);
  const embedUrl = getEmbedUrl(videoUrl);
  const autoThumbnail = getVideoThumbnail(videoUrl);
  const displayThumbnail = thumbnail || autoThumbnail;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div
        className={`bg-cream border border-ink/[0.06] p-8 text-center ${className}`}
      >
        <svg
          className="w-12 h-12 mx-auto mb-4 text-stone-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm font-body text-graphite">
          Failed to load video tour
        </p>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div
        className={`bg-cream border border-ink/[0.06] p-8 text-center ${className}`}
      >
        <svg
          className="w-12 h-12 mx-auto mb-4 text-stone-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm font-body text-graphite">
          Invalid video URL
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-ink overflow-hidden ${className}`}
    >
      <div className="relative w-full aspect-video">
        {!isPlaying && displayThumbnail ? (
          // Thumbnail with play button overlay
          <div className="relative w-full h-full">
            <img
              src={displayThumbnail}
              alt={title}
              className="w-full h-full object-cover"
              onError={handleError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play video"
            >
              <div className="w-20 h-20 rounded-full bg-brass/90 flex items-center justify-center group-hover:bg-brass group-hover:scale-110 transition-all duration-300 shadow-2xl">
                <svg
                  className="w-10 h-10 text-ink ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
            {title && (
              <div className="absolute bottom-4 left-4 bg-ink/80 backdrop-blur-sm px-4 py-2 border border-brass/30">
                <p className="text-white font-display text-sm">{title}</p>
              </div>
            )}
          </div>
        ) : (
          // Video player
          <div className="w-full h-full">
            {provider === "youtube" && (
              <iframe
                src={`${embedUrl}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title={title}
                onError={handleError}
              />
            )}

            {provider === "vimeo" && (
              <iframe
                src={`${embedUrl}?autoplay=${autoPlay ? 1 : 0}&title=0&byline=0&portrait=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title={title}
                onError={handleError}
              />
            )}

            {provider === "direct" && (
              <video
                src={embedUrl}
                controls
                autoPlay={autoPlay}
                className="w-full h-full"
                onError={handleError}
              >
                Your browser does not support the video tag.
              </video>
            )}

            {provider === "unknown" && (
              <div className="w-full h-full flex items-center justify-center bg-ink">
                <p className="text-white font-body text-sm">
                  Unsupported video format
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Provider badge */}
      {isPlaying && provider !== "direct" && provider !== "unknown" && (
        <div className="absolute top-4 right-4 bg-ink/80 backdrop-blur-sm px-3 py-1.5 border border-white/20">
          <p className="text-white/70 font-body text-xs uppercase tracking-wider">
            {provider}
          </p>
        </div>
      )}
    </motion.div>
  );
}
