"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { formatPrice, getPropertyTypeLabel } from "@/lib/utils";
import { PropertyCard } from "@/components/public/PropertyCard";
import { VisitRequestForm } from "@/components/public/properties/VisitRequestForm";
import { PropertyGallery } from "@/components/public/properties/PropertyGallery";
import { PaymentCalculator } from "@/components/public/properties/PaymentCalculator";
import { PropertyActions } from "@/components/public/properties/PropertyActions";
import { getPropertyImages, getTourVideo } from "@/lib/media";

interface Agent {
  id: number; name: string; email: string;
  phone: string | null; specialty: string | null; bio: string | null;
}

interface Property {
  id: number; title: string; slug: string; propertyType: string;
  listingType: string; status: string; price: number; currency: string;
  bedrooms: number | null; bathrooms: number | null; size: number | null;
  description: string | null; address: string | null; city: string | null;
  neighborhood: string | null; amenities: string[] | null;
  featured: boolean | null; verified: boolean | null; views: number | null;
  yearBuilt: number | null; furnished: boolean | null;
}

interface Props {
  property: Property;
  agent: Agent | null;
  similarProperties: Property[];
}

const nearbyData: Record<string, { label: string; dist: string }[]> = {
  Bole: [
    { label: "Bole International Airport", dist: "8 min drive" },
    { label: "Friendship Square & Park", dist: "5 min walk" },
    { label: "Edna Mall & Dining", dist: "4 min drive" },
    { label: "International Schools", dist: "7 min drive" },
  ],
  default: [
    { label: "Major shopping center", dist: "5–10 min" },
    { label: "Public transport hub", dist: "3 min walk" },
    { label: "Schools & healthcare", dist: "10 min drive" },
    { label: "City center", dist: "15 min drive" },
  ],
};

const trustItems = [
  { title: "Title Verified", desc: "Ownership documents checked by our legal team" },
  { title: "Physically Inspected", desc: "A Mekiya agent has walked this property" },
  { title: "Price Benchmarked", desc: "Compared against recent local transactions" },
];

const amenityIcons: Record<string, string> = {
  Parking: "🅿️", Elevator: "🛗", Security: "🛡️", Gym: "🏋️", "Swimming Pool": "🏊",
  Garden: "🌿", Generator: "⚡", "Water Tank": "💧", WiFi: "📶", Furnished: "🛋️",
  "Rooftop Terrace": "🌇", "Servant Quarters": "🏠", "Conference Room": "👥",
  "Guest House": "🏡", "Loading Dock": "📦", "Office Space": "💼", "Power Supply": "🔌",
  "Road Access": "🛣️", "Utilities Available": "🔧", "Clear Title": "📜", "Internet Ready": "🌐",
};

