import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, leadType, source, message, propertyId } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const notes = message
      ? [{ date: new Date().toISOString().split("T")[0], text: message }]
      : [];

    const [lead] = await db
      .insert(leads)
      .values({
        propertyId: propertyId || null,
        name,
        email,
        phone: phone || null,
        leadType: leadType || "general",
        pipelineStatus: "new",
        source: source || "website",
        notes,
      })
      .returning();

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Lead error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));
    return NextResponse.json(allLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
