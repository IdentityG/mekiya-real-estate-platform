import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { neighborhoods, properties } from "@/db/schema";
import { getSession, isAdmin, isStaff } from "@/lib/auth";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const hoods = await db
      .select()
      .from(neighborhoods)
      .orderBy(neighborhoods.sortOrder, neighborhoods.name);

    return NextResponse.json(hoods);
  } catch (error) {
    console.error("Fetch neighborhoods error:", error);
    return NextResponse.json({ error: "Failed to fetch neighborhoods" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate slug from name
    const slug = body.slug || body.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check for duplicate slug
    const [existing] = await db
      .select()
      .from(neighborhoods)
      .where(eq(neighborhoods.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Neighborhood with this name already exists" }, { status: 409 });
    }

    const [newNeighborhood] = await db
      .insert(neighborhoods)
      .values({
        name: body.name,
        slug: slug,
        description: body.description || null,
        avgPrice: body.avgPrice ? parseFloat(body.avgPrice) : null,
        imageUrl: body.imageUrl || null,
        block: body.block || null,
        lat: body.lat ? parseFloat(body.lat) : null,
        lng: body.lng ? parseFloat(body.lng) : null,
        featured: body.featured !== false,
        sortOrder: body.sortOrder || 0,
      })
      .returning();

    return NextResponse.json(newNeighborhood, { status: 201 });
  } catch (error) {
    console.error("Create neighborhood error:", error);
    return NextResponse.json({ error: "Failed to create neighborhood" }, { status: 500 });
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

    if (body.name) update.name = body.name;
    if (body.description !== undefined) update.description = body.description || null;
    if (body.avgPrice !== undefined) update.avgPrice = body.avgPrice ? parseFloat(body.avgPrice) : null;
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl || null;
    if (body.block !== undefined) update.block = body.block || null;
    if (body.lat !== undefined) update.lat = body.lat ? parseFloat(body.lat) : null;
    if (body.lng !== undefined) update.lng = body.lng ? parseFloat(body.lng) : null;
    if (body.featured !== undefined) update.featured = body.featured;
    if (body.sortOrder !== undefined) update.sortOrder = body.sortOrder;

    const [updated] = await db
      .update(neighborhoods)
      .set(update)
      .where(eq(neighborhoods.id, body.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Neighborhood not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update neighborhood error:", error);
    return NextResponse.json({ error: "Failed to update neighborhood" }, { status: 500 });
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

    // Check if any properties use this neighborhood
    const [propertiesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(properties)
      .where(eq(properties.neighborhood, 
        (await db.select({ name: neighborhoods.name })
          .from(neighborhoods)
          .where(eq(neighborhoods.id, parseInt(id)))
          .limit(1))[0]?.name || ''
      ));

    if (propertiesCount.count > 0) {
      return NextResponse.json({ 
        error: `Cannot delete neighborhood. ${propertiesCount.count} properties are using it.` 
      }, { status: 400 });
    }

    await db
      .delete(neighborhoods)
      .where(eq(neighborhoods.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete neighborhood error:", error);
    return NextResponse.json({ error: "Failed to delete neighborhood" }, { status: 500 });
  }
}
