import { MetadataRoute } from "next";
import { db } from "@/db";
import { properties, neighborhoods } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/neighborhoods`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/financing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic property pages
  const publishedProperties = await db
    .select({
      slug: properties.slug,
      updatedAt: properties.updatedAt,
      featured: properties.featured,
    })
    .from(properties)
    .where(eq(properties.status, "published"));

  const propertyPages: MetadataRoute.Sitemap = publishedProperties.map((prop) => ({
    url: `${baseUrl}/properties/${prop.slug}`,
    lastModified: prop.updatedAt || new Date(),
    changeFrequency: "daily" as const,
    priority: prop.featured ? 0.9 : 0.7,
  }));

  // Dynamic neighborhood pages (if you add detail pages later)
  const allNeighborhoods = await db
    .select({
      slug: neighborhoods.slug,
      updatedAt: neighborhoods.updatedAt,
    })
    .from(neighborhoods);

  const neighborhoodPages: MetadataRoute.Sitemap = allNeighborhoods.map((hood) => ({
    url: `${baseUrl}/neighborhoods/${hood.slug}`,
    lastModified: hood.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...neighborhoodPages];
}
