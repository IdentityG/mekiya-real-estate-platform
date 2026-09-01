import { db } from "@/db";
import { properties, users, neighborhoods } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminPropertiesClient } from "@/components/admin/AdminPropertiesClient";

export default async function AdminPropertiesPage() {
  const allProperties = await db
    .select({
      id: properties.id, title: properties.title, slug: properties.slug,
      propertyType: properties.propertyType, listingType: properties.listingType,
      status: properties.status, price: properties.price, currency: properties.currency,
      bedrooms: properties.bedrooms, bathrooms: properties.bathrooms, size: properties.size,
      neighborhood: properties.neighborhood, block: properties.block,
      address: properties.address, description: properties.description,
      amenities: properties.amenities, media: properties.media,
      featured: properties.featured, verified: properties.verified,
      views: properties.views, yearBuilt: properties.yearBuilt, furnished: properties.furnished,
      metaTitle: properties.metaTitle, metaDescription: properties.metaDescription,
      agentId: properties.agentId, agentName: users.name,
      createdAt: properties.createdAt,
    })
    .from(properties)
    .leftJoin(users, eq(properties.agentId, users.id))
    .orderBy(desc(properties.createdAt));

  const agents = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, "agent"));

  const hoods = await db.select({ name: neighborhoods.name }).from(neighborhoods);

  const allAmenities = Array.from(
    new Set(allProperties.flatMap((p) => (Array.isArray(p.amenities) ? p.amenities : [])))
  ).sort();

  return (
    <AdminPropertiesClient
      properties={allProperties}
      agents={agents}
      hoods={hoods.map((h) => h.name)}
      allAmenities={allAmenities}
    />
  );
}
