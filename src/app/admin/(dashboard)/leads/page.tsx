import { db } from "@/db";
import { leads, properties, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminLeadsClient } from "@/components/admin/AdminLeadsClient";

export default async function AdminLeadsPage() {
  const allLeads = await db
    .select({
      id: leads.id, propertyId: leads.propertyId, propertyTitle: properties.title,
      name: leads.name, email: leads.email, phone: leads.phone,
      leadType: leads.leadType, pipelineStatus: leads.pipelineStatus,
      source: leads.source, notes: leads.notes, assignedAgentId: leads.assignedAgentId,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .leftJoin(properties, eq(leads.propertyId, properties.id))
    .orderBy(desc(leads.createdAt));

  const agents = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, "agent"));

  return <AdminLeadsClient leads={allLeads} agents={agents} />;
}
