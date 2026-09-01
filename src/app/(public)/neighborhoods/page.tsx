import { db } from "@/db";
import { neighborhoods, properties } from "@/db/schema";
import { count, eq, inArray } from "drizzle-orm";
import { NeighborhoodsClient } from "@/components/public/neighborhoods/NeighborhoodsClient";

const CMC_SLUGS = [
  "cmc",
  "cmc-block-8",
  "cmc-block-9",
  "cmc-block-10",
  "cmc-block-11",
  "bole-atlas",
  "bole-road",
  "sarbet",
  "cmc-plaza",
  "sarbet-heights",
];

export const metadata = {
  title: "CMC & Surroundings — Mekiya Real Estate",
};

export default async function NeighborhoodsPage() {
  const hoods = await db.select().from(neighborhoods).where(inArray(neighborhoods.slug, CMC_SLUGS));

  const propCounts = await db
    .select({ neighborhood: properties.neighborhood, count: count() })
    .from(properties)
    .where(eq(properties.status, "published"))
    .groupBy(properties.neighborhood);

  const withCounts = hoods.map((h) => ({
    ...h,
    listingCount:
      propCounts.find((p) => p.neighborhood?.toLowerCase() === h.name.toLowerCase())?.count ?? 0,
  }));

  return <NeighborhoodsClient neighborhoods={withCounts} />;
}
