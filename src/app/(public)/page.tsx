import { db } from "@/db";
import { properties, testimonials, neighborhoods } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { HeroSection } from "@/components/public/home/HeroSection";
import { FeaturedListings } from "@/components/public/home/FeaturedListings";
import { CategoryGrid } from "@/components/public/home/CategoryGrid";
import { StatsSection } from "@/components/public/home/StatsSection";
import { NeighborhoodSection } from "@/components/public/home/NeighborhoodSection";
import { TestimonialSection } from "@/components/public/home/TestimonialSection";

export default async function HomePage() {
  const featuredProps = await db
    .select()
    .from(properties)
    .where(eq(properties.status, "published"))
    .orderBy(desc(properties.featured), desc(properties.createdAt))
    .limit(6);

  const allTestimonials = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.featured, true))
    .limit(4);

  const allNeighborhoods = await db.select().from(neighborhoods).limit(6);

  return (
    <>
      <HeroSection />
      <FeaturedListings properties={featuredProps} />
      <CategoryGrid />
      <StatsSection />
      <NeighborhoodSection neighborhoods={allNeighborhoods} />
      <TestimonialSection testimonials={allTestimonials} />
    </>
  );
}
