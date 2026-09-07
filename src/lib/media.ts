// Centralized media assets — real photography, videos, and 3D tour mappings

export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/10135086/10135086-uhd_3840_2160_30fps.mp4";

export const SKYLINE_VIDEO =
  "https://videos.pexels.com/video-files/12197806/12197806-uhd_3840_2160_24fps.mp4";

export const TOUR_VIDEOS = [
  "https://videos.pexels.com/video-files/7578546/7578546-uhd_3840_2160_30fps.mp4",
  "https://videos.pexels.com/video-files/7578545/7578545-uhd_3840_2160_30fps.mp4",
  "https://videos.pexels.com/video-files/39024321/16605501_3840_2160_30fps.mp4",
];

// Placeholder images from Pexels (external URLs as fallback)
const FALLBACK_IMAGES: Record<string, string> = {
  apartment: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  commercial: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

// Default fallback for any property type
const DEFAULT_FALLBACK = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200";

export function getPropertyImages(slug: string, type: string): string[] {
  // Return fallback image based on property type
  return [FALLBACK_IMAGES[type] || DEFAULT_FALLBACK];
}

export function getPropertyImage(slug: string, type: string): string {
  return getPropertyImages(slug, type)[0];
}

export function getTourVideo(id: number): string {
  return TOUR_VIDEOS[id % TOUR_VIDEOS.length];
}
