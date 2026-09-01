import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { getSession, isStaff } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import slugify from "slugify";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allProps = await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt));
  return NextResponse.json(allProps);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = slugify(body.title || "property", { lower: true, strict: true }) +
      "-" + Date.now().toString(36);

    const [prop] = await db
      .insert(properties)
      .values({
        title: body.title,
        slug,
        propertyType: (body.propertyType === "commercial" ? "commercial" : "apartment") as "apartment" | "commercial",
        listingType: body.listingType || "sale",
        status: body.status || "draft",
        price: Number(body.price) || 0,
        currency: body.currency || "ETB",
        bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
        size: body.size ? Number(body.size) : null,
        description: body.description || null,
        address: body.address || null,
        city: body.city || "Addis Ababa",
        neighborhood: body.neighborhood || null,
        block: body.block || null,
        lat: body.lat ? Number(body.lat) : null,
        lng: body.lng ? Number(body.lng) : null,
        amenities: body.amenities || [],
        media: body.media || [],
        agentId: body.agentId ? Number(body.agentId) : session.userId,
        featured: body.featured || false,
        verified: body.verified || false,
        yearBuilt: body.yearBuilt ? Number(body.yearBuilt) : null,
        furnished: body.furnished || false,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      })
      .returning();

    return NextResponse.json(prop);
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const fields = [
      "title", "propertyType", "listingType", "status", "price",
      "bedrooms", "bathrooms", "size", "description", "address",
      "city", "neighborhood", "block", "amenities", "media", "featured",
      "verified", "furnished", "yearBuilt", "metaTitle", "metaDescription",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) {
        updateData[f] = body[f];
      }
    }

    const [prop] = await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, body.id))
      .returning();

    return NextResponse.json(prop);
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
