"use client";

import { motion } from "framer-motion";
import { PropertyCard } from "@/components/public/PropertyCard";
import Link from "next/link";

interface Props {
  properties: Array<{
    id: number; title: string; slug: string; propertyType: string;
    listingType: string; status: string; price: number; currency: string;
    bedrooms: number | null; bathrooms: number | null; size: number | null;
    neighborhood: string | null; featured: boolean | null; verified: boolean | null;
    address: string | null;
  }>;
}

export function FeaturedListings({ properties }: Props) {
  const featured = properties.slice(0, 3);
  const others = properties.slice(3, 6);

  return (
    <section className="py-28 bg-linen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header with left-aligned label, no centered decorative numbers */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-brass text-[11px] font-body font-semibold uppercase tracking-[0.22em] mb-4">Curated</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4vw,3.5rem)] leading-[0.92] tracking-[-0.02em]">
              Featured Properties
            </h2>
          </div>
          <Link href="/properties" className="text-ink border-b border-ink/20 pb-0.5 text-sm font-body hover:text-brass hover:border-brass transition-colors tracking-wide">
            View all listings →
          </Link>
        </div>

        {/* Staggered grid: 1 oversized + 2 regular on top row */}
        <div className="space-y-6">
          {/* Row 1: oversized featured + two standard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {featured.map((property, i) => (
              <div
                key={property.id}
                className={`${i === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
              >
                <PropertyCard property={property} index={i} />
              </div>
            ))}
          </div>

          {/* Row 2: remaining */}
          {others.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i + 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
