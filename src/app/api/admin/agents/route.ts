import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession, isStaff } from "@/lib/auth";
import { sql } from "drizzle-orm";

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
