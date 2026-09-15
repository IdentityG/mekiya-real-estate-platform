"use client";

import { VirtualTour360 } from "./VirtualTour360";
import { VirtualTourEmbed, detectVirtualTourType, getVirtualTourEmbedUrl } from "./VirtualTourEmbed";

interface VirtualTourViewerProps {
  tourUrl: string;
  title?: string;
  autoLoad?: boolean;
  className?: string;
}

/**
 * Smart Virtual Tour Viewer
 * Automatically detects the tour type and uses the appropriate viewer:
 * - Pannellum for 360° images (JPG, PNG)
 * - Iframe embed for Matterport, Kuula, 360Cities, etc.
 */
export function VirtualTourViewer({
  tourUrl,
  title,
  autoLoad = true,
  className = "",
}: VirtualTourViewerProps) {
  if (!tourUrl) {
    return (
      <div className={`bg-cream border border-ink/[0.06] p-8 text-center ${className}`}>
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
        <p className="text-sm font-body text-graphite">No virtual tour available</p>
      </div>
    );
  }

  const tourType = detectVirtualTourType(tourUrl);

  // Use Pannellum for 360° images
  if (tourType === "pannellum") {
    return (
      <VirtualTour360
        tourUrl={tourUrl}
        title={title}
        autoLoad={autoLoad}
        className={className}
      />
    );
  }

  // Use iframe embed for services like Matterport, Kuula, etc.
  const embedUrl = getVirtualTourEmbedUrl(tourUrl);

  return (
    <VirtualTourEmbed
      embedUrl={embedUrl}
      title={title}
      className={className}
    />
  );
}
