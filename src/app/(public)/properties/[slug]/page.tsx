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

  // Get agent info
  let agent = null;
  if (property.agentId) {
    const [a] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        specialty: users.specialty,
        bio: users.bio,
      })
      .from(users)
      .where(eq(users.id, property.agentId))
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
        eq(properties.propertyType, property.propertyType),
        ne(properties.id, property.id)
      )
    )
    .limit(3);

  // Increment view count (fire and forget)
  db.update(properties)
    .set({ views: (property.views || 0) + 1 })
    .where(eq(properties.id, property.id))
    .then(() => {});

  return (
    <PropertyDetailClient
      property={property}
      agent={agent}
      similarProperties={similar}
    />
  );
}
