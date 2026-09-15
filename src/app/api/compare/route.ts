import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { inArray } from "drizzle-orm";

// Get properties for comparison
export async function POST(req: NextRequest) {
  try {
    const { propertyIds } = await req.json();

    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return NextResponse.json(
        { error: "Property IDs are required" },
        { status: 400 }
      );
    }

    if (propertyIds.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 properties can be compared" },
        { status: 400 }
      );
    }

    const compareProperties = await db
      .select()
      .from(properties)
      .where(inArray(properties.id, propertyIds));

    // Return properties in the same order as requested
    const orderedProperties = propertyIds
      .map(id => compareProperties.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({ properties: orderedProperties });
  } catch (error) {
    console.error("Compare properties error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties for comparison" },
      { status: 500 }
    );
  }
}
