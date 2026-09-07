import { db } from "@/db";
import { properties, propertyTypes } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminPropertyTypesClient } from "@/components/admin/AdminPropertyTypesClient";

export default async function AdminPropertyTypesPage() {
  const session = await getSession();
  const canManage = !!session && isAdmin(session.role);

  // Get property types from database
  const types = await db
    .select()
    .from(propertyTypes)
    .orderBy(propertyTypes.sortOrder, propertyTypes.label);

  // Count properties per type
  const counts = await db
    .select({
      type: properties.propertyType,
      count: sql<number>`count(*)::int`,
    })
    .from(properties)
    .groupBy(properties.propertyType);

  // Enrich types with property counts and ensure non-null values
  const enrichedTypes = types.map((type) => ({
    ...type,
    icon: type.icon || 'Building2',
    imageUrl: type.imageUrl || null,
    color: type.color || '#C4A96B',
    isActive: type.isActive ?? true,
    sortOrder: type.sortOrder ?? 0,
    count: counts.find((c) => c.type === type.value)?.count || 0,
  }));

  return <AdminPropertyTypesClient types={enrichedTypes} canManage={canManage} />;
}
