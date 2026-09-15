/**
 * Virtual Tours & Enhanced Media Types
 */

export interface ConstructionTimelinePhase {
  date: string; // ISO date string
  phase: string; // e.g., "Foundation", "Framing", "Finishing"
  description: string;
  images?: string[]; // URLs to progress photos
  progress?: number; // 0-100 percentage
}

export type ConstructionStatus = "completed" | "under_construction" | "planned";

export interface VirtualTourData {
  virtualTour360Url?: string | null;
  videoTourUrl?: string | null;
  videoTourThumbnail?: string | null;
  streetViewEnabled?: boolean;
  constructionStatus?: ConstructionStatus | null;
  constructionTimeline?: ConstructionTimelinePhase[];
  completionDate?: Date | null;
}

export interface PropertyWithVirtualTours extends VirtualTourData {
  id: number;
  title: string;
  slug: string;
  // ... other property fields
}

// Video tour provider detection
export function getVideoProvider(url: string): "youtube" | "vimeo" | "direct" | "unknown" {
  if (!url) return "unknown";
  
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  
  if (url.includes("vimeo.com")) {
    return "vimeo";
  }
  
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return "direct";
  }
  
  return "unknown";
}

// Extract video ID from YouTube/Vimeo URLs
export function extractVideoId(url: string): string | null {
  if (!url) return null;

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) return youtubeMatch[1];

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) return vimeoMatch[1];

  return null;
}

// Get embed URL for video platforms
export function getEmbedUrl(url: string): string | null {
  const provider = getVideoProvider(url);
  const videoId = extractVideoId(url);

  if (!videoId) return url;

  switch (provider) {
    case "youtube":
      return `https://www.youtube.com/embed/${videoId}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${videoId}`;
    case "direct":
      return url;
    default:
      return null;
  }
}

// Get thumbnail URL for video platforms
export function getVideoThumbnail(url: string): string | null {
  const provider = getVideoProvider(url);
  const videoId = extractVideoId(url);

  if (!videoId) return null;

  switch (provider) {
    case "youtube":
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    case "vimeo":
      // Vimeo requires API call for thumbnail, return null for now
      return null;
    default:
      return null;
  }
}

// Calculate construction progress percentage from timeline
export function calculateConstructionProgress(
  timeline: ConstructionTimelinePhase[]
): number {
  if (!timeline || timeline.length === 0) return 0;

  const phasesWithProgress = timeline.filter(
    (phase) => typeof phase.progress === "number"
  );

  if (phasesWithProgress.length === 0) return 0;

  const totalProgress = phasesWithProgress.reduce(
    (sum, phase) => sum + (phase.progress || 0),
    0
  );

  return Math.round(totalProgress / phasesWithProgress.length);
}

// Get latest construction phase
export function getLatestPhase(
  timeline: ConstructionTimelinePhase[]
): ConstructionTimelinePhase | null {
  if (!timeline || timeline.length === 0) return null;

  return timeline.reduce((latest, current) => {
    const latestDate = new Date(latest.date);
    const currentDate = new Date(current.date);
    return currentDate > latestDate ? current : latest;
  });
}

// Format completion date
export function formatCompletionDate(date: Date | string | null): string {
  if (!date) return "Not specified";

  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  if (d < now) return "Completed";

  const monthsRemaining = Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (monthsRemaining <= 1) return "Completing soon";
  if (monthsRemaining <= 3) return `${monthsRemaining} months remaining`;
  if (monthsRemaining <= 12) return `${monthsRemaining} months remaining`;

  const years = Math.floor(monthsRemaining / 12);
  return `${years} ${years === 1 ? "year" : "years"} remaining`;
}
