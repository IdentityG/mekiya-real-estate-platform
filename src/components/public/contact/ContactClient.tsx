"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Agent {
  id: number;
  name: string;
  role: string;
  specialty: string | null;
  phone: string | null;
  email: string;
}

interface Props {
  agents: Agent[];
  activeListings: number;
}

const faqs = [
  { q: "How quickly will I hear back?", a: "Within two business hours during office hours (Mon–Sat, 9:00–18:00). Outside those hours we reply first thing the next morning." },
  { q: "Is there a fee to enquire or book a viewing?", a: "No. Enquiries, viewings, and advice are free and carry no obligation. We only earn revenue when a sale or lease completes." },
  { q: "Can I visit the office in person?", a: "Absolutely — Bole Road, near Friendship Square, Addis Ababa. Walk-ins welcome during office hours, or book a visit below and we'll have your agent ready." },
  { q: "Do you help international / diaspora clients?", a: "Yes. We work with Ethiopians in the diaspora every week, using video walkthroughs and online documentation so you can buy from anywhere." },
  { q: "Can a mortgage help before I find a property?", a: "Yes. Starting pre-qualification early means your offer is stronger when you find the right home. See our Financing guide for the process." },
  { q: "What languages does your team speak?", a: "Amharic, English, and Afaan Oromo across the team. Tell us your preference and we'll match you with the right agent." },
];

const officeHours = [
  { day: "Monday — Friday", hours: "9:00 — 18:00" },
  { day: "Saturday", hours: "9:00 — 14:00" },
  { day: "Sunday", hours: "By appointment" },
];

