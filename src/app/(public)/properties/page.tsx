import { db } from "@/db";
import { properties, neighborhoods } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Suspense } from "react";
import { PropertiesClient } from "@/components/public/properties/PropertiesClient";

export default async function PropertiesPage() {
  const allProperties = await db
    .select()
    .from(properties)
    .where(eq(properties.status, "published"))
    .orderBy(desc(properties.featured), desc(properties.createdAt));

  const hoods = await db.select().from(neighborhoods);

  const allAmenities = Array.from(
    new Set(allProperties.flatMap((p) => (Array.isArray(p.amenities) ? p.amenities : [])))
  ).sort();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linen pt-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-cream border border-ink/[0.06] animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <PropertiesClient
        properties={allProperties}
        neighborhoods={hoods.map((h) => h.name)}
        amenities={allAmenities}
      />
    </Suspense>
  );
}
