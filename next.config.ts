import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      // Supabase Storage - allow all subdomains for flexibility
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
