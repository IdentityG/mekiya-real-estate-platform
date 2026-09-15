"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface VirtualTourEmbedProps {
  embedUrl: string;
  title?: string;
  className?: string;
}

/**
 * Generic iframe-based virtual tour embed
 * Supports: Matterport, Kuula, 360Cities, and other embed services
 */
export function VirtualTourEmbed({
  embedUrl,
  title = "Virtual Tour",
  className = "",
}: VirtualTourEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
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
          Failed to load virtual tour
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
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brass border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-body text-sm">Loading virtual tour...</p>
          </div>
        </div>
      )}

      {/* Iframe Embed */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="xr-spatial-tracking; gyroscope; accelerometer"
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
        title={title}
      />

      {/* Title Overlay */}
      {title && isLoaded && (
        <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-sm px-4 py-2 border border-brass/30 z-20">
          <h3 className="text-white font-display text-lg">{title}</h3>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Detect if URL is a supported embed service
 */
export function detectVirtualTourType(
  url: string
): "matterport" | "kuula" | "360cities" | "pannellum" | "iframe" | "unknown" {
  if (!url) return "unknown";

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("matterport.com")) return "matterport";
  if (lowerUrl.includes("kuula.co")) return "kuula";
  if (lowerUrl.includes("360cities.net")) return "360cities";
  if (lowerUrl.match(/\.(jpg|jpeg|png)$/i)) return "pannellum";

  // Check if it's already an embed URL
  if (lowerUrl.includes("/embed/") || lowerUrl.includes("&embedded=true")) {
    return "iframe";
  }

  return "unknown";
}

/**
 * Convert regular URL to embed URL for supported services
 */
export function getVirtualTourEmbedUrl(url: string): string {
  const type = detectVirtualTourType(url);

  switch (type) {
    case "matterport":
      // Extract model ID and convert to embed URL
      const matterportMatch = url.match(/show\/\?m=([a-zA-Z0-9]+)/);
      if (matterportMatch) {
        return `https://my.matterport.com/show/?m=${matterportMatch[1]}&play=1`;
      }
      return url;

    case "kuula":
      // Kuula URLs usually work as-is or need /embed/ prefix
      if (!url.includes("/embed/")) {
        return url.replace("/posts/", "/embed/");
      }
      return url;

    case "360cities":
      // 360Cities embed format
      if (!url.includes("/embed/")) {
        return url.replace("360cities.net/", "360cities.net/embed/");
      }
      return url;

    default:
      return url;
  }
}
