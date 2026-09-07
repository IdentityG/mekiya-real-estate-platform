import { db } from "@/db";
import { properties } from "@/db/schema";
import { sql } from "drizzle-orm";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminPropertyTypesClient } from "@/components/admin/AdminPropertyTypesClient";

export default async function AdminPropertyTypesPage() {
  const session = await getSession();
  const canManage = !!session && isAdmin(session.role);

  // Get unique property types from properties table
  const typesResult = await db
    .select({ type: properties.propertyType })
    .from(properties)
    .groupBy(properties.propertyType);

  // Count properties per type
  const counts = await db
    .select({
      type: properties.propertyType,
      count: sql<number>`count(*)::int`,
    })
    .from(properties)
    .groupBy(properties.propertyType);

  // Hardcoded property types (since we're using enum)
  const knownTypes = [
    { 
      value: "apartment", 
      label: "Apartment",
      description: "Residential apartments and condominiums",
      count: counts.find(c => c.type === "apartment")?.count || 0
    },
    { 
      value: "commercial", 
      label: "Commercial",
      description: "Office spaces, retail, and business properties",
      count: counts.find(c => c.type === "commercial")?.count || 0
    },
  ];

  return <AdminPropertyTypesClient types={knownTypes} canManage={canManage} />;
}
