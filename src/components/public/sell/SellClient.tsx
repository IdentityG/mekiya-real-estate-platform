"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHero } from "@/components/public/PageHero";
import { IMG } from "@/lib/images";

const benefits = [
  { title: "Free written valuation", desc: "Backed by recent comparable sales in your street, not a guess." },
  { title: "Professional photography", desc: "Included at no cost. Listings with our photography sell 40% faster." },
  { title: "Qualified buyers only", desc: "We screen for financing before anyone walks through your door." },
  { title: "No upfront fees", desc: "Commission is agreed in writing and only payable on completion." },
];

const timeline = [
  { title: "Valuation visit", meta: "Day 1–3", desc: "An agent inspects the property and delivers a written valuation with comparables." },
  { title: "Listing goes live", meta: "Day 4–7", desc: "Photography, floor plan, and description published across our platform and buyer network." },
  { title: "Viewings begin", meta: "Week 2", desc: "We accompany every viewing and report feedback after each one." },
  { title: "Offer & completion", meta: "Week 4–10", desc: "We negotiate, verify buyer funds, and manage the title transfer to closing." },
];

export function SellClient() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone"),
          leadType: "general",
          source: "sell_valuation",
          message: `SELLER LEAD — Type: ${f.get("type")} | Location: ${f.get("location")} | Bedrooms: ${f.get("bedrooms") || "n/a"} | Size: ${f.get("size") || "n/a"} m² | Expected price: ${f.get("expected") || "n/a"} | Notes: ${f.get("notes") || "none"}`,
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  const inputCls =
    "w-full px-4 py-3 bg-linen border border-ink/[0.1] text-ink text-sm font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";

  return (
    <div className="bg-linen min-h-screen">
      <PageHero
        breadcrumb="Sell"
        eyebrow="For Owners"
        title="Sell for what it's"
        accent="actually worth."
        description="Free valuation, professional marketing, screened buyers, and commission only when the deal closes."
        image={IMG.villa}
      />

      {/* Valuation form + benefits */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Benefits */}
          <div className="lg:col-span-5">
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Why list with Mekiya</p>
            <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-8">
              Your property deserves<br /><span className="italic text-brass">a real strategy.</span>
            </h2>
            <div className="space-y-px bg-ink/10 border border-ink/10">
              {benefits.map((b) => (
                <div key={b.title} className="bg-cream p-6">
                  <p className="font-body font-semibold text-ink flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brass" />{b.title}
                  </p>
                  <p className="text-graphite/60 text-sm font-body mt-1.5 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 p-5 bg-cream border border-ink/[0.08]">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-brass/30">
                <Image src={IMG.aboutOffice} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <p className="font-display text-ink text-lg">Average 42 days to sale</p>
                <p className="text-stone-400 text-sm font-body">Across 1,200+ completed transactions</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-cream border border-ink/[0.08] p-8 lg:p-10"
          >
            {state === "done" ? (
              <div className="text-center py-14">
                <div className="w-16 h-16 rounded-full bg-brass/15 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-ink text-3xl tracking-tight mb-3">Request received</h3>
                <p className="text-graphite/65 font-body max-w-md mx-auto">
                  A senior agent will call you within one business day to arrange the valuation visit.
                  Nothing to pay, nothing to sign.
                </p>
              </div>
            ) : (
              <>
                <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.2em] mb-3">Free Valuation</p>
                <h3 className="font-display text-ink text-3xl tracking-tight mb-2">Tell us about your property</h3>
                <p className="text-graphite/60 font-body text-sm mb-8">Takes two minutes. No obligation to list.</p>

                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="s-type" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Property type *</label>
                      <select id="s-type" name="type" required className={`${inputCls} appearance-none`}>
                        <option value="apartment">Apartment</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="s-loc" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Location *</label>
                      <input id="s-loc" name="location" required placeholder="e.g. Bole, near Friendship" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="s-bed" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Bedrooms</label>
                      <input id="s-bed" name="bedrooms" type="number" min={0} placeholder="3" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="s-size" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Size (m²)</label>
                      <input id="s-size" name="size" type="number" min={0} placeholder="150" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="s-exp" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Expected price</label>
                      <input id="s-exp" name="expected" placeholder="ETB" className={inputCls} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-ink/[0.07]" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="s-name" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Your name *</label>
                      <input id="s-name" name="name" required placeholder="Full name" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="s-phone" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Phone *</label>
                      <input id="s-phone" name="phone" required placeholder="+251…" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="s-email" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Email *</label>
                    <input id="s-email" name="email" type="email" required placeholder="you@example.com" className={inputCls} />
                  </div>

                  <div>
                    <label htmlFor="s-notes" className="block text-[11px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Anything else?</label>
                    <textarea id="s-notes" name="notes" rows={3} placeholder="Condition, timeline, tenancy status…" className={`${inputCls} resize-none`} />
                  </div>

                  {state === "error" && <p className="text-red-500 text-sm font-body">Something went wrong. Please try again.</p>}

                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="w-full py-4 bg-ink text-white font-body font-bold text-sm uppercase tracking-[0.12em] rounded-full hover:bg-graphite transition-colors disabled:opacity-60"
                  >
                    {state === "sending" ? "Sending…" : "Request Free Valuation"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">What happens next</p>
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-12">
            From valuation to completion.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
            {timeline.map((t) => (
              <div key={t.title} className="bg-ink p-7">
                <span className="text-brass text-[10px] font-body font-bold uppercase tracking-[0.16em]">{t.meta}</span>
                <h3 className="font-display text-xl tracking-tight mt-2 mb-2">{t.title}</h3>
                <p className="text-white/45 text-sm font-body leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
