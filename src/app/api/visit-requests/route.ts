import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { visitRequests } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, name, email, phone, requestedDate, requestedTime, message } = body;

    if (!propertyId || !name || !email || !requestedDate) {
      return NextResponse.json(
        { error: "Property ID, name, email, and date are required" },
        { status: 400 }
      );
    }

    const [visit] = await db
      .insert(visitRequests)
      .values({
        propertyId,
        name,
        email,
        phone: phone || null,
        requestedDate,
        requestedTime: requestedTime || null,
        message: message || null,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ success: true, visit });
  } catch (error) {
    console.error("Visit request error:", error);
    return NextResponse.json(
      { error: "Failed to create visit request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const visits = await db
      .select()
      .from(visitRequests)
      .orderBy(desc(visitRequests.createdAt));
    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch visit requests" },
      { status: 500 }
    );
  }
}
