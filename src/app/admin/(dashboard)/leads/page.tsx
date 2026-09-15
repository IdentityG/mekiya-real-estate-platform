import { db } from "@/db";
import { leads, properties, users, leadActivities } from "@/db/schema";
import { desc, eq, and, gte, sql, count } from "drizzle-orm";
import { SmartLeadDashboard } from "@/components/admin/SmartLeadDashboard";

export default async function AdminLeadsPage() {
  // Get leads with enhanced scoring data
  const allLeads = await db
    .select({
      id: leads.id,
      propertyId: leads.propertyId,
      propertyTitle: properties.title,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      leadType: leads.leadType,
      pipelineStatus: leads.pipelineStatus,
      source: leads.source,
      notes: leads.notes,
      assignedAgentId: leads.assignedAgentId,
      agentName: users.name,
      // Smart Lead Fields
      leadScore: leads.leadScore,
      lastActivityAt: leads.lastActivityAt,
      viewCount: leads.viewCount,
      whatsappOptIn: leads.whatsappOptIn,
      nextFollowUpDate: leads.nextFollowUpDate,
      budgetMin: leads.budgetMin,
      budgetMax: leads.budgetMax,
      interestedPropertyTypes: leads.interestedPropertyTypes,
      preferredNeighborhoods: leads.preferredNeighborhoods,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .leftJoin(properties, eq(leads.propertyId, properties.id))
    .leftJoin(users, eq(leads.assignedAgentId, users.id))
    .orderBy(desc(leads.leadScore), desc(leads.lastActivityAt));

  // Get agents
  const agents = await db
    .select({ 
      id: users.id, 
      name: users.name,
      phone: users.phone,
      whatsappPhone: users.whatsappPhone,
    })
    .from(users)
    .where(sql`${users.role} IN ('agent', 'sales_manager')`);

  // Get lead statistics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [stats] = await db
    .select({
      totalLeads: count(),
      hotLeads: sql<number>`COUNT(CASE WHEN ${leads.leadScore} >= 70 THEN 1 END)`,
      warmLeads: sql<number>`COUNT(CASE WHEN ${leads.leadScore} >= 40 AND ${leads.leadScore} < 70 THEN 1 END)`,
      coldLeads: sql<number>`COUNT(CASE WHEN ${leads.leadScore} < 40 THEN 1 END)`,
      newLeads: sql<number>`COUNT(CASE WHEN ${leads.pipelineStatus} = 'new' THEN 1 END)`,
      activeLeads: sql<number>`COUNT(CASE WHEN ${leads.lastActivityAt} > ${thirtyDaysAgo} THEN 1 END)`,
      needsFollowUp: sql<number>`COUNT(CASE WHEN ${leads.nextFollowUpDate} <= NOW() AND ${leads.pipelineStatus} NOT IN ('closed_won', 'closed_lost') THEN 1 END)`,
    })
    .from(leads);

  // Get recent activities (last 50)
  const recentActivities = await db
    .select({
      id: leadActivities.id,
      leadId: leadActivities.leadId,
      leadName: leads.name,
      activityType: leadActivities.activityType,
      propertyId: leadActivities.propertyId,
      propertyTitle: properties.title,
      metadata: leadActivities.metadata,
      createdAt: leadActivities.createdAt,
    })
    .from(leadActivities)
    .leftJoin(leads, eq(leadActivities.leadId, leads.id))
    .leftJoin(properties, eq(leadActivities.propertyId, properties.id))
    .orderBy(desc(leadActivities.createdAt))
    .limit(50);

  return (
    <SmartLeadDashboard
      leads={allLeads}
      agents={agents}
      stats={stats}
      recentActivities={recentActivities}
    />
  );
}
