import { db } from "@/db";
import { neighborhoods, properties } from "@/db/schema";
import { count, eq, desc, sql } from "drizzle-orm";
import { NeighborhoodsClient } from "@/components/public/neighborhoods/NeighborhoodsClient";

export const metadata = {
  title: "Neighborhoods — Mekiya Real Estate",
};

export default async function NeighborhoodsPage() {
  // Fetch all neighborhoods, ordered by featured first, then sort order
  const hoods = await db
    .select()
    .from(neighborhoods)
    .orderBy(desc(neighborhoods.featured), neighborhoods.sortOrder, neighborhoods.name);

  // Get property counts per neighborhood
  const propCounts = await db
    .select({ neighborhood: properties.neighborhood, count: count() })
    .from(properties)
    .where(eq(properties.status, "published"))
    .groupBy(properties.neighborhood);

  // Enrich with listing counts
  const withCounts = hoods.map((h) => ({
    ...h,
    listingCount:
      propCounts.find((p) => p.neighborhood?.toLowerCase() === h.name.toLowerCase())?.count ?? 0,
  }));

  return <NeighborhoodsClient neighborhoods={withCounts} />;
}
