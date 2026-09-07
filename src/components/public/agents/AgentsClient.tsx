"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Star, Clock, Globe, ShieldCheck } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  role: string;
  specialty: string | null;
  bio: string | null;
  phone: string | null;
  email: string;
  avatarUrl: string | null;
  listingCount: number;
}

const roleLabels: Record<string, string> = {
  super_admin: "Founder & Director",
  sales_manager: "Sales Manager",
  agent: "Property Agent",
};

// Real portrait photography per agent (matched by email, fallback by position)
const portraits: Record<string, string> = {
  "admin@mekiya.com":
    "https://images.pexels.com/photos/31480550/pexels-photo-31480550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "sara@mekiya.com":
    "https://images.pexels.com/photos/5466267/pexels-photo-5466267.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "dawit@mekiya.com":
    "https://images.pexels.com/photos/36741892/pexels-photo-36741892.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "helen@mekiya.com":
    "https://images.pexels.com/photos/5905901/pexels-photo-5905901.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
};

const fallbackPortraits = [
  "https://images.pexels.com/photos/31480550/pexels-photo-31480550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/5466267/pexels-photo-5466267.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/36741892/pexels-photo-36741892.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  "https://images.pexels.com/photos/5905901/pexels-photo-5905901.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
];

function portraitFor(agent: Agent, index: number) {
  // Use avatar from database if available, otherwise fallback
  if (agent.avatarUrl) return agent.avatarUrl;
  return portraits[agent.email] ?? fallbackPortraits[index % fallbackPortraits.length];
}

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

type Filter = "all" | "apartments" | "commercial";

function matchesFilter(agent: Agent, f: Filter) {
  if (f === "all") return true;
  const s = (agent.specialty || "").toLowerCase() + " " + (agent.bio || "").toLowerCase();
  if (f === "apartments") return s.includes("apartment");
  return s.includes("commercial");
}

