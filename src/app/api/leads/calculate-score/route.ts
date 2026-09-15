import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, leadActivities } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/auth";

// Recalculate lead score based on all activities
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID required" },
        { status: 400 }
      );
    }

    // Get lead
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

    // Get all activities in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await db
      .select()
      .from(leadActivities)
      .where(
        and(
          eq(leadActivities.leadId, leadId),
          gte(leadActivities.createdAt, thirtyDaysAgo)
        )
      );

    // Calculate score based on activities
    let score = 0;

    // Activity scoring
    const activityCounts = {
      property_view: 0,
      property_favorite: 0,
      contact_whatsapp: 0,
      contact_phone: 0,
      contact_email: 0,
      visit_request: 0,
      search: 0,
      compare_properties: 0,
    };

    activities.forEach((activity) => {
      const type = activity.activityType as keyof typeof activityCounts;
      if (type in activityCounts) {
        activityCounts[type]++;
      }
    });

    // Scoring logic
    score += Math.min(20, activityCounts.property_view * 2); // Max 20 points
    score += Math.min(15, activityCounts.property_favorite * 5); // Max 15 points
    score += Math.min(25, activityCounts.contact_whatsapp * 15); // Max 25 points
    score += Math.min(20, activityCounts.contact_phone * 15); // Max 20 points
    score += Math.min(15, activityCounts.contact_email * 10); // Max 15 points
    score += Math.min(30, activityCounts.visit_request * 20); // Max 30 points
    score += Math.min(10, activityCounts.search * 2); // Max 10 points
    score += Math.min(15, activityCounts.compare_properties * 5); // Max 15 points

    // Recency bonus (visited in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = activities.some(
      (a) => new Date(a.createdAt) > sevenDaysAgo
    );
    if (recentActivity) {
      score += 10;
    }

    // Pipeline status bonus
    const statusBonus = {
      new: 0,
      contacted: 5,
      visit_scheduled: 15,
      negotiating: 20,
      closed_won: 0,
      closed_lost: -50,
    };
    score += statusBonus[lead.pipelineStatus as keyof typeof statusBonus] || 0;

    // Cap at 100
    score = Math.min(100, Math.max(0, score));

    // Update lead
    await db
      .update(leads)
      .set({
        leadScore: score,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    return NextResponse.json({
      success: true,
      leadId,
      newScore: score,
      activityCounts,
      recentActivity,
    });
  } catch (error) {
    console.error("Calculate score error:", error);
    return NextResponse.json(
      { error: "Failed to calculate score" },
      { status: 500 }
    );
  }
}

// Bulk recalculate scores for all leads
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active leads
    const allLeads = await db
      .select()
      .from(leads)
      .where(
        and(
          sql`${leads.pipelineStatus} != 'closed_won'`,
          sql`${leads.pipelineStatus} != 'closed_lost'`
        )
      );

    let updated = 0;

    for (const lead of allLeads) {
      try {
        // Trigger score recalculation
        await fetch(`${req.nextUrl.origin}/api/leads/calculate-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id }),
        });
        updated++;
      } catch (err) {
        console.error(`Failed to update lead ${lead.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      totalLeads: allLeads.length,
      updated,
    });
  } catch (error) {
    console.error("Bulk calculate error:", error);
    return NextResponse.json(
      { error: "Failed to bulk calculate scores" },
      { status: 500 }
    );
  }
}
