import { getSession, isStaff } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { db } from "@/db";
import { visitRequests, leads, properties, users } from "@/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !isStaff(session.role)) {
    redirect("/admin/login");
  }

  const [pendingVisits] = await db
    .select({ value: count() })
    .from(visitRequests)
    .where(eq(visitRequests.status, "pending"));

  const [newLeads] = await db
    .select({ value: count() })
    .from(leads)
    .where(eq(leads.pipelineStatus, "new"));

  // Recent activity feed
  const recentVisits = await db
    .select({ id: visitRequests.id, name: visitRequests.name, createdAt: visitRequests.createdAt, propertyTitle: properties.title })
    .from(visitRequests)
    .leftJoin(properties, eq(visitRequests.propertyId, properties.id))
    .orderBy(desc(visitRequests.createdAt))
    .limit(5);

  const recentLeads = await db
    .select({ id: leads.id, name: leads.name, createdAt: leads.createdAt })
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(5);

  const recentProps = await db
    .select({ id: properties.id, title: properties.title, createdAt: properties.createdAt })
    .from(properties)
    .orderBy(desc(properties.createdAt))
    .limit(3);

  const timeAgo = (d: Date) => {
    const mins = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.round(hrs / 24)}d ago`;
  };

  const activity = [
    ...recentVisits.map((v) => ({
      id: `v${v.id}`,
      type: "visit" as const,
      text: `${v.name} requested a visit${v.propertyTitle ? ` for “${v.propertyTitle}”` : ""}`,
      time: timeAgo(v.createdAt),
    })),
    ...recentLeads.map((l) => ({
      id: `l${l.id}`,
      type: "lead" as const,
      text: `New lead from ${l.name}`,
      time: timeAgo(l.createdAt),
    })),
    ...recentProps.map((p) => ({
      id: `p${p.id}`,
      type: "property" as const,
      text: `Listing added: ${p.title}`,
      time: timeAgo(p.createdAt),
    })),
  ]
    .sort((a, b) => a.time.length - b.time.length)
    .slice(0, 6);

  const user = {
    name: session.name,
    email: session.email,
    role: session.role,
  };

  return (
    <div className="flex h-screen bg-linen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-ink/[0.07]">
        <AdminSidebar user={user} counts={{ pendingVisits: pendingVisits.value, newLeads: newLeads.value }} />
      </aside>

      {/* Mobile drawer */}
      <AdminMobileNav user={user} counts={{ pendingVisits: pendingVisits.value, newLeads: newLeads.value }} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={user} activity={activity} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