export function PropertyDetailClient({ property, agent, similarProperties }: Props) {
  const [formMode, setFormMode] = useState<"visit" | "offer" | null>(null);
  const [offerSent, setOfferSent] = useState(false);
  const images = getPropertyImages(property.slug, property.propertyType);
  const video = getTourVideo(property.id);
  const nearby = nearbyData[property.neighborhood || ""] || nearbyData.default;
  const pricePerSqm = property.size && property.size > 0 ? Math.round(property.price / property.size) : null;

  async function submitOffer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: property.id,
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        leadType: property.listingType === "rent" ? "rent" : "buy",
        source: "property_offer",
        message: `Offer: ${formatPrice(Number(form.get("amount")), property.currency)} — ${form.get("message") || ""}`,
      }),
    });
    setOfferSent(true);
  }

  const facts = [
    property.bedrooms && { label: "Bedrooms", value: property.bedrooms },
    property.bathrooms && { label: "Bathrooms", value: property.bathrooms },
    property.size && { label: "Living Area", value: `${property.size} m²` },
    property.yearBuilt && { label: "Built", value: property.yearBuilt },
    { label: "Type", value: getPropertyTypeLabel(property.propertyType) },
    { label: "Condition", value: property.furnished ? "Furnished" : "Unfurnished" },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <div className="bg-linen min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-ink pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <nav className="flex items-center gap-2 text-[11px] font-body uppercase tracking-[0.12em] text-white/40">
            <Link href="/" className="hover:text-brass transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-brass transition-colors">Properties</Link>
            <span>/</span>
            <Link href={`/properties?type=${property.propertyType}`} className="hover:text-brass transition-colors">{getPropertyTypeLabel(property.propertyType)}s</Link>
            <span>/</span>
            <span className="text-brass truncate max-w-[200px]">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Gallery with offset signature */}
      <PropertyGallery images={images} video={video} title={property.title} />

      {/* Title + price strip */}
      <section className="bg-cream border-b border-ink/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {property.featured && (
                  <span className="px-2.5 py-1 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.12em]">Featured</span>
                )}
                {property.verified && (
                  <span className="px-2.5 py-1 bg-ink text-white text-[10px] font-body font-bold uppercase tracking-[0.12em] flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-brass" /> Verified
                  </span>
                )}
                <span className="px-2.5 py-1 border border-ink/15 text-graphite text-[10px] font-body font-bold uppercase tracking-[0.12em]">
                  {property.listingType === "sale" ? "For Sale" : "For Rent"}
                </span>
                {(property.views ?? 0) > 100 && (
                  <span className="text-[11px] font-body text-stone-400">● {property.views} views</span>
                )}
              </div>
              <h1 className="font-display text-ink text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.02] tracking-[-0.02em]">
                {property.title}
              </h1>
              {property.address && (
                <p className="text-stone-400 font-body mt-2 flex items-center gap-1.5 text-sm">
                  <svg className="w-3.5 h-3.5 text-brass" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                  {property.address}{property.city ? `, ${property.city}` : ""}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="text-left lg:text-right">
                <p className="font-display text-brass text-[clamp(2rem,4vw,3rem)] leading-none tracking-tight">
                  {formatPrice(property.price, property.currency)}
                </p>
                <p className="text-stone-400 text-xs font-body mt-1.5">
                  {property.listingType === "rent" ? "per month" : pricePerSqm ? `${formatPrice(pricePerSqm)} per m²` : "asking price"}
                </p>
              </div>
              <PropertyActions propertyId={property.id} title={property.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip — hairline separated */}
      <section className="bg-linen border-b border-ink/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-ink/[0.08]">
            {facts.map((f) => (
              <div key={f.label} className="py-6 px-2 text-center">
                <p className="font-display text-ink text-xl lg:text-2xl tracking-tight">{f.value}</p>
                <p className="text-stone-400 text-[10px] font-body font-bold uppercase tracking-[0.15em] mt-1.5">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.2em] mb-4">The Property</p>
              <h2 className="font-display text-ink text-3xl tracking-tight mb-5">
                {property.neighborhood ? `Living in ${property.neighborhood}` : "About this home"}
              </h2>
              <p className="text-graphite/75 font-body leading-[1.8] whitespace-pre-line text-[15px]">
                {property.description}
              </p>
            </motion.section>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="font-display text-ink text-2xl tracking-tight mb-6">Amenities & Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 p-4 bg-cream border border-ink/[0.06] hover:border-brass/40 transition-colors">
                      <span className="text-xl">{amenityIcons[a] || "✔"}</span>
                      <span className="text-sm font-body text-graphite">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Location */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="font-display text-ink text-2xl tracking-tight mb-6">Location & What's Nearby</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {/* Map */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate/10 to-cream border border-ink/[0.06]">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(44,108,143,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(44,108,143,0.08) 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-20 h-20 rounded-full bg-brass/15 animate-ping" />
                      <div className="relative w-10 h-10 rounded-full bg-brass flex items-center justify-center shadow-lg z-10">
                        <svg className="w-5 h-5 text-ink" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white px-4 py-2 border border-ink/[0.08]">
                    <p className="text-xs font-body font-semibold text-ink">{property.neighborhood || property.city || "Addis Ababa"}</p>
                  </div>
                </div>
                {/* Nearby list */}
                <div className="bg-cream border border-ink/[0.06]">
                  {nearby.map((n, i) => (
                    <div key={n.label} className={`flex items-center justify-between px-5 py-4 ${i < nearby.length - 1 ? "border-b border-ink/[0.05]" : ""}`}>
                      <span className="text-sm font-body text-graphite">{n.label}</span>
                      <span className="text-[11px] font-body font-bold uppercase tracking-[0.1em] text-brass whitespace-nowrap">{n.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Payment calculator (sale only) */}
            {property.listingType === "sale" && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <PaymentCalculator price={property.price} />
              </motion.section>
            )}

            {/* Trust strip */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="grid sm:grid-cols-3 gap-px bg-ink/[0.08] border border-ink/[0.08]">
                {trustItems.map((t) => (
                  <div key={t.title} className="bg-cream p-5">
                    <p className="font-body font-semibold text-ink text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brass rounded-full" />{t.title}
                    </p>
                    <p className="text-stone-400 text-xs font-body mt-1.5 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right sticky sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* CTA block */}
            <div className="bg-ink text-white p-6">
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-brass mb-2">
                {property.listingType === "sale" ? "Make it yours" : "Move in"}
              </p>
              <h3 className="font-display text-2xl tracking-tight leading-tight">
                {property.listingType === "sale" ? "See it. Love it. Own it." : "Your next home is ready"}
              </h3>
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => { setFormMode(formMode === "visit" ? null : "visit"); setOfferSent(false); }}
                  className={`w-full py-3.5 font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full transition-colors ${
                    formMode === "visit" ? "bg-white text-ink" : "bg-brass text-ink hover:bg-white"
                  }`}
                >
                  Schedule a Visit
                </button>
                <button
                  onClick={() => { setFormMode(formMode === "offer" ? null : "offer"); setOfferSent(false); }}
                  className={`w-full py-3.5 font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full border transition-colors ${
                    formMode === "offer" ? "bg-white text-ink border-white" : "border-white/25 text-white hover:border-brass hover:text-brass"
                  }`}
                >
                  {property.listingType === "sale" ? "Make an Offer" : "Send Inquiry"}
                </button>
              </div>

              {/* Inline forms */}
              {formMode === "visit" && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <VisitRequestForm propertyId={property.id} propertyTitle={property.title} />
                </div>
              )}

              {formMode === "offer" && !offerSent && (
                <form onSubmit={submitOffer} className="mt-5 pt-5 border-t border-white/10 space-y-3">
                  <input name="amount" type="number" required min={1} placeholder={`Your offer (${property.currency})`}
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-brass" />
                  <input name="name" required placeholder="Full name *"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-brass" />
                  <input name="email" type="email" required placeholder="Email *"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-brass" />
                  <input name="phone" placeholder="Phone"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-brass" />
                  <textarea name="message" rows={2} placeholder="Message (finance plan, timeline…)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-brass resize-none" />
                  <button type="submit" className="w-full py-3.5 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors">
                    Submit Offer
                  </button>
                </form>
              )}

              {formMode === "offer" && offerSent && (
                <div className="mt-5 pt-5 border-t border-white/10 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-brass/15 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="font-body font-semibold">Offer received</p>
                  <p className="text-white/50 text-sm font-body mt-1">An agent will respond within 2 business hours.</p>
                </div>
              )}

              <p className="text-white/30 text-[11px] font-body text-center mt-4">
                No obligation · Response within 2 hours
              </p>
            </div>

            {/* Agent card */}
            {agent && (
              <div className="bg-cream border border-ink/[0.08] p-6">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">Your Agent</p>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-brass/30">
                    <Image src="/images/about-office.jpg" alt={agent.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-ink">{agent.name}</p>
                    {agent.specialty && <p className="text-slate text-xs font-body font-medium">{agent.specialty}</p>}
                    <p className="text-stone-400 text-[11px] font-body mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Typically replies in under 2h
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 py-2.5 bg-ink text-white text-xs font-body font-semibold hover:bg-graphite transition-colors">
                      Call
                    </a>
                  )}
                  <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-2 py-2.5 border border-ink/15 text-ink text-xs font-body font-semibold hover:border-brass transition-colors">
                    Email
                  </a>
                </div>
                {agent.phone && (
                  <a href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 py-2.5 bg-[#25D366]/10 text-[#1da851] text-xs font-body font-semibold border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
                    WhatsApp Agent
                  </a>
                )}
              </div>
            )}

            {/* Listing meta */}
            <div className="bg-cream border border-ink/[0.08] p-6">
              <div className="space-y-0">
                {([
                  ["Property ID", `MK-${String(property.id).padStart(4, "0")}`],
                  ["Type", getPropertyTypeLabel(property.propertyType)],
                  ["Status", property.listingType === "sale" ? "For Sale" : "For Rent"],
                  ["Furnishing", property.furnished ? "Furnished" : "Unfurnished"],
                  ["Views", String(property.views ?? 0)],
                  ...(property.yearBuilt ? [["Year Built", String(property.yearBuilt)]] : []),
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5 border-b border-ink/[0.05] last:border-0 text-sm font-body">
                    <span className="text-stone-400">{k}</span>
                    <span className="text-ink font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Similar properties */}
        {similarProperties.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.2em] mb-3">Keep Looking</p>
                <h2 className="font-display text-ink text-3xl tracking-tight">Similar Properties</h2>
              </div>
              <Link href={`/properties?type=${property.propertyType}`} className="text-slate text-sm font-body font-semibold border-b border-slate/30 pb-0.5 hover:text-ink hover:border-ink transition-colors whitespace-nowrap">
                More {getPropertyTypeLabel(property.propertyType)}s →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-brass font-display text-lg leading-none truncate">{formatPrice(property.price, property.currency)}</p>
          <p className="text-white/40 text-[10px] font-body mt-0.5">{property.listingType === "rent" ? "per month" : "asking price"}</p>
        </div>
        <button onClick={() => setFormMode("visit")}
          className="px-6 py-3 bg-brass text-ink font-body font-bold text-xs uppercase tracking-[0.1em] rounded-full">
          Book Visit
        </button>
      </div>
    </div>
  );
}
