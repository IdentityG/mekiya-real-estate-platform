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
  listingCount: number;
}

interface Props {
  neighborhoods: Hood[];
}

const blockImages: Record<string, string> = {
  cmc: "/images/prop-apartment.jpg",
  "cmc-block-8": "/images/prop-penthouse.jpg",
  "cmc-block-9": "/images/prop-apartment.jpg",
  "cmc-block-10": "/images/prop-apartment.jpg",
  "cmc-block-11": "/images/prop-penthouse.jpg",
  "bole-atlas": "/images/prop-apartment.jpg",
  "bole-road": "/images/prop-commercial.jpg",
  sarbet: "/images/prop-apartment.jpg",
  "cmc-plaza": "/images/prop-commercial.jpg",
  "sarbet-heights": "/images/prop-office.jpg",
};

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
  const core = neighborhoods.filter((h) => isCmBlock(h.slug));
  const surround = neighborhoods.filter((h) => isCmExtended(h.slug));
  const cmcAnchor = core.find((h) => h.slug === "cmc") || core[0];
  const cmcBlocks = core.filter((h) => h.slug !== "cmc");

  return (
    <div className="bg-linen min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image src="/images/prop-penthouse.jpg" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/75 to-ink" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-5">
            CMC & Surroundings
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-white text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] max-w-3xl">
            One district,<br />
            <span className="italic text-brass">thirty years of city.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mt-6 font-body">
            From CMC Block 8 to Sarbet, every block of our catchment mapped — so you know
            the street, not just the city.
          </motion.p>
        </div>
      </section>

      {/* ===== CMC CORE: anchor + numbered blocks ===== */}
      {cmcAnchor && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 -mt-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative h-[420px] lg:h-[460px] overflow-hidden border border-ink/[0.08] group"
          >
            <Image
              src={blockImages[cmcAnchor.slug] || "/images/prop-apartment.jpg"}
              alt={cmcAnchor.name}
              fill sizes="100vw" priority
              className="object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            <div className="absolute top-5 left-5 px-3 py-1.5 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.15em]">
              The District
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-white text-5xl sm:text-6xl tracking-tight">{cmcAnchor.name}</h2>
                <p className="text-white/60 font-body mt-2 max-w-md">{cmcAnchor.description}</p>
              </div>
              {cmcAnchor.avgPrice && (
                <div className="text-right shrink-0">
                  <p className="text-brass font-display text-2xl">{formatPrice(cmcAnchor.avgPrice)}</p>
                  <p className="text-white/50 text-[11px] font-body uppercase tracking-[0.15em] mt-1">Avg. asking</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* ===== The CMC Block Grid ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-3">By Block</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.02em]">
              The CMC core
            </h2>
            <p className="text-stone-400 text-sm font-body mt-2 max-w-md">
              Each numbered block of CMC has its own character — different building stock, price band, and use.
            </p>
          </div>
        </div>

        {cmcBlocks.length === 0 ? (
          <p className="text-stone-400 text-sm font-body">No specific blocks yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cmcBlocks.map((block, i) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
              >
                <Link
                  href={`/properties?neighborhood=${block.slug}`}
                  className="group relative block h-72 overflow-hidden border border-ink/[0.08] bg-ink hover:border-brass/40 transition-colors duration-500"
                >
                  <Image
                    src={blockImages[block.slug] || "/images/prop-apartment.jpg"}
                    alt={block.name}
                    fill sizes="25vw"
                    className="object-cover opacity-80 group-hover:scale-[1.05] group-hover:opacity-95 transition-all duration-[1.2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />

                  {/* Big block number on the side */}
                  <span className="absolute top-4 right-5 font-display text-white/12 text-[5rem] leading-none italic select-none">
                    {block.slug.replace("cmc-block-", "")}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="block text-brass text-[10px] font-body font-bold uppercase tracking-[0.18em]">
                      CMC Block {block.slug.replace("cmc-block-", "")}
                    </span>
                    <h3 className="font-display text-white text-2xl tracking-tight mt-1">{block.name.replace("CMC Block ", "")}</h3>
                    <p className="text-white/55 text-xs font-body mt-1.5 line-clamp-2">{block.description}</p>
                    {block.avgPrice && (
                      <p className="text-brass text-sm font-body font-semibold mt-3">
                        Avg. {formatPrice(block.avgPrice)}
                        <span className="text-white/40 text-xs font-normal ml-1">· {block.listingCount} listings</span>
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ===== SURROUNDING AREAS ===== */}
      <section className="bg-cream border-t border-ink/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-3">The Wider Catchment</p>
              <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.02em]">
                Surrounding CMC
              </h2>
              <p className="text-stone-400 text-sm font-body mt-2 max-w-md">
                Within twenty minutes of CMC — the areas our clients ask about next.
              </p>
            </div>
          </div>

          {surround.length === 0 ? (
            <p className="text-stone-400 text-sm font-body">No surrounding listings yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {surround.map((hood, i) => (
                <motion.div
                  key={hood.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                >
                  <Link
                    href={`/properties?neighborhood=${hood.slug}`}
                    className="group block bg-linen border border-ink/[0.08] overflow-hidden hover:border-brass/50 transition-colors duration-500"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blockImages[hood.slug] || "/images/prop-apartment.jpg"}
                        alt={hood.name}
                        fill sizes="33vw"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-[1.2s]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-ink text-xl tracking-tight">{hood.name}</h3>
                      <p className="text-graphite/60 text-xs font-body mt-1.5 line-clamp-2">{hood.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(blockTraits[hood.slug] || []).slice(0, 3).map((trait) => (
                          <span key={trait} className="px-2 py-0.5 bg-cream border border-ink/[0.08] text-graphite/70 text-[10px] font-body">
                            {trait}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/[0.06]">
                        {hood.avgPrice && (
                          <span className="text-brass text-sm font-body font-semibold">
                            {hood.avgPrice >= 1000000
                              ? `Avg. ${formatPrice(hood.avgPrice)}`
                              : `From ${formatPrice(hood.avgPrice)}/mo`}
                          </span>
                        )}
                        <span className="text-graphite/50 text-xs font-body">{hood.listingCount} listings →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

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
