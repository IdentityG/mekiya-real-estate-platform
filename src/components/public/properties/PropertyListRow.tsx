"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { getPropertyImages } from "@/lib/media";

interface Props {
  property: {
    id: number; title: string; slug: string; propertyType: string;
    listingType: string; price: number; currency: string;
    bedrooms: number | null; bathrooms: number | null; size: number | null;
    neighborhood: string | null; featured: boolean | null; verified: boolean | null;
    address: string | null; views: number | null;
  };
  index?: number;
}

export function PropertyListRow({ property, index = 0 }: Props) {
  const img = getPropertyImages(property.slug, property.propertyType)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="group grid grid-cols-[120px_1fr] sm:grid-cols-[220px_1fr] bg-cream border border-ink/[0.08] overflow-hidden hover:border-brass/50 transition-colors duration-500"
      >
        {/* Image */}
        <div className="relative h-32 sm:h-40 overflow-hidden">
          <Image
            src={img}
            alt={property.title}
            fill
            sizes="220px"
            className="object-cover group-hover:scale-[1.06] transition-transform duration-700"
          />
          {property.featured && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-brass text-ink text-[9px] font-body font-bold uppercase tracking-[0.1em]">Featured</span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-ink text-lg sm:text-xl tracking-tight line-clamp-1 group-hover:text-brass transition-colors">
                {property.title}
              </h3>
              <span className="text-brass font-body font-bold text-sm sm:text-base whitespace-nowrap">
                {formatPrice(property.price, property.currency)}
                {property.listingType === "rent" && <span className="text-graphite/50 font-normal"> /mo</span>}
              </span>
            </div>
            {property.address && (
              <p className="text-stone-400 text-xs sm:text-sm font-body mt-1 line-clamp-1">{property.address}</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 text-graphite/60 text-xs font-body">
            <span className="capitalize px-2 py-0.5 bg-linen border border-ink/[0.06]">{property.propertyType}</span>
            <span>{property.listingType === "sale" ? "For Sale" : "For Rent"}</span>
            {property.bedrooms ? <span>{property.bedrooms} bd</span> : null}
            {property.bathrooms ? <span>{property.bathrooms} ba</span> : null}
            {property.size ? <span>{property.size} m²</span> : null}
            <span className="ml-auto text-slate font-semibold hidden sm:inline group-hover:translate-x-1 transition-transform">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
