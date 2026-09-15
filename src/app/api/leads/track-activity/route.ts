import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, leadActivities } from "@/db/schema";
import { eq } from "drizzle-orm";

// Track any lead activity (property views, searches, comparisons, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      activityType, // 'property_view' | 'property_favorite' | 'search' | 'compare_properties'
      propertyId,
      metadata,
    } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID required" },
        { status: 400 }
      );
    }

    // Track the activity
    await db.insert(leadActivities).values({
      leadId,
      activityType,
      propertyId: propertyId || null,
      metadata: metadata || {},
    });

    // Get current lead data
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // Calculate score increase based on activity
    const scoreMap: Record<string, number> = {
      property_view: 5,
      property_favorite: 10,
      search: 3,
      compare_properties: 8,
      visit_request: 20,
      agent_note: 0,
    };
    const scoreIncrease = scoreMap[activityType] || 0;

    const newScore = Math.min(100, (lead.leadScore || 0) + scoreIncrease);
    const newViewCount = activityType === "property_view" 
      ? (lead.viewCount || 0) + 1 
      : lead.viewCount;

    // Update lead
    await db
      .update(leads)
      .set({
        leadScore: newScore,
        viewCount: newViewCount,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    return NextResponse.json({
      success: true,
      leadId,
      newScore,
      viewCount: newViewCount,
    });
  } catch (error) {
    console.error("Track activity error:", error);
    return NextResponse.json(
      { error: "Failed to track activity" },
      { status: 500 }
    );
  }
}
