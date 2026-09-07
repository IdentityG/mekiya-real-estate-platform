/**
 * Centralized image URLs with Pexels fallbacks
 * Replace these with your own uploaded images via Supabase Storage
 */

export const FALLBACK_IMAGES = {
  // Property types
  apartment: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  penthouse: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200",
  villa: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
  commercial: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1200",
  office: "https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=1200",
  
  // General images
  heroMain: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1600",
  aboutOffice: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
  neighborhoodBole: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  
  // Team/Agent placeholders
  agent1: "https://images.pexels.com/photos/31480550/pexels-photo-31480550.jpeg?auto=compress&cs=tinysrgb&w=800",
  agent2: "https://images.pexels.com/photos/5466267/pexels-photo-5466267.jpeg?auto=compress&cs=tinysrgb&w=800",
  agent3: "https://images.pexels.com/photos/36741892/pexels-photo-36741892.jpeg?auto=compress&cs=tinysrgb&w=800",
  agent4: "https://images.pexels.com/photos/5905901/pexels-photo-5905901.jpeg?auto=compress&cs=tinysrgb&w=800",
} as const;

// Export shorthand access
export const IMG = FALLBACK_IMAGES;
