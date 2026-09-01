import { db } from "@/db";
import { users, properties } from "@/db/schema";
import { ne, eq, count } from "drizzle-orm";
import { ContactClient } from "@/components/public/contact/ContactClient";

export const metadata = {
  title: "Contact — Mekiya Real Estate",
  description: "Talk to a Mekiya agent. Schedule a viewing, ask about financing, or drop by our Bole office.",
};

export default async function ContactPage() {
  const agents = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      specialty: users.specialty,
      phone: users.phone,
      email: users.email,
    })
    .from(users)
    .where(ne(users.role, "public"));

  const [activeListings] = await db
    .select({ value: count() })
    .from(properties)
    .where(eq(properties.status, "published"));

  return <ContactClient agents={agents} activeListings={activeListings.value} />;
}
