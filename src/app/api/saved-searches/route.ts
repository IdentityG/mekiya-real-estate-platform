import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedSearches } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const savedSearchSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  searchCriteria: z.object({
    q: z.string().optional(),
    propertyTypes: z.array(z.string()).optional(),
    listingType: z.enum(["sale", "rent"]).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    minSize: z.number().optional(),
    maxSize: z.number().optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    neighborhoods: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    furnished: z.boolean().optional(),
    verified: z.boolean().optional(),
  }),
  emailAlerts: z.boolean().default(false),
  alertFrequency: z.enum(["instant", "daily", "weekly"]).default("daily"),
});

// Get all saved searches for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searches = await db
      .select()
      .from(savedSearches)
      .where(eq(savedSearches.userId, Number(session.id)))
      .orderBy(desc(savedSearches.createdAt));

    return NextResponse.json({ searches });
  } catch (error) {
    console.error("Get saved searches error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve saved searches" },
      { status: 500 }
    );
  }
}

// Create a new saved search
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = savedSearchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, searchCriteria, emailAlerts, alertFrequency } = validation.data;

    // Check if user already has a search with this name
    const [existing] = await db
      .select()
      .from(savedSearches)
      .where(
        and(
          eq(savedSearches.userId, Number(session.id)),
          eq(savedSearches.name, name)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "You already have a saved search with this name" },
        { status: 409 }
      );
    }

    const [savedSearch] = await db
      .insert(savedSearches)
      .values({
        userId: Number(session.id),
        name,
        searchCriteria,
        emailAlerts,
        alertFrequency,
        lastAlertSent: emailAlerts ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ savedSearch }, { status: 201 });
  } catch (error) {
    console.error("Create saved search error:", error);
    return NextResponse.json(
      { error: "Failed to save search" },
      { status: 500 }
    );
  }
}

// Update a saved search
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Search ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(savedSearches)
      .where(
        and(
          eq(savedSearches.id, id),
          eq(savedSearches.userId, Number(session.id))
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Saved search not found" },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(savedSearches)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(savedSearches.id, id))
      .returning();

    return NextResponse.json({ savedSearch: updated });
  } catch (error) {
    console.error("Update saved search error:", error);
    return NextResponse.json(
      { error: "Failed to update search" },
      { status: 500 }
    );
  }
}

// Delete a saved search
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Search ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(savedSearches)
      .where(
        and(
          eq(savedSearches.id, Number(id)),
          eq(savedSearches.userId, Number(session.id))
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Saved search not found" },
        { status: 404 }
      );
    }

    await db.delete(savedSearches).where(eq(savedSearches.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete saved search error:", error);
    return NextResponse.json(
      { error: "Failed to delete search" },
      { status: 500 }
    );
  }
}
