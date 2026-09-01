import { db } from "@/db";
import { visitRequests, properties, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminVisitsClient } from "@/components/admin/AdminVisitsClient";

export default async function AdminVisitsPage() {
  const visits = await db
    .select({
      id: visitRequests.id,
      propertyId: visitRequests.propertyId,
      propertyTitle: properties.title,
      name: visitRequests.name,
      email: visitRequests.email,
      phone: visitRequests.phone,
      requestedDate: visitRequests.requestedDate,
      requestedTime: visitRequests.requestedTime,
      message: visitRequests.message,
      status: visitRequests.status,
      assignedAgentId: visitRequests.assignedAgentId,
      createdAt: visitRequests.createdAt,
    })
    .from(visitRequests)
    .leftJoin(properties, eq(visitRequests.propertyId, properties.id))
    .orderBy(desc(visitRequests.createdAt));

  const agents = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, "agent"));

  return <AdminVisitsClient visits={visits} agents={agents} />;
}
