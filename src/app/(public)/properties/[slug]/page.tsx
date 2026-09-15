import { db } from "@/db";
import { properties, users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation.js";
import { PropertyDetailClient } from "@/components/public/properties/PropertyDetailClient";
import type { Metadata } from "next";
import { generatePropertySchema, generateBreadcrumbSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.slug, slug))
    .limit(1);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com";
  const propertyUrl = `${baseUrl}/properties/${slug}`;
  const images = Array.isArray(property.media) && property.media.length > 0
    ? property.media
    : [`${baseUrl}/og-image.jpg`];

  return {
    title: property.title,
    description: property.description || `${property.propertyType} for ${property.listingType} in ${property.neighborhood || property.city}`,
    keywords: [
      property.propertyType,
      property.listingType,
      property.neighborhood || "",
      property.city || "Addis Ababa",
      "Ethiopia property",
      "real estate",
    ].filter(Boolean),
    openGraph: {
      title: property.title,
      description: property.description || `${property.propertyType} for ${property.listingType}`,
      url: propertyUrl,
      type: "website",
      images: images.map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: property.title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.description || `${property.propertyType} for ${property.listingType}`,
      images: images,
    },
    alternates: {
      canonical: propertyUrl,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.slug, slug))
    .limit(1);

  if (!property) notFound();

  // Ensure media is an array
  const propertyWithMedia = {
    ...property,
    media: Array.isArray(property.media) ? property.media : [],
  };

  // Get agent info
  let agent = null;
  if (propertyWithMedia.agentId) {
    const [a] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        whatsappPhone: users.whatsappPhone,
        telegramUsername: users.telegramUsername,
        specialty: users.specialty,
        bio: users.bio,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, propertyWithMedia.agentId))
      .limit(1);
    agent = a || null;
  }

  // Get similar properties
  const similar = await db
    .select()
    .from(properties)
    .where(
      and(
        eq(properties.status, "published"),
        eq(properties.propertyType, propertyWithMedia.propertyType),
        ne(properties.id, propertyWithMedia.id)
      )
    )
    .limit(3);

  // Increment view count (fire and forget)
  db.update(properties)
    .set({ views: (propertyWithMedia.views || 0) + 1 })
    .where(eq(properties.id, propertyWithMedia.id))
    .then(() => {});

  // Generate structured data
  const baseUrl = process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com";
  const propertySchema = generatePropertySchema({
    name: property.title,
    description: property.description || "",
    price: property.price,
    currency: property.currency,
    address: property.address || "",
    city: property.city || "Addis Ababa",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    images: propertyWithMedia.media,
    url: `${baseUrl}/properties/${slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Properties", url: `${baseUrl}/properties` },
    { name: property.title, url: `${baseUrl}/properties/${slug}` },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <PropertyDetailClient
        property={propertyWithMedia}
        agent={agent}
        similarProperties={similar}
      />
    </>
  );
}
