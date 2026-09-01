import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials, neighborhoods, siteSettings } from "@/db/schema";
import { getSession, isStaff, isAdmin } from "@/lib/auth";
import { desc, eq, asc } from "drizzle-orm";

async function guard(req: NextRequest): Promise<boolean> {
  const session = await getSession();
  return !!session && isStaff(session.role);
}

export async function GET(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const type = new URL(req.url).searchParams.get("type") ?? "testimonials";

  if (type === "testimonials") {
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return NextResponse.json(rows);
  }
  if (type === "neighborhoods") {
    const rows = await db.select().from(neighborhoods).orderBy(asc(neighborhoods.name));
    return NextResponse.json(rows);
  }
  const rows = await db.select().from(siteSettings);
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

export async function POST(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  try {
    if (body.kind === "testimonial") {
      const [row] = await db
        .insert(testimonials)
        .values({
          name: body.name,
          role: body.role || null,
          content: body.content,
          rating: Number(body.rating) || 5,
          featured: !!body.featured,
        })
        .returning();
      return NextResponse.json(row);
    }
    if (body.kind === "neighborhood") {
      const [row] = await db
        .insert(neighborhoods)
        .values({
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          avgPrice: body.avgPrice ? Number(body.avgPrice) : null,
          imageUrl: body.imageUrl || null,
          block: body.block || null,
        })
        .returning();
      return NextResponse.json(row);
    }
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  } catch (error) {
    console.error("Create content error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  try {
    if (body.kind === "testimonial" && body.id) {
      const [row] = await db
        .update(testimonials)
        .set({
          name: body.name,
          role: body.role || null,
          content: body.content,
          rating: Number(body.rating) || 5,
          featured: !!body.featured,
        })
        .where(eq(testimonials.id, body.id))
        .returning();
      return NextResponse.json(row);
    }
    if (body.kind === "neighborhood" && body.id) {
      const [row] = await db
        .update(neighborhoods)
        .set({
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          avgPrice: body.avgPrice ? Number(body.avgPrice) : null,
          imageUrl: body.imageUrl || null,
          block: body.block || null,
        })
        .where(eq(neighborhoods.id, body.id))
        .returning();
      return NextResponse.json(row);
    }
    if (body.kind === "setting" && body.key) {
      await db
        .insert(siteSettings)
        .values({ key: body.key, value: String(body.value ?? "") })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: String(body.value ?? "") } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown kind or missing id" }, { status: 400 });
  } catch (error) {
    console.error("Update content error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Super admin access required" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = Number(searchParams.get("id"));

  if (!type || !id) return NextResponse.json({ error: "type and id required" }, { status: 400 });

  if (type === "testimonial") await db.delete(testimonials).where(eq(testimonials.id, id));
  else if (type === "neighborhood") await db.delete(neighborhoods).where(eq(neighborhoods.id, id));
  else return NextResponse.json({ error: "Unknown type" }, { status: 400 });

  return NextResponse.json({ ok: true });
}
