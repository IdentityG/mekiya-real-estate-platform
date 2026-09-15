import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, notifications, users } from "@/db/schema";
import { eq, and, lte, sql } from "drizzle-orm";
import { getSession, isStaff } from "@/lib/auth";

// Set next follow-up date for a lead
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { leadId, followUpDate, note } = body;

    if (!leadId || !followUpDate) {
      return NextResponse.json(
        { error: "Lead ID and follow-up date required" },
        { status: 400 }
      );
    }

    // Update lead with follow-up date
    await db
      .update(leads)
      .set({
        nextFollowUpDate: new Date(followUpDate),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    // Add note if provided
    if (note) {
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      if (lead) {
        const currentNotes = (lead.notes as Array<{ date: string; text: string }>) || [];
        const newNotes = [
          ...currentNotes,
          {
            date: new Date().toISOString(),
            text: `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}: ${note}`,
          },
        ];

        await db
          .update(leads)
          .set({ notes: newNotes })
          .where(eq(leads.id, leadId));
      }
    }

    return NextResponse.json({
      success: true,
      message: "Follow-up scheduled",
    });
  } catch (error) {
    console.error("Schedule follow-up error:", error);
    return NextResponse.json(
      { error: "Failed to schedule follow-up" },
      { status: 500 }
    );
  }
}

// Get leads that need follow-up
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    // Get leads that need follow-up (due date is today or past)
    const whereConditions = [
      lte(leads.nextFollowUpDate, new Date()),
      sql`${leads.pipelineStatus} NOT IN ('closed_won', 'closed_lost')`,
    ];

    // Filter by agent if specified
    if (agentId) {
      whereConditions.push(eq(leads.assignedAgentId, parseInt(agentId)));
    }

    const results = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        phone: leads.phone,
        pipelineStatus: leads.pipelineStatus,
        leadScore: leads.leadScore,
        nextFollowUpDate: leads.nextFollowUpDate,
        lastActivityAt: leads.lastActivityAt,
        assignedAgentId: leads.assignedAgentId,
        agentName: users.name,
      })
      .from(leads)
      .leftJoin(users, eq(leads.assignedAgentId, users.id))
      .where(and(...whereConditions));

    return NextResponse.json({
      success: true,
      leads: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Get follow-ups error:", error);
    return NextResponse.json(
      { error: "Failed to get follow-ups" },
      { status: 500 }
    );
  }
}

// Send follow-up reminders (to be called by cron job)
export async function PUT(req: NextRequest) {
  try {
    // Verify this is called from a cron job or has proper authorization
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dev-secret";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all leads that need follow-up
    const leadsNeedingFollowUp = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        phone: leads.phone,
        assignedAgentId: leads.assignedAgentId,
        nextFollowUpDate: leads.nextFollowUpDate,
      })
      .from(leads)
      .where(
        and(
          lte(leads.nextFollowUpDate, new Date()),
          sql`${leads.pipelineStatus} NOT IN ('closed_won', 'closed_lost')`,
          sql`${leads.assignedAgentId} IS NOT NULL`
        )
      );

    let notificationsSent = 0;

    for (const lead of leadsNeedingFollowUp) {
      try {
        // Get agent info
        const [agent] = await db
          .select()
          .from(users)
          .where(eq(users.id, lead.assignedAgentId!))
          .limit(1);

        if (agent) {
          // Create in-app notification for agent
          await db.insert(notifications).values({
            recipientId: agent.id,
            type: "in_app",
            status: "pending",
            subject: "Follow-up Due",
            message: `Time to follow up with ${lead.name}. Last scheduled: ${lead.nextFollowUpDate?.toLocaleDateString()}`,
            metadata: {
              leadId: lead.id,
              leadName: lead.name,
              type: "follow_up_reminder",
            },
          });

          notificationsSent++;
        }
      } catch (err) {
        console.error(`Failed to send notification for lead ${lead.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      leadsProcessed: leadsNeedingFollowUp.length,
      notificationsSent,
    });
  } catch (error) {
    console.error("Send reminders error:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
