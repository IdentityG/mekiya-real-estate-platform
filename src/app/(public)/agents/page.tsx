import { db } from "@/db";
import { users, properties } from "@/db/schema";
import { count, sql, eq } from "drizzle-orm";
import { AgentsClient } from "@/components/public/agents/AgentsClient";

export const metadata = { title: "Our Agents — Mekiya Real Estate" };

export default async function AgentsPage() {
  const staff = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      specialty: users.specialty,
      bio: users.bio,
      phone: users.phone,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(sql`${users.role} != 'public'`);

  const listingCounts = await db
    .select({ agentId: properties.agentId, count: count() })
    .from(properties)
    .where(eq(properties.status, "published"))
    .groupBy(properties.agentId);

  const enriched = staff.map((a) => ({
    ...a,
    listingCount: listingCounts.find((l) => l.agentId === a.id)?.count ?? 0,
  }));

  return <AgentsClient agents={enriched} />;
}
