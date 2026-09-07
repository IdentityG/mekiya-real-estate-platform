"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HERO_VIDEO } from "@/lib/media";
import { formatPrice } from "@/lib/utils";
import { IMG } from "@/lib/images";

const quickHoods = ["CMC Block 8", "CMC Block 9", "CMC Block 10", "Bole Atlas", "Sarbet"];

interface FeaturedProperty {
  id: number;
  title: string;
  slug: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  neighborhood: string | null;
  address: string | null;
  media: string[] | null;
}

interface Props {
  featuredProperty?: FeaturedProperty | null;
}

export function HeroSection({ featuredProperty }: Props) {
  const [mode, setMode] = useState<"sale" | "rent">("sale");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  const searchHref = `/properties?listing=${mode}${q ? `&q=${encodeURIComponent(q)}` : ""}${type ? `&type=${type}` : ""}`;

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-ink">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src={IMG.heroMain} alt="" fill priority sizes="100vw" className="object-cover" />
        <video
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${videoReady ? "opacity-100" : "opacity-0"}`}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        {/* Legibility scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md mb-8"
            >
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.12em]">
                <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" /> Live
              </span>
              <span className="text-white/70 text-xs font-body">500+ verified listings across Addis Ababa</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-white text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.9] tracking-[-0.03em]"
            >
              The address<br />
              you&apos;ve been<br />
              <span className="italic text-brass">searching for.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/55 text-base sm:text-lg leading-relaxed font-body mt-7 max-w-lg"
            >
              Hand-picked apartments, villas, and commercial spaces — every listing
              title-verified and walked by our agents before it reaches you.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              className="mt-9 max-w-xl"
            >
              <div className="inline-flex p-1 rounded-full bg-white/[0.07] border border-white/12 backdrop-blur-md mb-3">
                {(["sale", "rent"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-6 py-2 rounded-full text-[12px] font-body font-bold uppercase tracking-[0.1em] transition-colors ${
                      mode === m ? "bg-brass text-ink" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {m === "sale" ? "Buy" : "Rent"}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl sm:rounded-full bg-white/[0.07] border border-white/12 backdrop-blur-xl">
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                  <svg className="w-[18px] h-[18px] text-brass shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search neighborhood or property"
                    className="w-full bg-transparent text-white text-sm font-body placeholder-white/35 focus:outline-none"
                  />
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Property type"
                  className="px-4 py-2.5 bg-transparent text-white/60 text-sm font-body focus:outline-none cursor-pointer sm:border-l border-white/12 appearance-none"
                >
                  <option value="" className="bg-ink">Any type</option>
                  <option value="apartment" className="bg-ink">Apartment</option>
                  <option value="commercial" className="bg-ink">Commercial</option>
                </select>
                <Link
                  href={searchHref}
                  className="px-7 py-3 bg-brass text-ink text-[12px] font-body font-bold uppercase tracking-[0.12em] rounded-full text-center hover:bg-white transition-colors"
                >
                  Search
                </Link>
              </div>

              {/* Quick chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-white/30 text-[11px] font-body uppercase tracking-[0.14em]">Popular</span>
                {quickHoods.map((h) => (
                  <Link
                    key={h}
                    href={`/properties?neighborhood=${h.toLowerCase().replace(" ", "-")}`}
                    className="px-3 py-1 rounded-full border border-white/12 text-white/60 text-xs font-body hover:border-brass hover:text-brass transition-colors"
                  >
                    {h}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — floating preview card */}
          {featuredProperty && (
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block lg:col-span-5"
            >
              <Link href={`/properties/${featuredProperty.slug}`} className="block relative ml-auto max-w-sm group">
                <div className="absolute -top-4 -left-4 w-full h-full border border-brass/25 rounded-2xl group-hover:border-brass/50 transition-colors" />
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.06] border border-white/12 backdrop-blur-xl group-hover:border-white/25 transition-colors">
                  <div className="relative h-52">
                    <Image 
                      src={featuredProperty.media?.[0] || "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                      alt={featuredProperty.title} 
                      fill 
                      sizes="400px" 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.12em]">
                      Featured
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-white text-xl tracking-tight line-clamp-1">{featuredProperty.title}</p>
                    <p className="text-white/40 text-xs font-body mt-1 line-clamp-1">
                      {featuredProperty.neighborhood && `${featuredProperty.neighborhood} · `}
                      {featuredProperty.address || "Premium location"}
                    </p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-white/60 text-xs font-body">
                      {featuredProperty.bedrooms && <span>{featuredProperty.bedrooms} bd</span>}
                      {featuredProperty.bathrooms && <span>{featuredProperty.bathrooms} ba</span>}
                      {featuredProperty.size && <span>{featuredProperty.size} m²</span>}
                      <span className="ml-auto text-brass font-bold text-sm">
                        {formatPrice(featuredProperty.price, featuredProperty.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating pill */}
                <div className="absolute -bottom-5 -left-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-linen shadow-xl">
                  <div className="flex -space-x-2">
                    {(featuredProperty.media?.slice(1, 4) || [
                      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=100",
                      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=100",
                      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=100"
                    ]).map((src, i) => (
                      <span key={i} className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-linen">
                        <Image src={src} alt="" fill sizes="28px" className="object-cover" />
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-ink text-xs font-body font-bold">2,000+ clients</p>
                    <p className="text-brass text-[10px] font-body">★★★★★ 4.9 rating</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent" />
    </section>
  );
}