export function AgentsClient({ agents }: { agents: Agent[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const lead = agents[0];
  const others = agents.slice(1).filter((a) => matchesFilter(a, filter));
  const leadMatches = matchesFilter(lead, filter);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All agents" },
    { id: "apartments", label: "Apartments" },
    { id: "commercial", label: "Commercial" },
  ];

  const counts = {
    all: agents.length,
    apartments: agents.filter((a) => matchesFilter(a, "apartments")).length,
    commercial: agents.filter((a) => matchesFilter(a, "commercial")).length,
  };

  return (
    <div className="bg-linen min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-24 bg-ink overflow-hidden">
        {/* Ambient */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-brass/[0.08] blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-slate/[0.12] blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-5"
              >
                The Team
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="font-display text-white text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.92] tracking-[-0.03em]"
              >
                The people behind<br />
                your <span className="italic text-brass">property.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-white/50 text-base sm:text-lg max-w-xl mt-6 font-body leading-relaxed"
              >
                Licensed. Multilingual. Obsessive about the details you never see.
                Your agent stays with you from the first walk-through to the keys in your hand.
              </motion.p>

              {/* Hero stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                className="flex flex-wrap gap-x-10 gap-y-5 mt-10"
              >
                {[
                  { v: `${agents.length}`, l: "Dedicated agents" },
                  { v: "3", l: "Languages spoken" },
                  { v: "2h", l: "Avg. response" },
                  { v: "98%", l: "Client rating" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-display text-3xl text-brass tracking-tight">{s.v}</p>
                    <p className="text-white/35 text-[10px] font-body font-bold uppercase tracking-[0.16em] mt-1">{s.l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Avatar cluster */}
            {agents.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="hidden lg:flex lg:col-span-5 justify-end"
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="relative w-32 h-40 overflow-hidden border-4 border-ink shadow-2xl">
                    <Image src={portraitFor(agents[0], 0)} alt={agents[0].name} fill sizes="128px" className="object-cover" priority />
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-brass text-ink px-3 py-1.5 text-[10px] font-body font-bold uppercase tracking-[0.12em]">
                    {roleLabels[agents[0]?.role ?? ""] || "Agent"}
                  </div>
                </div>
                <div className="relative -ml-6">
                  <div className="relative w-32 h-40 overflow-hidden border-4 border-ink shadow-2xl mt-8">
                    <Image src={portraitFor(agents[1], 1)} alt={agents[1].name} fill sizes="128px" className="object-cover" priority />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-ink border border-white/15 text-white px-3 py-1.5 text-[10px] font-body font-bold uppercase tracking-[0.12em]">
                    {roleLabels[agents[1]?.role ?? ""] || "Agent"}
                  </div>
                </div>
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <div className="sticky top-0 z-40 bg-linen/90 backdrop-blur-lg border-b border-ink/[0.07]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-[12px] font-body font-bold transition-colors ${
                  filter === f.id ? "bg-ink text-white" : "bg-white border border-ink/[0.1] text-graphite/70 hover:border-ink/30"
                }`}
              >
                {f.label}
                <span className={`ml-1.5 tabular-nums ${filter === f.id ? "text-brass" : "text-stone-400"}`}>{counts[f.id]}</span>
              </button>
            ))}
          </div>
          <p className="hidden sm:block text-[11px] font-body text-stone-400">
            {others.length + (lead && leadMatches ? 1 : 0)} of {agents.length} agents
          </p>
        </div>
      </div>

      {/* ===== LEAD SPOTLIGHT ===== */}
      {lead && leadMatches && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-12 gap-10 lg:gap-14"
          >
            {/* Portrait */}
            <div className="lg:col-span-5">
              <div className="relative max-w-sm mx-auto lg:mx-0">
                <div className="absolute -top-4 -left-4 w-full h-full border border-brass/40" />
                <div className="relative h-[420px] lg:h-[520px] overflow-hidden">
                  <Image
                    src={portraitFor(lead, 0)}
                    alt={lead.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3.5 py-2 bg-ink/70 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white text-[11px] font-body font-semibold">Available today</span>
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-ink text-white px-5 py-4">
                  <p className="font-display text-3xl text-brass leading-none">{lead.listingCount}+</p>
                  <p className="text-[9px] font-body font-bold uppercase tracking-[0.18em] text-white/40 mt-1">Listings managed</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">
                {roleLabels[lead.role] || lead.role}
              </p>
              <h2 className="font-display text-ink text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em]">
                {lead.name}
              </h2>
              {lead.specialty && (
                <p className="text-slate font-body font-medium mt-2">{lead.specialty}</p>
              )}
              <p className="font-display italic text-graphite/80 text-xl lg:text-2xl leading-snug mt-6 max-w-xl">
                &ldquo;{lead.bio}&rdquo;
              </p>

              {/* Quick facts */}
              <div className="flex flex-wrap gap-x-10 gap-y-4 mt-8 pt-8 border-t border-ink/[0.1]">
                {[
                  { icon: ShieldCheck, v: "Licensed", l: "& title-verified" },
                  { icon: Globe, v: "AM · EN · OO", l: "Amharic · English · Oromo" },
                  { icon: Clock, v: "< 2 hours", l: "response time" },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.l} className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-brass/12 flex items-center justify-center text-brass">
                        <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="text-[14px] font-body font-bold text-ink">{f.v}</p>
                        <p className="text-[10px] font-body text-stone-400 uppercase tracking-[0.12em]">{f.l}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-8">
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-white text-[12px] font-body font-bold uppercase tracking-[0.1em] rounded-full hover:bg-brass hover:text-ink transition-colors">
                    <Phone className="w-3.5 h-3.5" strokeWidth={2} /> Call {lead.name.split(" ")[0]}
                  </a>
                )}
                {lead.phone && (
                  <a href={waLink(lead.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366]/10 text-[#128C4B] border border-[#25D366]/25 text-[12px] font-body font-bold uppercase tracking-[0.1em] rounded-full hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} /> WhatsApp
                  </a>
                )}
                <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 px-7 py-3.5 border border-ink/20 text-ink text-[12px] font-body font-bold uppercase tracking-[0.1em] rounded-full hover:border-brass hover:text-brass transition-colors">
                  <Mail className="w-3.5 h-3.5" strokeWidth={2} /> Email
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ===== AGENT DIRECTORY ===== */}
      {(leadMatches && lead ? [lead, ...others] : others).length > 0 ? (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-3">Directory</p>
              <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.94] tracking-[-0.02em]">
                {filter === "all" ? "Meet the team" : filter === "apartments" ? "Our apartment specialists" : "Our commercial specialists"}
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(leadMatches && lead ? [lead, ...others] : others).map((agent, i) => (
              <motion.article
                key={agent.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.09 }}
                className={`group bg-white border border-ink/[0.08] overflow-hidden hover:border-brass/50 transition-colors duration-500 ${
                  i % 2 === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                {/* Portrait */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={portraitFor(agent, i)}
                    alt={agent.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top group-hover:scale-[1.05] transition-transform duration-[1.4s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                  {/* Status */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-ink/60 backdrop-blur-md rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white text-[10px] font-body font-semibold">Online</span>
                  </div>

                  {/* Name block */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-brass text-[10px] font-body font-bold uppercase tracking-[0.18em]">
                      {roleLabels[agent.role] || agent.role}
                    </p>
                    <h3 className="font-display text-white text-2xl tracking-tight mt-1">{agent.name}</h3>
                    {agent.specialty && (
                      <p className="text-white/55 text-[12px] font-body mt-0.5">{agent.specialty}</p>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {agent.bio && (
                    <p className="text-graphite/70 text-[13px] font-body leading-relaxed line-clamp-2">{agent.bio}</p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-brass fill-brass" strokeWidth={1.2} />
                      <span className="text-[12px] font-body font-bold text-ink">5.0</span>
                      <span className="text-[11px] font-body text-stone-400">rating</span>
                    </div>
                    <div className="text-[12px] font-body text-stone-400">
                      <span className="font-bold text-ink tabular-nums">{agent.listingCount}</span> active listings
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-1.5 mt-4">
                    {agent.phone && (
                      <a href={`tel:${agent.phone}`} aria-label={`Call ${agent.name}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-ink text-white text-[11px] font-body font-bold hover:bg-brass hover:text-ink transition-colors">
                        <Phone className="w-3 h-3" strokeWidth={2} /> Call
                      </a>
                    )}
                    {agent.phone && (
                      <a href={waLink(agent.phone)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${agent.name}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366]/10 text-[#128C4B] text-[11px] font-body font-bold hover:bg-[#25D366]/20 transition-colors">
                        <MessageCircle className="w-3 h-3" strokeWidth={2} /> Chat
                      </a>
                    )}
                    <a href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 border border-ink/15 text-ink text-[11px] font-body font-bold hover:border-brass hover:text-brass transition-colors">
                      <Mail className="w-3 h-3" strokeWidth={2} /> Email
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      ) : (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
          <div className="py-16 text-center border border-dashed border-ink/15">
            <p className="font-display text-2xl text-ink">No agents match that filter yet</p>
            <p className="text-stone-400 text-sm font-body mt-2">Try a different specialty.</p>
          </div>
        </div>
      )}

      {/* ===== WHY OUR AGENTS ===== */}
      <section className="bg-ink text-white relative overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-brass/[0.07] blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24 relative">
          <div className="max-w-2xl mb-14">
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">The Mekiya Standard</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.94] tracking-[-0.02em]">
              Agents you can<br /><span className="italic text-brass">hold accountable.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
            {[
              { title: "Licensed & vetted", desc: "Every agent holds a current Ethiopian real estate license and passes a background and reference check." },
              { title: "Block-level knowledge", desc: "They don't just know Addis Ababa — they know CMC by block, street, and building stock." },
              { title: "Three languages", desc: "Amharic, English, and Afaan Oromo. Tell us your preference and we'll match you." },
              { title: "One agent, end to end", desc: "The person who shows you the property is the person who negotiates and closes it." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-ink p-7"
              >
                <span className="font-display text-brass text-3xl italic leading-none">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-body font-semibold text-white text-[15px] mt-4 mb-2">{v.title}</h3>
                <p className="text-white/45 text-[13px] font-body leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Next Step</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] tracking-[-0.02em]">
              Meet your agent<br /><span className="italic text-brass">in person.</span>
            </h2>
            <p className="text-graphite/70 font-body leading-relaxed mt-5 max-w-md">
              Coffee at the Bole office, a walk through your shortlist, or a call from your city.
              Pick whatever feels right — your first meeting is free.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-ink text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-brass hover:text-ink transition-colors">
              Book a Meeting
            </Link>
            <Link href="/properties" className="flex items-center justify-center gap-2 px-8 py-4 border border-ink/20 text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:border-brass hover:text-brass transition-colors">
              Browse Properties First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
