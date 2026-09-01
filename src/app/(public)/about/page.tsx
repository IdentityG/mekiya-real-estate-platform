import { db } from "@/db";
import { users, properties, testimonials } from "@/db/schema";
import { ne, eq, count } from "drizzle-orm";
import { AboutClient } from "@/components/public/about/AboutClient";

export const metadata = {
  title: "About — Mekiya Real Estate",
  description: "The story, values, and people behind Mekiya — Ethiopia's trust-first property platform.",
};

export default async function AboutPage() {
  const agents = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      specialty: users.specialty,
      bio: users.bio,
      phone: users.phone,
      email: users.email,
    })
    .from(users)
    .where(ne(users.role, "public"));

  const allProperties = await db.select().from(properties);
  const testimonialCounts = await db
    .select({ count: count() })
    .from(testimonials)
    .where(eq(testimonials.featured, true));

  const publishedCount = allProperties.filter((p) => p.status === "published").length;

  return (
    <AboutClient
      agents={agents}
      stats={{
        activeListings: publishedCount,
        testimonials: testimonialCounts[0]?.count ?? 0,
        totalListings: allProperties.length,
      }}
    />
  );
}
