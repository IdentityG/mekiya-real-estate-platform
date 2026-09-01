import { db } from "@/db";
import { properties, visitRequests, leads, transactions } from "@/db/schema";
import { count, sum, desc, eq } from "drizzle-orm";
import { AnalyticsClient } from "@/components/admin/AnalyticsClient";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthlySeries(rows: { createdAt: Date }[], months: number) {
  const now = new Date();
  const out: { month: string; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    out.push({ month: MONTHS[d.getMonth()], count: rows.filter((r) => { const rd = new Date(r.createdAt); return `${rd.getFullYear()}-${rd.getMonth()}` === key; }).length });
  }
  return out;
}

export default async function AdminAnalyticsPage() {
  const propsByType = await db
    .select({ type: properties.propertyType, count: count() })
    .from(properties)
    .groupBy(properties.propertyType);

  const propsByStatus = await db
    .select({ status: properties.status, count: count() })
    .from(properties)
    .groupBy(properties.status);

  const leadsByStatus = await db
    .select({ status: leads.pipelineStatus, count: count() })
    .from(leads)
    .groupBy(leads.pipelineStatus);

  const visitsByStatus = await db
    .select({ status: visitRequests.status, count: count() })
    .from(visitRequests)
    .groupBy(visitRequests.status);

  const [totalViews] = await db.select({ total: sum(properties.views) }).from(properties);
  const [totalRevenue] = await db
    .select({ total: sum(transactions.amount) })
    .from(transactions)
    .where(eq(transactions.status, "paid"));

  const topViewed = await db
    .select({ title: properties.title, views: properties.views })
    .from(properties)
    .where(eq(properties.status, "published"))
    .orderBy(desc(properties.views))
    .limit(8);

  const allLeads = await db
    .select({ createdAt: leads.createdAt, name: leads.name, email: leads.email, phone: leads.phone, pipelineStatus: leads.pipelineStatus, leadType: leads.leadType, source: leads.source })
    .from(leads);

  const allVisits = await db
    .select({ createdAt: visitRequests.createdAt })
    .from(visitRequests);

  return (
    <AnalyticsClient
      propsByType={propsByType}
      propsByStatus={propsByStatus}
      leadsByStatus={leadsByStatus}
      visitsByStatus={visitsByStatus}
      totalViews={Number(totalViews.total) || 0}
      totalRevenue={Number(totalRevenue.total) || 0}
      topViewed={topViewed}
      leadsSeries={monthlySeries(allLeads, 6)}
      visitsSeries={monthlySeries(allVisits, 6)}
      leads={allLeads}
    />
  );
}
