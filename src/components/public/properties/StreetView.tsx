"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface StreetViewProps {
  lat: number;
  lng: number;
  title?: string;
  heading?: number;
  pitch?: number;
  fov?: number;
  className?: string;
}

/**
 * Google Street View Component
 * Shows street-level imagery of the property location
 * Note: No API key required for basic embed usage
 */
export function StreetView({
  lat,
  lng,
  title = "Street View",
  heading = 0,
  pitch = 0,
  fov = 90,
  className = "",
}: StreetViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Build Street View embed URL
  const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${fov}`;

  // Alternative: Use static Street View image (no API key needed for basic usage)
  const staticStreetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${fov}&source=outdoor`;

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
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-sm font-body text-graphite">
          Street View not available for this location
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative bg-ink overflow-hidden ${className}`}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brass border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-graphite font-body text-sm">Loading Street View...</p>
          </div>
        </div>
      )}

      {/* Static Image as Fallback */}
      <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] bg-graphite">
        <img
          src={staticStreetViewUrl}
          alt={title}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full object-cover"
        />

        {/* Overlay with title */}
        {isLoaded && !error && (
          <div className="absolute bottom-4 left-4 bg-ink/80 backdrop-blur-sm px-4 py-2 border border-brass/30">
            <p className="text-white font-body text-xs flex items-center gap-2">
              <svg
                className="w-4 h-4 text-brass"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Street View • {title}
            </p>
          </div>
        )}

        {/* Info Badge */}
        {isLoaded && !error && (
          <div className="absolute top-4 right-4 bg-ink/80 backdrop-blur-sm px-3 py-1.5 border border-white/20">
            <p className="text-white/70 font-body text-xs">
              Approximate view
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Interactive Street View with Controls
 * Uses Google Maps embed (requires API key for full features)
 */
export function InteractiveStreetView({
  lat,
  lng,
  title = "Street View",
  apiKey,
  className = "",
}: StreetViewProps & { apiKey?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!apiKey) {
    // Fallback to static view if no API key
    return <StreetView lat={lat} lng={lng} title={title} className={className} />;
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=0&pitch=0&fov=90`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative bg-ink overflow-hidden ${className}`}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brass border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-body text-sm">Loading Street View...</p>
          </div>
        </div>
      )}

      {/* Interactive iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "400px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoaded(true)}
        title={title}
      />

      {/* Title Overlay */}
      {title && isLoaded && (
        <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-sm px-4 py-2 border border-brass/30 z-20">
          <h3 className="text-white font-display text-sm">{title}</h3>
        </div>
      )}
    </motion.div>
  );
}
