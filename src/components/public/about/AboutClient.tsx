"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Agent {
  id: number;
  name: string;
  role: string;
  specialty: string | null;
  bio: string | null;
  phone: string | null;
  email: string;
}

interface Props {
  agents: Agent[];
  stats: { activeListings: number; testimonials: number; totalListings: number };
}

const agentImgs = ["/images/prop-penthouse.jpg", "/images/prop-apartment.jpg", "/images/prop-commercial.jpg", "/images/prop-villa.jpg", "/images/about-office.jpg"];

const values = [
  { icon: "🔍", title: "Verify, then publish", desc: "No listing goes live until our team has walked it and confirmed the title. If we can't verify it, we don't sell it." },
  { icon: "🤝", title: "Tell clients the truth", desc: "Even when honesty means losing the sale. Trust is the product; properties are the outcome." },
  { icon: "📊", title: "Price with evidence", desc: "Every valuation is built on recent comparable transactions in the same street — not a round guess." },
  { icon: "🌍", title: "Serve all Ethiopians", desc: "From first-time buyers in Ayat to diaspora investors in Bole — the same care, the same standards." },
];

const timeline = [
  { year: "2015", title: "Founded in Bole", desc: "Two agents, a shared desk, and a conviction that Ethiopian property deserved better." },
  { year: "2017", title: "100th sale", desc: "Reached one hundred completed transactions — built entirely on referrals and repeat clients." },
  { year: "2019", title: "Citywide reach", desc: "Opened coverage across every major Addis Ababa neighborhood, from CMC to Old Airport." },
  { year: "2022", title: "Go digital", desc: "Launched our platform so anyone, anywhere, could search, verify, and buy with confidence." },
  { year: "2024", title: "Market leader", desc: "1,200+ properties sold and a 98% satisfaction rate across 500+ verified listings." },
];

const principles = [
  "Title-verified listings only",
  "Licensed, vetted agents",
  "Written cost breakdowns",
  "No cash deposits — ever",
  "Commission only on completion",
  "Response within two hours",
];

