"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";
import { formatPrice } from "@/lib/utils";

interface Props {
  neighborhoods: Array<{
    id: number; name: string; slug: string; description: string | null; avgPrice: number | null; imageUrl: string | null;
  }>;
}

export function NeighborhoodSection({ neighborhoods }: Props) {
  return (
    <section className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="text-brass text-[11px] font-body font-semibold uppercase tracking-[0.22em] mb-3">Discover</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.92] tracking-[-0.02em]">
              Featured Neighborhoods
            </h2>
          </div>
        </div>

        {/* Images with offset positioning — asymmetric */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {neighborhoods.map((hood, i) => (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`${i === 1 ? "md:mt-16" : ""}`}
              >
                <Link href={`/properties?neighborhood=${hood.slug}`} className="group relative block border border-ink/[0.08] overflow-hidden bg-ink">
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={hood.imageUrl || IMG.neighborhoodBole}
                      alt={hood.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-80 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-white text-2xl tracking-tight">{hood.name}</h3>
                    {hood.description && (
                      <p className="text-white/50 text-sm mt-1.5 font-body line-clamp-1">{hood.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      {hood.avgPrice && (
                        <span className="text-brass text-sm font-body font-semibold">Avg. {formatPrice(hood.avgPrice)}</span>
                      )}
                      <span className="text-white/40 text-xs font-body tracking-wide">View listings →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
