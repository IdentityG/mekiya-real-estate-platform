import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/properties",
          "/properties/*",
          "/neighborhoods",
          "/neighborhoods/*",
          "/agents",
          "/services",
          "/about",
          "/contact",
          "/financing",
          "/careers",
          "/faq",
          "/sell",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/login",
          "/signup",
          "/_next",
          "/_next/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
