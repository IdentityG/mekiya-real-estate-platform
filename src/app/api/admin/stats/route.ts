import { NextResponse } from "next/server";
import { db } from "@/db";
import { properties, visitRequests, leads, users } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalListings] = await db.select({ count: count() }).from(properties);
    const [activeListings] = await db
      .select({ count: count() })
      .from(properties)
      .where(eq(properties.status, "published"));
    const [pendingVisits] = await db
      .select({ count: count() })
      .from(visitRequests)
      .where(eq(visitRequests.status, "pending"));
    const [totalLeads] = await db.select({ count: count() }).from(leads);
    const [totalAgents] = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.role} != 'public'`);

    // Leads by status
    const leadsByStatus = await db
      .select({
        status: leads.pipelineStatus,
        count: count(),
      })
      .from(leads)
      .groupBy(leads.pipelineStatus);

    // Properties by type
    const propsByType = await db
      .select({
        type: properties.propertyType,
        count: count(),
      })
      .from(properties)
      .groupBy(properties.propertyType);

    // Properties by status
    const propsByStatus = await db
      .select({
        status: properties.status,
        count: count(),
      })
      .from(properties)
      .groupBy(properties.status);

    return NextResponse.json({
      totalListings: totalListings.count,
      activeListings: activeListings.count,
      pendingVisits: pendingVisits.count,
      totalLeads: totalLeads.count,
      totalAgents: totalAgents.count,
      leadsByStatus,
      propsByType,
      propsByStatus,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
