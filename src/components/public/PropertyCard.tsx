"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatPrice, getPropertyTypeLabel } from "@/lib/utils";
import { getPropertyImages } from "@/lib/media";

interface PropertyCardProps {
  property: {
    id: number; title: string; slug: string; propertyType: string;
    listingType: string; status: string; price: number; currency: string;
    bedrooms: number | null; bathrooms: number | null; size: number | null;
    neighborhood: string | null; featured: boolean | null; verified: boolean | null;
    address: string | null; media: string[] | null;
  };
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [hovered, setHovered] = useState(false);
  
  // Use actual media from database, fallback to getPropertyImages if empty
  const dbImages = Array.isArray(property.media) && property.media.length > 0 
    ? property.media 
    : getPropertyImages(property.slug, property.propertyType);
  const images = dbImages;
  
  const primary = images[0];
  const secondary = images[1] || images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/properties/${property.slug}`} className="block bg-cream border border-ink/[0.08] overflow-hidden hover:border-brass/40 transition-colors duration-500">
        {/* Image — no rounded corners, sharp edges */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={primary}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-out ${hovered ? "scale-[1.05]" : "scale-100"} ${hovered ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src={secondary}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-out ${hovered ? "scale-[1.05]" : "scale-100"} ${hovered ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

          {/* Badges as structural info, not decoration */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.featured && (
              <span className="px-2.5 py-1 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.1em]">Featured</span>
            )}
            {property.verified && (
              <span className="px-2.5 py-1 bg-ink/60 backdrop-blur-sm text-white text-[10px] font-body font-bold uppercase tracking-[0.1em] flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-brass" /> Verified
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-cream/90 text-ink text-[10px] font-body font-bold uppercase tracking-[0.1em]">
              {property.listingType === "sale" ? "For Sale" : "For Rent"}
            </span>
          </div>
        </div>

        {/* Content — sharp, structured */}
        <div className="p-5">
          <h3 className="font-display text-ink text-lg leading-tight mb-2 group-hover:text-brass transition-colors tracking-tight">
            {property.title}
          </h3>

          {property.address && (
            <p className="text-graphite text-sm mb-4 line-clamp-1 font-body">
              {property.address}
            </p>
          )}

          {/* Specs with hairline rule */}
          <div className="pt-4 border-t border-ink/[0.06] flex items-center gap-5 text-graphite text-xs font-body tracking-wide">
            {property.bedrooms !== null && property.bedrooms > 0 && (
              <span>{property.bedrooms} bd</span>
            )}
            {property.bathrooms !== null && property.bathrooms > 0 && (
              <span>{property.bathrooms} ba</span>
            )}
            {property.size !== null && property.size > 0 && (
              <span>{property.size} m²</span>
            )}
            <span className="ml-auto text-brass font-semibold tracking-normal">
              {formatPrice(property.price, property.currency)}
              {property.listingType === "rent" && <span className="text-graphite font-normal"> /mo</span>}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
