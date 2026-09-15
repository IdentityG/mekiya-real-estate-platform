import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, leadActivities, notifications, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Track contact attempts (WhatsApp, Phone, Email)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      propertyId,
      contactType, // 'whatsapp' | 'phone' | 'email' | 'telegram'
      leadData, // For creating new lead if leadId not provided
    } = body;

    let finalLeadId = leadId;

    // If no leadId, create a new lead
    if (!finalLeadId && leadData) {
      const [newLead] = await db
        .insert(leads)
        .values({
          name: leadData.name,
          phone: leadData.phone || null,
          email: leadData.email || null,
          propertyId: propertyId || null,
          source: "website_contact",
          pipelineStatus: "new",
          leadScore: 20, // Initial score for contact attempt
          lastActivityAt: new Date(),
          viewCount: 1,
          whatsappOptIn: contactType === "whatsapp",
        })
        .returning();
      
      finalLeadId = newLead.id;
    }

    if (!finalLeadId) {
      return NextResponse.json(
        { error: "Lead ID or lead data required" },
        { status: 400 }
      );
    }

    // Track the activity
    const activityTypeMap = {
      whatsapp: "contact_whatsapp",
      phone: "contact_phone",
      email: "contact_email",
      telegram: "contact_whatsapp", // Use same type
    } as const;

    await db.insert(leadActivities).values({
      leadId: finalLeadId,
      activityType: activityTypeMap[contactType as keyof typeof activityTypeMap] || "contact_phone",
      propertyId: propertyId || null,
      metadata: {
        contactType,
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get("user-agent") || "",
      },
    });

    // Update lead score and last activity
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, finalLeadId))
      .limit(1);

    const newScore = Math.min(100, (lead.leadScore || 0) + 15); // +15 points for contact

    await db
      .update(leads)
      .set({
        leadScore: newScore,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, finalLeadId));

    // Notify assigned agent (if any)
    if (lead.assignedAgentId) {
      const [agent] = await db
        .select()
        .from(users)
        .where(eq(users.id, lead.assignedAgentId))
        .limit(1);

      if (agent) {
        const contactLabelMap: Record<string, string> = {
          whatsapp: "WhatsApp",
          phone: "Phone",
          email: "Email",
          telegram: "Telegram",
        };
        const contactLabel = contactLabelMap[contactType] || "Contact";

        await db.insert(notifications).values({
          recipientId: agent.id,
          type: "in_app",
          status: "pending",
          subject: `Lead contacted via ${contactLabel}`,
          message: `${lead.name} just initiated contact via ${contactLabel}. Lead score: ${newScore}/100`,
          metadata: {
            leadId: finalLeadId,
            propertyId: propertyId,
            contactType,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      leadId: finalLeadId,
      newScore,
      message: "Contact tracked successfully",
    });
  } catch (error) {
    console.error("Track contact error:", error);
    return NextResponse.json(
      { error: "Failed to track contact" },
      { status: 500 }
    );
  }
}
