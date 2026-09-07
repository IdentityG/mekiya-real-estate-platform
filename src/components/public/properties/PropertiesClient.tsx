"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCard } from "@/components/public/PropertyCard";
import { useSearchParams } from "next/navigation";
import { PropertyListRow } from "@/components/public/properties/PropertyListRow";

interface Property {
  id: number; title: string; slug: string; propertyType: string;
  listingType: string; status: string; price: number; currency: string;
  bedrooms: number | null; bathrooms: number | null; size: number | null;
  neighborhood: string | null; featured: boolean | null; verified: boolean | null;
  address: string | null; amenities: string[] | null; yearBuilt: number | null;
  furnished: boolean | null; views: number | null; media: string[] | null;
}

interface PropertyType {
  id: number;
  value: string;
  label: string;
  imageUrl: string | null;
  icon: string | null;
  color: string | null;
}

interface Props {
  properties: Property[];
  neighborhoods: string[];
  amenities: string[];
  propertyTypes?: PropertyType[];
}

export function PropertiesClient({ properties, neighborhoods, amenities, propertyTypes = [] }: Props) {
  const searchParams = useSearchParams();

  // Use database property types or fallback to unique types from properties
  const TYPES = propertyTypes.length > 0
    ? propertyTypes.map(pt => pt.value)
    : Array.from(new Set(properties.map(p => p.propertyType)));

  // Filter state
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type") ? [searchParams.get("type")!] : []
  );
  const [listing, setListing] = useState<string>(searchParams.get("listing") || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [beds, setBeds] = useState<string>(searchParams.get("bedrooms") || "");
  const [baths, setBaths] = useState<string>("");
  const [selectedHoods, setSelectedHoods] = useState<string[]>(
    searchParams.get("neighborhood")
      ? neighborhoods.filter((n) => n.toLowerCase().includes(searchParams.get("neighborhood")!.toLowerCase()))
      : []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Instant filter pipeline
  const filtered = useMemo(() => {
    let out = [...properties];
    if (q) {
      const needle = q.toLowerCase();
      out = out.filter((p) =>
        [p.title, p.address, p.neighborhood].filter(Boolean).join(" ").toLowerCase().includes(needle)
      );
    }
    if (selectedTypes.length) out = out.filter((p) => selectedTypes.includes(p.propertyType));
    if (listing) out = out.filter((p) => p.listingType === listing);
    if (minPrice) out = out.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) out = out.filter((p) => p.price <= Number(maxPrice));
    if (beds) out = out.filter((p) => (p.bedrooms ?? 0) >= Number(beds));
    if (baths) out = out.filter((p) => (p.bathrooms ?? 0) >= Number(baths));
    if (selectedHoods.length) out = out.filter((p) => p.neighborhood && selectedHoods.includes(p.neighborhood));
    if (selectedAmenities.length)
      out = out.filter((p) => selectedAmenities.every((a) => (p.amenities || []).includes(a)));
    if (furnishedOnly) out = out.filter((p) => p.furnished);
    if (verifiedOnly) out = out.filter((p) => p.verified);

    switch (sort) {
      case "price_asc": out.sort((a, b) => a.price - b.price); break;
      case "price_desc": out.sort((a, b) => b.price - a.price); break;
      case "size_desc": out.sort((a, b) => (b.size ?? 0) - (a.size ?? 0)); break;
      case "views": out.sort((a, b) => (b.views ?? 0) - (a.views ?? 0)); break;
      default: out.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return out;
  }, [properties, q, selectedTypes, listing, minPrice, maxPrice, beds, baths, selectedHoods, selectedAmenities, furnishedOnly, verifiedOnly, sort]);

  useEffect(() => { setVisibleCount(9); }, [filtered]);

  const activeFilterCount =
    selectedTypes.length + selectedHoods.length + selectedAmenities.length +
    (listing ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) +
    (beds ? 1 : 0) + (baths ? 1 : 0) + (furnishedOnly ? 1 : 0) + (verifiedOnly ? 1 : 0);

  function clearAll() {
    setQ(""); setSelectedTypes([]); setListing(""); setMinPrice(""); setMaxPrice("");
    setBeds(""); setBaths(""); setSelectedHoods([]); setSelectedAmenities([]);
    setFurnishedOnly(false); setVerifiedOnly(false);
  }

  function toggle<T>(arr: T[], set: (v: T[]) => void, item: T) {
    set(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  }

  /* ---------- Filter panel content (shared between sidebar & drawer) ---------- */
  const filterPanel = (
    <div className="space-y-8">
      {/* Buy / Rent */}
      <div>
        <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Purpose</p>
        <div className="grid grid-cols-3 gap-1 p-1 bg-cream border border-ink/[0.06]">
          {[["", "All"], ["sale", "Buy"], ["rent", "Rent"]].map(([v, label]) => (
            <button key={v} onClick={() => setListing(v)}
              className={`py-2 text-[12px] font-body font-semibold transition-colors ${listing === v ? "bg-ink text-white" : "text-graphite/60 hover:text-ink"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Property types */}
      <div>
        <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Property Type</p>
        <div className="space-y-2">
          {TYPES.map((t) => {
            const typeData = propertyTypes.find(pt => pt.value === t);
            return (
              <label key={t} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedTypes.includes(t) ? "bg-brass border-brass" : "border-ink/20 group-hover:border-brass"}`}>
                  {selectedTypes.includes(t) && <svg className="w-3 h-3 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                {typeData?.imageUrl && (
                  <img src={typeData.imageUrl} alt={typeData.label} className="w-8 h-8 object-cover border border-ink/10" />
                )}
                <span className="text-sm font-body text-graphite capitalize group-hover:text-ink">
                  {typeData?.label || t}
                </span>
                <span className="ml-auto text-[11px] text-stone-400 font-body">{properties.filter((p) => p.propertyType === t).length}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Price (ETB)</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 px-3 py-2.5 bg-cream border border-ink/[0.08] text-sm font-body focus:outline-none focus:border-brass" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 px-3 py-2.5 bg-cream border border-ink/[0.08] text-sm font-body focus:outline-none focus:border-brass" />
        </div>
      </div>

      {/* Beds / baths */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Beds</p>
          <div className="flex flex-wrap gap-1.5">
            {["", "1", "2", "3", "4", "5"].map((v) => (
              <button key={v} onClick={() => setBeds(v)}
                className={`min-w-[36px] px-2 py-1.5 text-[12px] font-body font-semibold border transition-colors ${beds === v ? "bg-ink text-white border-ink" : "border-ink/[0.1] text-graphite/60 hover:border-ink/30"}`}>
                {v === "" ? "Any" : `${v}+`}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Baths</p>
          <div className="flex flex-wrap gap-1.5">
            {["", "1", "2", "3"].map((v) => (
              <button key={v} onClick={() => setBaths(v)}
                className={`min-w-[36px] px-2 py-1.5 text-[12px] font-body font-semibold border transition-colors ${baths === v ? "bg-ink text-white border-ink" : "border-ink/[0.1] text-graphite/60 hover:border-ink/30"}`}>
                {v === "" ? "Any" : `${v}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Neighborhoods */}
      <div>
        <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Neighborhood</p>
        <div className="flex flex-wrap gap-1.5">
          {neighborhoods.map((n) => (
            <button key={n} onClick={() => toggle(selectedHoods, setSelectedHoods, n)}
              className={`px-3 py-1.5 text-[12px] font-body font-medium rounded-full border transition-colors ${selectedHoods.includes(n) ? "bg-brass text-ink border-brass" : "border-ink/[0.12] text-graphite/70 hover:border-brass"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Amenities</p>
        <div className="flex flex-wrap gap-1.5">
          {amenities.slice(0, 12).map((a) => (
            <button key={a} onClick={() => toggle(selectedAmenities, setSelectedAmenities, a)}
              className={`px-3 py-1.5 text-[12px] font-body font-medium rounded-full border transition-colors ${selectedAmenities.includes(a) ? "bg-ink text-white border-ink" : "border-ink/[0.12] text-graphite/70 hover:border-ink/30"}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        {[
          { label: "Furnished only", val: furnishedOnly, set: setFurnishedOnly },
          { label: "Verified only", val: verifiedOnly, set: setVerifiedOnly },
        ].map((t) => (
          <button key={t.label} onClick={() => t.set(!t.val)} className="flex items-center justify-between w-full group">
            <span className="text-sm font-body text-graphite group-hover:text-ink">{t.label}</span>
            <span className={`w-10 h-5.5 h-[22px] rounded-full relative transition-colors ${t.val ? "bg-brass" : "bg-ink/15"}`}>
              <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${t.val ? "left-[21px]" : "left-[3px]"}`} />
            </span>
          </button>
        ))}
      </div>

      <button onClick={clearAll} className="text-[12px] font-body font-semibold text-slate border-b border-slate/30 pb-0.5 hover:text-ink hover:border-ink transition-colors">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="relative pt-36 pb-14 bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `radial-gradient(circle at 15% 50%, rgba(196,169,107,0.25), transparent 45%), radial-gradient(circle at 85% 30%, rgba(44,108,143,0.3), transparent 45%)`,
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Explore Listings</p>
            <h1 className="font-display text-white text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]">
              Every home has a match.
            </h1>
            <p className="text-white/50 font-body mt-4">{filtered.length} properties available right now</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {/* Top toolbar: search + sort + view + filter toggle */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-8">
          <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-cream border border-ink/[0.08] focus-within:border-brass transition-colors">
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px] text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, address, or neighborhood…"
              className="w-full bg-transparent text-ink text-sm font-body placeholder-stone-400 focus:outline-none"
            />
            {q && <button onClick={() => setQ("")} className="text-stone-400 hover:text-ink text-sm">✕</button>}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3.5 bg-cream border border-ink/[0.08] text-sm font-body text-graphite focus:outline-none appearance-none cursor-pointer pr-8"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23777263' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
              <option value="featured">Featured first</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="size_desc">Largest first</option>
              <option value="views">Most viewed</option>
            </select>

            {/* Filter toggle (mobile + desktop) */}
            <button onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-3.5 bg-ink text-white text-sm font-body font-semibold hover:bg-graphite transition-colors relative">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brass text-ink text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* View toggle */}
            <div className="hidden sm:flex border border-ink/[0.08]">
              <button onClick={() => setView("grid")} aria-label="Grid view"
                className={`p-3.5 transition-colors ${view === "grid" ? "bg-ink text-white" : "bg-cream text-stone-400 hover:text-ink"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              </button>
              <button onClick={() => setView("list")} aria-label="List view"
                className={`p-3.5 transition-colors ${view === "list" ? "bg-ink text-white" : "bg-cream text-stone-400 hover:text-ink"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Active chips */}
        {(q || activeFilterCount > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {q && (
              <button onClick={() => setQ("")} className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-white text-[12px] font-body rounded-full">
                "{q}" <span>✕</span>
              </button>
            )}
            {selectedTypes.map((t) => (
              <button key={t} onClick={() => toggle(selectedTypes, setSelectedTypes, t)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brass text-ink text-[12px] font-body font-semibold rounded-full capitalize">
                {t} <span>✕</span>
              </button>
            ))}
            {selectedHoods.map((h) => (
              <button key={h} onClick={() => toggle(selectedHoods, setSelectedHoods, h)} className="flex items-center gap-1.5 px-3 py-1.5 bg-graphite text-white text-[12px] font-body rounded-full">
                {h} <span>✕</span>
              </button>
            ))}
            {selectedAmenities.map((a) => (
              <button key={a} onClick={() => toggle(selectedAmenities, setSelectedAmenities, a)} className="flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-ink/[0.12] text-ink text-[12px] font-body rounded-full">
                {a} <span>✕</span>
              </button>
            ))}
            <button onClick={clearAll} className="text-[12px] font-body font-semibold text-slate underline underline-offset-2">Clear all</button>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-cream border border-ink/[0.06]">
            <svg className="w-14 h-14 mx-auto mb-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <h3 className="font-display text-2xl text-ink mb-2">No matches found</h3>
            <p className="text-stone-400 font-body text-sm mb-6">Try broadening your criteria or clearing some filters</p>
            <button onClick={clearAll} className="px-6 py-3 bg-ink text-white text-sm font-body font-semibold rounded-full hover:bg-graphite transition-colors">
              Reset Filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.slice(0, visibleCount).map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.slice(0, visibleCount).map((p, i) => (
              <PropertyListRow key={p.id} property={p} index={i} />
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-12">
            <button onClick={() => setVisibleCount((c) => c + 9)}
              className="px-8 py-3.5 border-2 border-ink text-ink font-body font-semibold text-sm rounded-full hover:bg-ink hover:text-white transition-colors">
              Load more ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[95] w-full max-w-sm bg-linen overflow-y-auto"
            >
              <div className="sticky top-0 bg-linen flex items-center justify-between px-6 py-5 border-b border-ink/[0.08] z-10">
                <h3 className="font-display text-2xl text-ink">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:border-brass hover:text-brass transition-colors">
                  ✕
                </button>
              </div>
              <div className="p-6 pb-24">{filterPanel}</div>
              <div className="sticky bottom-0 bg-linen border-t border-ink/[0.08] p-4">
                <button onClick={() => setFiltersOpen(false)}
                  className="w-full py-3.5 bg-ink text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-graphite transition-colors">
                  Show {filtered.length} results
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
