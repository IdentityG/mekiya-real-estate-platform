import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { visitRequests, properties } from "@/db/schema";
import { getSession, isStaff } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const visits = await db
    .select({
      id: visitRequests.id,
      propertyId: visitRequests.propertyId,
      propertyTitle: properties.title,
      name: visitRequests.name,
      email: visitRequests.email,
      phone: visitRequests.phone,
      requestedDate: visitRequests.requestedDate,
      requestedTime: visitRequests.requestedTime,
      message: visitRequests.message,
      status: visitRequests.status,
      createdAt: visitRequests.createdAt,
    })
    .from(visitRequests)
    .leftJoin(properties, eq(visitRequests.propertyId, properties.id))
    .orderBy(desc(visitRequests.createdAt));

  return NextResponse.json(visits);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, assignedAgentId } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }

    const update: Record<string, unknown> = { status, updatedAt: new Date() };
    if (assignedAgentId) update.assignedAgentId = Number(assignedAgentId);

    const [updated] = await db
      .update(visitRequests)
      .set(update)
      .where(eq(visitRequests.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update visit error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
