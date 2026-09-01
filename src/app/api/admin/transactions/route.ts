import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, leads, visitRequests } from "@/db/schema";
import { getSession, isStaff } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const txs = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      currency: transactions.currency,
      method: transactions.method,
      status: transactions.status,
      reference: transactions.reference,
      createdAt: transactions.createdAt,
      leadName: leads.name,
      visitorName: visitRequests.name,
      leadId: transactions.leadId,
    })
    .from(transactions)
    .leftJoin(leads, eq(transactions.leadId, leads.id))
    .leftJoin(visitRequests, eq(transactions.visitRequestId, visitRequests.id))
    .orderBy(desc(transactions.createdAt));

  return NextResponse.json(txs);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const [tx] = await db
      .insert(transactions)
      .values({
        leadId: body.leadId ? Number(body.leadId) : null,
        amount: Number(body.amount) || 0,
        currency: body.currency || "ETB",
        method: body.method || "bank_transfer",
        status: body.status || "pending",
        reference: body.reference || `MANUAL-${Date.now().toString(36).toUpperCase()}`,
      })
      .returning();
    return NextResponse.json(tx);
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }
    const [updated] = await db
      .update(transactions)
      .set({ status: body.status })
      .where(eq(transactions.id, body.id))
      .returning();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