export function AboutClient({ agents, stats }: Props) {
  const [lead, ...others] = agents;

  return (
    <div className="bg-linen min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-35">
          <Image src="/images/about-office.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/65" />
        </div>
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-brass/12 blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-5">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-white text-[clamp(2.6rem,6vw,5rem)] leading-[0.92] tracking-[-0.03em] max-w-4xl">
            We exist to make<br /><span className="italic text-brass">property honest.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base sm:text-lg font-body leading-relaxed mt-6 max-w-xl">
            Ethiopian real estate had a trust problem. We built Mekiya to be the exception — every
            listing verified, every fee disclosed, every client told the truth.
          </motion.p>

          {/* Quick stats strip */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-8 mt-12">
            {[
              { v: `${stats.totalListings}+`, l: "Listings managed" },
              { v: "8+", l: "Years active" },
              { v: "1,200+", l: "Properties sold" },
              { v: "98%", l: "Satisfaction" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-4xl text-brass tracking-tight">{s.v}</p>
                <p className="text-white/40 text-[11px] font-body uppercase tracking-[0.14em] mt-1">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MISSION + VALUES ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Intro */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">What we believe</p>
              <h2 className="font-display text-ink text-[clamp(2rem,4vw,3.5rem)] leading-[0.94] tracking-[-0.02em]">
                Principles before<br /><span className="italic text-brass">properties.</span>
              </h2>
              <p className="text-graphite/70 font-body leading-relaxed mt-6">
                Anyone can post a listing. Almost nobody can verify one. That gap is where bad deals
                hide — and it&apos;s the reason we built a process, not just a website.
              </p>
              <ul className="mt-8 space-y-3">
                {principles.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm font-body text-graphite">
                    <span className="w-5 h-5 rounded-full bg-brass/15 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Value cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
                className="bg-cream border border-ink/[0.08] p-7 hover:border-brass/40 hover:-translate-y-1 transition-all duration-400"
              >
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-ink text-2xl mb-5">{v.icon}</span>
                <h3 className="font-display text-ink text-xl tracking-tight mb-2">{v.title}</h3>
                <p className="text-graphite/65 font-body text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="bg-ink text-white relative overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-brass/[0.06] blur-3xl" />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="text-center mb-16">
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">The journey</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.94] tracking-[-0.02em]">
              A decade of<br /><span className="italic text-brass">earning trust.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-white/12" />
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative pl-12 sm:pl-0 flex ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  {/* dot */}
                  <span className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-1 w-3 h-3 rounded-full bg-brass ring-4 ring-ink" />
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-14 sm:text-right" : "sm:pl-14"}`}>
                    <span className="text-brass font-body font-bold text-sm">{t.year}</span>
                    <h3 className="font-display text-2xl tracking-tight mt-1 mb-2">{t.title}</h3>
                    <p className="text-white/50 font-body text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">The people</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4vw,3.5rem)] leading-[0.94] tracking-[-0.02em]">
              Agents you&apos;ll<br /><span className="italic text-brass">trust by name.</span>
            </h2>
          </div>
          <Link href="/agents" className="text-ink text-sm font-body font-semibold border-b-2 border-brass pb-0.5 hover:text-brass transition-colors whitespace-nowrap">
            Meet the full team →
          </Link>
        </div>

        {/* Lead spotlight */}
        {lead && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 bg-cream border border-ink/[0.08] overflow-hidden mb-6"
          >
            <div className="lg:col-span-4 relative h-72 lg:h-auto">
              <Image src={agentImgs[0]} alt={lead.name} fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              <span className="absolute top-5 left-5 px-3 py-1.5 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.14em]">
                {lead.role === "super_admin" ? "Founder & Director" : lead.role.replace("_", " ")}
              </span>
            </div>
            <div className="lg:col-span-8 p-8 lg:p-12">
              <h3 className="font-display text-ink text-3xl lg:text-4xl tracking-tight">{lead.name}</h3>
              {lead.specialty && <p className="text-slate font-body font-medium mt-1">{lead.specialty}</p>}
              <p className="text-graphite/70 font-body leading-relaxed mt-5 max-w-lg">{lead.bio}</p>
              <div className="flex flex-wrap gap-3 mt-7">
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="px-6 py-3 bg-ink text-white font-body font-semibold text-sm rounded-full hover:bg-graphite transition-colors">
                    Call {lead.name.split(" ")[0]}
                  </a>
                )}
                <a href={`mailto:${lead.email}`} className="px-6 py-3 border border-ink/20 text-ink font-body font-semibold text-sm rounded-full hover:border-brass hover:text-brass transition-colors">
                  Email {lead.name.split(" ")[0]}
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group bg-cream border border-ink/[0.08] overflow-hidden hover:border-brass/50 transition-colors duration-400"
            >
              <div className="relative h-64 overflow-hidden">
                <Image src={agentImgs[(i + 1) % agentImgs.length]} alt={agent.name} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-brass text-[10px] font-body font-bold uppercase tracking-[0.15em]">{agent.role.replace("_", " ")}</p>
                  <h3 className="font-display text-white text-xl tracking-tight mt-0.5">{agent.name}</h3>
                </div>
              </div>
              <div className="p-4">
                {agent.specialty && <p className="text-slate text-sm font-body font-medium">{agent.specialty}</p>}
                <div className="flex gap-2 mt-3">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} aria-label="Call" className="flex-1 py-2 text-center border border-ink/15 text-ink text-xs font-body font-semibold hover:border-brass hover:text-brass transition-colors">
                      Call
                    </a>
                  )}
                  <a href={`mailto:${agent.email}`} aria-label="Email" className="flex-1 py-2 text-center border border-ink/15 text-ink text-xs font-body font-semibold hover:border-brass hover:text-brass transition-colors">
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="bg-ink text-white relative overflow-hidden">
        <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-brass/10 blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-20 lg:py-24 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="flex -space-x-2">
              {["/images/prop-villa.jpg", "/images/prop-apartment.jpg", "/images/about-office.jpg"].map((src) => (
                <span key={src} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-ink">
                  <Image src={src} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ))}
            </span>
            <span className="text-brass text-xs font-body font-bold">★ 4.9 · {stats.testimonials}+ clients</span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[0.94] tracking-[-0.02em] mb-6">
            Let&apos;s find your<br /><span className="italic text-brass">next address.</span>
          </h2>
          <p className="text-white/55 font-body max-w-xl mx-auto mb-10">
            Whether you&apos;re buying, selling, or just exploring — talk to us. It costs nothing,
            and you&apos;ll learn the truth about the market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="px-8 py-4 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors">
              Browse Properties
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-white/25 text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:border-brass hover:text-brass transition-colors">
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
