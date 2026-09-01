"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Buying",
    tagline: "Your home, found.",
    desc: "From first shortlist to final signature — we handle search, verification, negotiation, and legal transfer. Every listing is physically inspected and title-verified before you ever step inside.",
    points: ["Title & ownership verification", "Mortgage & financing assistance", "Inspection reports on every listing", "Full legal transfer support"],
    img: "/images/prop-apartment.jpg",
  },
  {
    title: "Selling",
    tagline: "The right price, the right buyer.",
    desc: "We price with real market data, photograph professionally, and market your property across our network of 2,000+ qualified buyers. You approve every step.",
    points: ["Data-driven property valuation", "Professional photography & staging advice", "Qualified buyer screening", "Negotiation handled end-to-end"],
    img: "/images/prop-penthouse.jpg",
  },
  {
    title: "Renting & Leasing",
    tagline: "Furnished or blank canvas.",
    desc: "Executive furnished apartments for expatriates and companies, or long-term family rentals across CMC and Bole — with transparent contracts and fair deposit handling.",
    points: ["Furnished executive rentals", "Corporate leasing packages", "Fair deposit protection", "Landlord management services"],
    img: "/images/prop-office.jpg",
  },
  {
    title: "Investment Advisory",
    tagline: "Property that compounds.",
    desc: "Addis Ababa apartment and commercial stock is one of Africa's fastest-growing markets. We help diaspora and local investors build portfolios with real yield projections and exit strategies.",
    points: ["Yield & ROI analysis", "Buy-to-rent opportunities", "Diaspora purchase facilitation", "Portfolio management"],
    img: "/images/prop-commercial.jpg",
  },
];

const steps = [
  { n: "Consultation", desc: "Tell us your goals — budget, location, timeline. We map the market to you." },
  { n: "Shortlist & Visit", desc: "Curated options only. Guided visits with honest assessments." },
  { n: "Verify & Negotiate", desc: "Title checks, inspections, and hard-nosed negotiation on your side." },
  { n: "Close & Handover", desc: "Legal transfer, keys in hand, and post-sale support that lasts." },
];

export function ServicesClient() {
  return (
    <div className="bg-linen min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/about-office.jpg" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/70 to-ink" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-5">
            Full-Service Brokerage
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-white text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] max-w-3xl">
            From first search<br /><span className="italic text-brass">to final key.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mt-6 font-body">
            Buying, selling, renting, or investing — one accountable team handles the whole journey.
          </motion.p>
        </div>
      </section>

      {/* Services — alternating full-bleed rows */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="space-y-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className={`grid lg:grid-cols-2 bg-cream border border-ink/[0.08] overflow-hidden ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
            >
              <div className="relative h-72 lg:h-auto [direction:ltr]">
                <Image src={s.img} alt={s.title} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="p-8 lg:p-14 [direction:ltr]">
                <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.2em]">{s.tagline}</p>
                <h2 className="font-display text-ink text-3xl lg:text-4xl tracking-tight mt-3 mb-5">{s.title}</h2>
                <p className="text-graphite/70 font-body leading-relaxed mb-8">{s.desc}</p>
                <ul className="space-y-3 mb-8">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-sm font-body text-graphite">
                      <span className="w-1.5 h-1.5 bg-brass rounded-full mt-1.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="text-slate font-body font-semibold text-sm border-b border-slate/30 pb-0.5 hover:text-ink hover:border-ink transition-colors">
                  Enquire about {s.title.toLowerCase()} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="max-w-2xl mb-14">
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">How it works</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]">
              Four steps. Zero surprises.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07]">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-ink p-8"
              >
                <span className="font-display text-brass text-4xl italic">{i + 1}</span>
                <h3 className="font-body font-semibold text-lg mt-4 mb-2">{step.n}</h3>
                <p className="text-white/45 text-sm font-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="bg-graphite text-white p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brass/10 blur-3xl" />
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight relative">Ready to begin?</h2>
          <p className="text-white/50 font-body mt-3 mb-8 relative">First consultation is free — no obligation.</p>
          <Link href="/contact" className="inline-block px-10 py-4 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors relative">
            Book Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
