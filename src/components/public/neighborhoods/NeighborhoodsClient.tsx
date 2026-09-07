"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Hood {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  avgPrice: number | null;
  imageUrl: string | null;
  block: string | null;
  featured: boolean | null;
  listingCount: number;
}

interface Props {
  neighborhoods: Hood[];
}

const blockImages: Record<string, string> = {
  cmc: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "cmc-block-8": "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "cmc-block-9": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "cmc-block-10": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "cmc-block-11": "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "bole-atlas": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "bole-road": "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1200",
  sarbet: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "cmc-plaza": "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "sarbet-heights": "https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const DEFAULT_NEIGHBORHOOD_IMAGE = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200";

function getNeighborhoodImage(hood: Hood): string {
  // Use database image if available, otherwise fallback
  if (hood.imageUrl) return hood.imageUrl;
  return blockImages[hood.slug] || DEFAULT_NEIGHBORHOOD_IMAGE;
}

const blockTraits: Record<string, string[]> = {
  cmc: ["Central", "All amenities", "Mixed-use"],
  "cmc-block-8": ["Premium towers", "Penthouse zone", "Concierge buildings"],
  "cmc-block-9": ["Near CMC Hospital", "Medical offices", "Family residential"],
  "cmc-block-10": ["Furnished rentals", "Walk to Plaza", "Young professionals"],
  "cmc-block-11": ["New-builds", "Rooftop amenities", "Gym-equipped"],
  "bole-atlas": ["Near airport", "Furnished studios", "Expat favorite"],
  "bole-road": ["Retail frontage", "Main commercial spine", "High foot traffic"],
  sarbet: ["Quiet residential", "10 min to CMC", "Affordable"],
  "cmc-plaza": ["Mall retail", "Shopfronts", "Service businesses"],
  "sarbet-heights": ["Co-working", "Modern towers", "Plug-and-play"],
};

const isCmBlock = (slug: string) => slug === "cmc" || slug.startsWith("cmc-block");
const isCmExtended = (slug: string) => slug === "bole-atlas" || slug === "bole-road" || slug === "sarbet" || slug === "sarbet-heights" || slug === "cmc-plaza";

export function NeighborhoodsClient({ neighborhoods }: Props) {
  // Separate featured and regular neighborhoods
  const featured = neighborhoods.filter((h) => h.featured);
  const regular = neighborhoods.filter((h) => !h.featured);
  
  // If no featured, use first as hero
  const hero = featured[0] || neighborhoods[0];
  const featuredGrid = featured.length > 1 ? featured.slice(1) : [];
  const restOfNeighborhoods = featured.length > 0 ? regular : neighborhoods.slice(1);

  return (
    <div className="bg-linen min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image src={getNeighborhoodImage(hero)} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/75 to-ink" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-5">
            Neighborhoods
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-white text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] max-w-3xl">
            Every block,<br />
            <span className="italic text-brass">every neighborhood.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mt-6 font-body">
            From CMC to Sarbet, every corner of Addis Ababa mapped — so you know
            the street, not just the city.
          </motion.p>
        </div>
      </section>

      {/* ===== HERO NEIGHBORHOOD ===== */}
      {hero && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 -mt-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative h-[420px] lg:h-[460px] overflow-hidden border border-ink/[0.08] group"
          >
            <Image
              src={getNeighborhoodImage(hero)}
              alt={hero.name}
              fill sizes="100vw" priority
              className="object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            {hero.featured && (
              <div className="absolute top-5 left-5 px-3 py-1.5 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Featured
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-white text-5xl sm:text-6xl tracking-tight">{hero.name}</h2>
                {hero.block && (
                  <p className="text-brass text-sm font-body font-semibold uppercase tracking-wide mt-1">{hero.block}</p>
                )}
                <p className="text-white/60 font-body mt-2 max-w-md">{hero.description || "Explore this neighborhood"}</p>
              </div>
              {hero.avgPrice && (
                <div className="text-right shrink-0">
                  <p className="text-brass font-display text-2xl">{formatPrice(hero.avgPrice)}</p>
                  <p className="text-white/50 text-[11px] font-body uppercase tracking-[0.15em] mt-1">Avg. asking</p>
                </div>
              )}
            </div>
            <Link 
              href={`/properties?neighborhood=${encodeURIComponent(hero.name)}`}
              className="absolute inset-0"
              aria-label={`View properties in ${hero.name}`}
            />
          </motion.div>
        </section>
      )}

      {/* ===== FEATURED NEIGHBORHOODS ===== */}
      {featuredGrid.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Featured Neighborhoods
              </p>
              <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.02em]">
                Popular areas
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGrid.map((hood, i) => (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              >
                <Link
                  href={`/properties?neighborhood=${encodeURIComponent(hood.name)}`}
                  className="group relative block h-72 overflow-hidden border border-ink/[0.08] bg-ink hover:border-brass/40 transition-colors duration-500"
                >
                  <Image
                    src={getNeighborhoodImage(hood)}
                    alt={hood.name}
                    fill sizes="33vw"
                    className="object-cover opacity-80 group-hover:scale-[1.05] group-hover:opacity-95 transition-all duration-[1.2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {hood.block && (
                      <span className="block text-brass text-[10px] font-body font-bold uppercase tracking-[0.18em]">
                        {hood.block}
                      </span>
                    )}
                    <h3 className="font-display text-white text-2xl tracking-tight mt-1">{hood.name}</h3>
                    <p className="text-white/55 text-xs font-body mt-1.5 line-clamp-2">{hood.description || "Explore this area"}</p>
                    {hood.avgPrice && (
                      <p className="text-brass text-sm font-body font-semibold mt-3">
                        Avg. {formatPrice(hood.avgPrice)}
                        <span className="text-white/40 text-xs font-normal ml-1">· {hood.listingCount} listings</span>
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== ALL NEIGHBORHOODS ===== */}
      {restOfNeighborhoods.length > 0 && (
        <section className="bg-cream border-t border-ink/[0.08]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-3">
                  {featured.length > 0 ? "More Neighborhoods" : "All Neighborhoods"}
                </p>
                <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.02em]">
                  Explore every area
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restOfNeighborhoods.map((hood, i) => (
                <motion.div
                  key={hood.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                >
                  <Link
                    href={`/properties?neighborhood=${encodeURIComponent(hood.name)}`}
                    className="group block bg-linen border border-ink/[0.08] overflow-hidden hover:border-brass/50 transition-colors duration-500"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getNeighborhoodImage(hood)}
                        alt={hood.name}
                        fill sizes="33vw"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-[1.2s]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-ink text-xl tracking-tight">{hood.name}</h3>
                      {hood.block && (
                        <p className="text-brass text-[10px] font-body font-bold uppercase tracking-wide mt-0.5">{hood.block}</p>
                      )}
                      <p className="text-graphite/60 text-xs font-body mt-2 line-clamp-2">{hood.description || "Discover properties in this area"}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/[0.06]">
                        {hood.avgPrice ? (
                          <span className="text-brass text-sm font-body font-semibold">
                            Avg. {formatPrice(hood.avgPrice)}
                          </span>
                        ) : (
                          <span className="text-graphite/50 text-xs font-body">Price varies</span>
                        )}
                        <span className="text-graphite/50 text-xs font-body">{hood.listingCount} listings →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight">Not sure which block fits?</h3>
            <p className="text-white/50 font-body mt-2">Tell us your daily routes — schools, work, family — and we&apos;ll match the block to your life.</p>
          </div>
          <Link href="/contact" className="px-8 py-4 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors shrink-0">
            Ask an Agent
          </Link>
        </div>
      </section>
    </div>
  );
}
