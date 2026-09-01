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

// Local generated images per property type
export const TYPE_IMAGES: Record<string, string> = {
  apartment: "/images/prop-apartment.jpg",
  commercial: "/images/prop-commercial.jpg",
};

// Specific hero images by slug for the seeded CMC properties
export const SLUG_IMAGES: Record<string, string[]> = {
  "apartment-cmc-block-9": ["/images/prop-apartment.jpg"],
  "apartment-cmc-block-10": ["/images/prop-apartment.jpg"],
  "apartment-cmc-block-11": ["/images/prop-penthouse.jpg"],
  "apartment-sarbet": ["/images/prop-apartment.jpg"],
  "apartment-bole-atlas": ["/images/prop-apartment.jpg"],
  "apartment-cmc-block-8": ["/images/prop-penthouse.jpg", "/images/hero-main.jpg"],
  "commercial-bole-road": ["/images/prop-commercial.jpg", "/images/hero-main.jpg"],
  "commercial-cmc-plaza": ["/images/prop-commercial.jpg"],
  "commercial-medical-cmc-9": ["/images/prop-commercial.jpg"],
  "commercial-coworking-sarbet": ["/images/prop-office.jpg"],
  "commercial-showroom-bole": ["/images/prop-commercial.jpg"],
};

export function getPropertyImages(slug: string, type: string): string[] {
  if (SLUG_IMAGES[slug]?.length) return SLUG_IMAGES[slug];
  return [TYPE_IMAGES[type] || "/images/prop-apartment.jpg"];
}

export function getPropertyImage(slug: string, type: string): string {
  return getPropertyImages(slug, type)[0];
}

export function getTourVideo(id: number): string {
  return TOUR_VIDEOS[id % TOUR_VIDEOS.length];
}
