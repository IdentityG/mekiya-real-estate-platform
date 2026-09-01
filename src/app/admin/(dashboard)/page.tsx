import { db } from "@/db";
import { properties, visitRequests, leads, transactions, users } from "@/db/schema";
import { eq, count, desc, sql, sum } from "drizzle-orm";
import { DashboardClient } from "@/components/admin/DashboardClient";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthlySeries(rows: { createdAt: Date }[], months: number) {
  const now = new Date();
  const out: { month: string; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const countRows = rows.filter((r) => {
      const rd = new Date(r.createdAt);
      return `${rd.getFullYear()}-${rd.getMonth()}` === key;
    }).length;
    out.push({ month: MONTHS[d.getMonth()], count: countRows });
  }
  return out;
}

export default async function AdminDashboardPage() {
  const [totalListings] = await db.select({ value: count() }).from(properties);
  const [activeListings] = await db
    .select({ value: count() })
    .from(properties)
    .where(eq(properties.status, "published"));
  const [pendingVisits] = await db
    .select({ value: count() })
    .from(visitRequests)
    .where(eq(visitRequests.status, "pending"));
  const [newLeads] = await db
    .select({ value: count() })
    .from(leads)
    .where(eq(leads.pipelineStatus, "new"));

  const [revenue] = await db
    .select({ value: sum(transactions.amount) })
    .from(transactions)
    .where(eq(transactions.status, "paid"));

  const allLeads = await db.select({ createdAt: leads.createdAt }).from(leads);
  const allVisits = await db.select({ createdAt: visitRequests.createdAt }).from(visitRequests);

  const leadSeries = monthlySeries(allLeads, 6);
  const visitSeries = monthlySeries(allVisits, 6);

  const propsByStatus = await db
    .select({ status: properties.status, count: count() })
    .from(properties)
    .groupBy(properties.status);

  const propsByType = await db
    .select({ type: properties.propertyType, count: count() })
    .from(properties)
    .groupBy(properties.propertyType);

  const topViewed = await db
    .select({ title: properties.title, views: properties.views })
    .from(properties)
    .orderBy(desc(properties.views))
    .limit(5);

  const [totalAgents] = await db
    .select({ value: count() })
    .from(users)
    .where(sql`${users.role} != 'public'`);

  const recentVisits = await db
    .select({
      id: visitRequests.id, name: visitRequests.name, status: visitRequests.status,
      requestedDate: visitRequests.requestedDate, createdAt: visitRequests.createdAt,
      propertyTitle: properties.title,
    })
    .from(visitRequests)
    .leftJoin(properties, eq(visitRequests.propertyId, properties.id))
    .orderBy(desc(visitRequests.createdAt))
    .limit(5);

  const recentLeads = await db
    .select({
      id: leads.id, name: leads.name, pipelineStatus: leads.pipelineStatus,
      leadType: leads.leadType, createdAt: leads.createdAt,
      propertyTitle: properties.title,
    })
    .from(leads)
    .leftJoin(properties, eq(leads.propertyId, properties.id))
    .orderBy(desc(leads.createdAt))
    .limit(5);

  return (
    <DashboardClient
      stats={{
        totalListings: totalListings.value,
        activeListings: activeListings.value,
        pendingVisits: pendingVisits.value,
        newLeads: newLeads.value,
        revenue: Number(revenue.value) || 0,
        totalAgents: totalAgents.value,
      }}
      chartData={MONTHS.map((m, i) => ({
        month: m,
        leads: leadSeries[i]?.count ?? 0,
        visits: visitSeries[i]?.count ?? 0,
      })).slice(-6)}
      propsByStatus={propsByStatus}
      propsByType={propsByType}
      topViewed={topViewed}
      recentVisits={recentVisits}
      recentLeads={recentLeads}
    />
  );
}
