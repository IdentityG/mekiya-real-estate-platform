"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { type: "apartment", label: "Apartments", count: "Sale & Rent", img: "/images/prop-apartment.jpg" },
  { type: "commercial", label: "Commercial", count: "Offices & retail", img: "/images/prop-commercial.jpg" },
];

export function CategoryGrid() {
  return (
    <section className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-brass text-[11px] font-body font-semibold uppercase tracking-[0.22em] mb-3">Browse</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.92] tracking-[-0.02em]">
              Property Types
            </h2>
          </div>
          <Link href="/properties" className="text-ink text-sm font-body tracking-wide border-b border-ink/20 pb-0.5 hover:text-brass hover:border-brass transition-colors">
            View all categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href={`/properties?type=${cat.type}`}
                className="group relative block h-72 border border-ink/[0.08] overflow-hidden bg-ink hover:border-brass/30 transition-colors duration-500"
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-70 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-brass text-[10px] font-body font-bold uppercase tracking-[0.15em]">{cat.count}</span>
                  <h3 className="text-white text-xl font-display tracking-tight mt-1">{cat.label}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
