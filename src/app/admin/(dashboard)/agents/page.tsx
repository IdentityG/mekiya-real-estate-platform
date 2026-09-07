import { db } from "@/db";
import { users, properties, leads } from "@/db/schema";
import { sql, count } from "drizzle-orm";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminAgentsClient } from "@/components/admin/AdminAgentsClient";

export default async function AdminAgentsPage() {
  const session = await getSession();
  const canManage = !!session && isAdmin(session.role);

  const team = await db
    .select({
      id: users.id, name: users.name, email: users.email, role: users.role,
      phone: users.phone, specialty: users.specialty, bio: users.bio,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(sql`${users.role} != 'public'`);

  const propCounts = await db
    .select({ agentId: properties.agentId, count: count() })
    .from(properties)
    .groupBy(properties.agentId);

  const leadCounts = await db
    .select({ agentId: leads.assignedAgentId, count: count() })
    .from(leads)
    .groupBy(leads.assignedAgentId);

  const enriched = team.map((t) => ({
    ...t,
    listingCount: propCounts.find((p) => p.agentId === t.id)?.count ?? 0,
    leadCount: leadCounts.find((l) => l.agentId === t.id)?.count ?? 0,
  }));

  return <AdminAgentsClient team={enriched} canManage={canManage} />;
}
