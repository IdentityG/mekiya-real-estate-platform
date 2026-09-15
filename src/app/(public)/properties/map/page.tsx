import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PropertiesMapClient } from "@/components/public/maps/PropertiesMapClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Map View",
  description: "Explore properties in Addis Ababa on an interactive map",
};

// Force dynamic rendering since this uses client-side map libraries
export const dynamic = 'force-dynamic';

export default async function PropertiesMapPage() {
  // Get all published properties with coordinates
  const allProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      slug: properties.slug,
      price: properties.price,
      currency: properties.currency,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      size: properties.size,
      propertyType: properties.propertyType,
      listingType: properties.listingType,
      neighborhood: properties.neighborhood,
      lat: properties.lat,
      lng: properties.lng,
      featured: properties.featured,
      media: properties.media,
    })
    .from(properties)
    .where(eq(properties.status, "published"));

  // Ensure media is always an array
  const propertiesWithMedia = allProperties.map(p => ({
    ...p,
    media: Array.isArray(p.media) ? p.media : [],
  }));

  return <PropertiesMapClient properties={propertiesWithMedia} />;
}
