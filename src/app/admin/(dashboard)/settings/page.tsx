import { db } from "@/db";
import { testimonials, neighborhoods, siteSettings } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const t = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  const n = await db.select().from(neighborhoods).orderBy(asc(neighborhoods.name));
  const s = await db.select().from(siteSettings);

  return (
    <AdminSettingsClient
      testimonials={t}
      neighborhoods={n}
      settings={Object.fromEntries(s.map((r) => [r.key, r.value]))}
    />
  );
}
