import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, properties } from "@/db/schema";
import { getSession, isStaff } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allLeads = await db
    .select({
      id: leads.id,
      propertyId: leads.propertyId,
      propertyTitle: properties.title,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      leadType: leads.leadType,
      pipelineStatus: leads.pipelineStatus,
      source: leads.source,
      notes: leads.notes,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .leftJoin(properties, eq(leads.propertyId, properties.id))
    .orderBy(desc(leads.createdAt));

  return NextResponse.json(allLeads);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, pipelineStatus, assignedAgentId } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (pipelineStatus) update.pipelineStatus = pipelineStatus;
    if (assignedAgentId) update.assignedAgentId = Number(assignedAgentId);

    const [updated] = await db
      .update(leads)
      .set(update)
      .where(eq(leads.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
