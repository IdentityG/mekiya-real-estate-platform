import { db } from "@/db";
import { properties, neighborhoods } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminNeighborhoodsClient } from "@/components/admin/AdminNeighborhoodsClient";

export default async function AdminNeighborhoodsPage() {
  const session = await getSession();
  const canManage = !!session && isAdmin(session.role);

  // Get neighborhoods from database
  const hoods = await db
    .select()
    .from(neighborhoods)
    .orderBy(neighborhoods.sortOrder, neighborhoods.name);

  // Count properties per neighborhood
  const counts = await db
    .select({
      neighborhood: properties.neighborhood,
      count: sql<number>`count(*)::int`,
    })
    .from(properties)
    .groupBy(properties.neighborhood);

  // Enrich neighborhoods with property counts
  const enrichedNeighborhoods = hoods.map((hood) => ({
    ...hood,
    propertyCount: counts.find((c) => c.neighborhood === hood.name)?.count || 0,
  }));

  return <AdminNeighborhoodsClient neighborhoods={enrichedNeighborhoods} canManage={canManage} />;
}
