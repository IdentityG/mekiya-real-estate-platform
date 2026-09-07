import { db } from "@/db";
import { properties, users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/public/properties/PropertyDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
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

  return (
    <PropertyDetailClient
      property={propertyWithMedia}
      agent={agent}
      similarProperties={similar}
    />
  );
}
