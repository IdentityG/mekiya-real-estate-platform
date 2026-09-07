import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession, isAdmin, isStaff } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agents = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phone: users.phone,
      specialty: users.specialty,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(sql`${users.role} != 'public'`);

  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Super admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }

    const [existing] = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const [user] = await db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
        passwordHash: await hashPassword(body.password),
        role: body.role === "super_admin" ? "sales_manager" : (body.role === "agent" ? "agent" : "sales_manager"),
        phone: body.phone || null,
        specialty: body.specialty || null,
        bio: body.bio || null,
        avatarUrl: body.avatarUrl || null,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
        specialty: users.specialty,
      });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "Super admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (body.name) update.name = body.name;
    if (body.email) update.email = body.email;
    if (body.phone !== undefined) update.phone = body.phone || null;
    if (body.specialty !== undefined) update.specialty = body.specialty || null;
    if (body.bio !== undefined) update.bio = body.bio || null;
    if (body.avatarUrl !== undefined) update.avatarUrl = body.avatarUrl || null;
    if (body.role && body.role !== "super_admin") update.role = body.role;
    update.updatedAt = new Date();

    const [updated] = await db.update(users).set(update).where(eq(users.id, body.id)).returning({
      id: users.id, name: users.name, email: users.email, role: users.role,
      phone: users.phone, specialty: users.specialty,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}