export function ContactClient({ agents, activeListings }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");
    const form = new FormData(e.currentTarget);

    const intent = form.get("intent") || "general";
    const message = String(form.get("message") || "");
    const related = form.get("related") || "none";

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          leadType: intent === "buy" ? "buy" : intent === "rent" ? "rent" : "general",
          source: "contact_page",
          message: `[${intent}] Related: ${related} — ${message}`,
        }),
      });
      setFormMessage("Thank you — your message is with our team.");
      if (!res.ok) throw new Error();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  }

  async function handleQuickMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          leadType: "general",
          source: "contact_quick_form",
          message: String(form.get("message") || ""),
        }),
      });
      if (!res.ok) throw new Error();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  }

  const inputCls =
    "w-full px-4 py-3.5 bg-white border border-ink/[0.1] text-ink text-sm font-body placeholder-stone-400 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 transition-all";

  const labelCls = "block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2";

  return (
    <div className="bg-linen min-h-screen">
      {/* ===== HERO — bold, high-energy split ===== */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image src="/images/about-office.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/70" />
        </div>
        {/* Floating accent orbs */}
        <div className="absolute -top-24 right-10 w-72 h-72 rounded-full bg-brass/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -left-10 w-80 h-80 rounded-full bg-slate/15 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md mb-7">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-[0.12em]">
                <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" /> Live
              </span>
              <span className="text-white/70 text-xs font-body">Average reply in under 2h</span>
            </span>
            <h1 className="font-display text-white text-[clamp(2.6rem,6vw,5rem)] leading-[0.92] tracking-[-0.03em]">
              Talk to a human,<br /><span className="italic text-brass">not a chatbot.</span>
            </h1>
            <p className="text-white/55 text-base sm:text-lg font-body leading-relaxed mt-6 max-w-lg">
              Real agents in Addis Ababa — licensed, local, and ready. Tell us what you need and we'll
              get back to you within two business hours.
            </p>
          </motion.div>

          {/* Quick action cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-12">
            {[
              { icon: "📞", label: "Call us", sub: "+251 911 234 567", href: "tel:+251911234567" },
              { icon: "💬", label: "WhatsApp", sub: "Instant reply", href: "https://wa.me/251911234567" },
              { icon: "✉️", label: "Email us", sub: "info@mekiya.com", href: "mailto:info@mekiya.com" },
              { icon: "📍", label: "Visit office", sub: "Bole, Addis Ababa", href: "#office" },
            ].map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/12 backdrop-blur-md hover:bg-white/[0.12] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span className="w-11 h-11 rounded-xl bg-brass/15 flex items-center justify-center text-xl shrink-0 group-hover:bg-brass/25 transition-colors">{c.icon}</span>
                <span className="min-w-0">
                  <span className="block text-white text-sm font-body font-semibold">{c.label}</span>
                  <span className="block text-white/50 text-xs font-body truncate">{c.sub}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN: Left form / Right sticky panel ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-7">
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Send a message</p>
            <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-8">
              Tell us what you&apos;re<br /><span className="italic text-brass">looking for.</span>
            </h2>

            <AnimatePresence mode="wait" initial={false}>
              {formState === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-ink text-white p-12 text-center rounded-2xl"
                >
                  <div className="w-16 h-16 rounded-full bg-brass/15 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl tracking-tight mb-3">Message received 🎉</h3>
                  <p className="text-white/60 font-body max-w-md mx-auto mb-8">
                    {formMessage || "An agent will reach out within two business hours. Check your phone — we move fast."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="https://wa.me/251911234567" className="px-6 py-3 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors">
                      WhatsApp instead
                    </a>
                    <button onClick={() => setFormState("idle")} className="px-6 py-3 border border-white/25 text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:border-brass transition-colors">
                      Send another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="bg-cream border border-ink/[0.08] p-7 lg:p-10"
                >
                  {/* Intent selector */}
                  <div className="mb-6">
                    <span className={labelCls}>I&apos;m interested in…</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { v: "buy", label: "Buying" },
                        { v: "rent", label: "Renting" },
                        { v: "sell", label: "Selling" },
                        { v: "general", label: "General" },
                      ].map((o) => (
                        <label key={o.v} className="cursor-pointer">
                          <input type="radio" name="intent" value={o.v} defaultChecked={o.v === "general"} className="sr-only peer" />
                          <span className="flex items-center justify-center py-3 text-[13px] font-body font-semibold border border-ink/[0.12] text-graphite/70 peer-checked:bg-ink peer-checked:text-white peer-checked:border-ink transition-colors">
                            {o.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="c-name" className={labelCls}>Full name *</label>
                      <input id="c-name" name="name" required placeholder="Your name" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className={labelCls}>Phone</label>
                      <input id="c-phone" name="phone" type="tel" placeholder="+251…" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="c-email" className={labelCls}>Email *</label>
                      <input id="c-email" name="email" type="email" required placeholder="you@example.com" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="c-related" className={labelCls}>Related property</label>
                      <select id="c-related" name="related" defaultValue="" className={`${inputCls} appearance-none`}>
                        <option value="">Not specific yet</option>
                        <option value="Apartment, CMC Block 8">Apartment, CMC Block 8</option>
                        <option value="Apartment, CMC Block 9">Apartment, CMC Block 9</option>
                        <option value="Penthouse, CMC Block 8">Penthouse, CMC Block 8</option>
                        <option value="Office, Bole Road">Office, Bole Road</option>
                        <option value="Studio, Bole Atlas">Studio, Bole Atlas</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="c-msg" className={labelCls}>Message *</label>
                    <textarea id="c-msg" name="message" required rows={5} placeholder="Tell us about your budget, timeline, or what you're looking for…" className={`${inputCls} resize-none`} />
                  </div>

                  {formState === "error" && (
                    <p className="text-red-500 text-sm font-body mb-4">Something went wrong. Please try again or call us.</p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "sending"}
                    className="w-full py-4 bg-ink text-white font-body font-bold text-sm uppercase tracking-[0.12em] rounded-full hover:bg-brass hover:text-ink transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {formState === "sending" ? "Sending…" : "Send Message"}
                    {formState !== "sending" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
                    )}
                  </button>
                  <p className="text-stone-400 text-xs font-body text-center mt-4">
                    Avg. response under 2h · No obligation · No spam, ever
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky right panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-5">
              {/* Agent availability */}
              <div className="bg-ink text-white p-7">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-brass">Team available now</p>
                  <span className="flex items-center gap-1.5 text-white/60 text-xs font-body">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </div>
                <div className="space-y-px bg-white/[0.08] border border-white/[0.08]">
                  {agents.slice(0, 3).map((agent) => (
                    <div key={agent.id} className="bg-ink p-4 flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-brass/30">
                        <Image src="/images/about-office.jpg" alt="" fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body font-semibold text-white text-sm">{agent.name}</p>
                        <p className="text-white/40 text-xs font-body">{agent.specialty || agent.role}</p>
                      </div>
                      {agent.phone && (
                        <a href={`tel:${agent.phone}`} aria-label={`Call ${agent.name}`} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brass hover:text-ink transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                        </a>
                      )}
                      <a href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brass hover:text-ink transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div className="bg-cream border border-ink/[0.08] p-7" id="office">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-brass mb-6">Visit the office</p>
                <div className="mb-6">
                  <p className="font-body font-semibold text-ink">Bole Road, Addis Ababa</p>
                  <p className="text-graphite/60 text-sm font-body mt-1">Near Friendship Square, Ethiopia</p>
                </div>
                <div className="space-y-0 border-t border-ink/[0.08]">
                  {officeHours.map((o) => (
                    <div key={o.day} className="flex items-center justify-between py-3 border-b border-ink/[0.05] last:border-0 text-sm font-body">
                      <span className="text-graphite/60">{o.day}</span>
                      <span className="text-ink font-semibold">{o.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats band ===== */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/[0.08]">
            {[
              { v: "2h", l: "Avg. response time" },
              { v: `${activeListings}+`, l: "Active listings" },
              { v: "500+", l: "Properties sold" },
              { v: "4.9★", l: "Client rating" },
            ].map((s, i) => (
              <div key={s.l} className={`p-8 text-center ${i < 3 ? "border-r border-white/[0.08]" : ""} ${i < 2 ? "border-b border-white/[0.08] lg:border-b-0" : ""}`}>
                <p className="font-display text-4xl text-brass tracking-tight">{s.v}</p>
                <p className="text-white/40 text-xs font-body uppercase tracking-[0.14em] mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ (compact interactive) ===== */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-center mb-12">
          <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Quick answers</p>
          <h2 className="font-display text-ink text-[clamp(2rem,4vw,3rem)] leading-[0.98] tracking-[-0.02em]">
            Before you even ask
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={f.q} className="bg-cream border border-ink/[0.08] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`font-body ${isOpen ? "text-brass font-semibold" : "text-ink font-medium"} text-[15px]`}>{f.q}</span>
                  <span className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-brass border-brass rotate-45" : "border-ink/15"}`}>
                    <svg className={`w-4 h-4 ${isOpen ? "text-ink" : "text-graphite"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-graphite/70 font-body leading-[1.8] px-5 pb-5 text-sm">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <p className="text-stone-400 text-sm font-body mb-5">More questions? See the full {""}
            <a href="/faq" className="text-brass font-semibold underline underline-offset-2 hover:text-ink">FAQ page</a>.
          </p>
          <form onSubmit={handleQuickMessage} className="max-w-md mx-auto flex gap-2">
            <input type="hidden" name="name" value="Quick contact" />
            <input type="hidden" name="message" value="I would like to be contacted about properties." />
            <input name="email" type="email" required placeholder="your@email.com" aria-label="Email" className="flex-1 px-4 py-3 bg-white border border-ink/[0.1] text-sm font-body focus:outline-none focus:border-brass" />
            <button type="submit" disabled={formState === "sending"} className="px-6 py-3 bg-ink text-white text-sm font-body font-bold rounded-full hover:bg-brass hover:text-ink transition-colors disabled:opacity-60">
              {formState === "sending" ? "…" : "DM me"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
