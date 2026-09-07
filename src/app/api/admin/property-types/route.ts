import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { propertyTypes } from "@/db/schema";
import { getSession, isAdmin } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const types = await db
      .select()
      .from(propertyTypes)
      .orderBy(propertyTypes.sortOrder, propertyTypes.label);

    return NextResponse.json(types);
  } catch (error) {
    console.error("Fetch property types error:", error);
    return NextResponse.json({ error: "Failed to fetch property types" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    
    if (!body.value || !body.label) {
      return NextResponse.json({ error: "Value and label are required" }, { status: 400 });
    }

    // Check for duplicate value
    const [existing] = await db
      .select()
      .from(propertyTypes)
      .where(eq(propertyTypes.value, body.value))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Property type with this value already exists" }, { status: 409 });
    }

    const [newType] = await db
      .insert(propertyTypes)
      .values({
        value: body.value.toLowerCase().replace(/\s+/g, '_'),
        label: body.label,
        description: body.description || null,
        icon: body.icon || 'Building2',
        imageUrl: body.imageUrl || null,
        color: body.color || '#C4A96B',
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== false,
      })
      .returning();

    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    console.error("Create property type error:", error);
    return NextResponse.json({ error: "Failed to create property type" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const update: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.label) update.label = body.label;
    if (body.description !== undefined) update.description = body.description || null;
    if (body.icon) update.icon = body.icon;
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl || null;
    if (body.color) update.color = body.color;
    if (body.sortOrder !== undefined) update.sortOrder = body.sortOrder;
    if (body.isActive !== undefined) update.isActive = body.isActive;

    const [updated] = await db
      .update(propertyTypes)
      .set(update)
      .where(eq(propertyTypes.id, body.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Property type not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update property type error:", error);
    return NextResponse.json({ error: "Failed to update property type" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db
      .delete(propertyTypes)
      .where(eq(propertyTypes.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete property type error:", error);
    return NextResponse.json({ error: "Failed to delete property type" }, { status: 500 });
  }
}
