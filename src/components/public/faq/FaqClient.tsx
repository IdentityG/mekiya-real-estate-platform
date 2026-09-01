"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

const faqs = [
  { cat: "Buying", q: "What documents do I need to buy a property in Ethiopia?", a: "You'll need a valid ID (passport or kebele ID), proof of income or recent bank statements, and a TIN number. For diaspora buyers, a valid passport and Ethiopian origin ID (yellow card) where applicable. Our team prepares the full checklist for your specific transaction." },
  { cat: "Buying", q: "How do you verify that a property title is genuine?", a: "Every listing goes through a three-step check: we pull the title deed from the local land administration office, cross-reference the owner's ID, and confirm there are no liens or ongoing disputes. Only then does it receive the Verified badge." },
  { cat: "Buying", q: "Can non-Ethiopians buy property here?", a: "Foreign nationals generally cannot own land, but Ethiopian-born foreign nationals holding an origin ID can. Foreign companies may lease commercial property. We'll walk you through exactly what applies to your situation." },
  { cat: "Visits", q: "How do I schedule a property visit?", a: "Open any listing and choose Schedule a Visit. Pick your date and time slot, and an agent confirms within two business hours. Visits are free and carry no obligation." },
  { cat: "Visits", q: "Can I view several properties in one day?", a: "Yes. Tell your agent which listings interest you and they'll build a route across the city, typically fitting three to five viewings into a half day." },
  { cat: "Visits", q: "Do you offer virtual viewings?", a: "Every listing includes a photo gallery and video walkthrough. For clients abroad, agents run live video tours over WhatsApp or Zoom at a time that suits your timezone." },
  { cat: "Payments", q: "How does the deposit or reservation process work?", a: "Once you decide on a property, a reservation deposit (typically 10–20% of the price) secures it while paperwork completes. Deposits are held under a documented agreement, and terms for refunds are written in before you pay anything." },
  { cat: "Payments", q: "Which payment methods do you accept?", a: "We accept Chapa (cards, mobile money, bank transfer), direct bank transfer to our corporate account, and certified cheque. International clients can pay via Stripe. We never accept cash for deposits." },
  { cat: "Payments", q: "What fees should I budget beyond the asking price?", a: "Plan for roughly 4–6% on top: title transfer tax, notary and registration fees, and agent commission where applicable. We provide a written cost breakdown before you commit." },
  { cat: "Financing", q: "Can I get a mortgage in Ethiopia?", a: "Yes. We work with CBE, Awash Bank, Dashen, and Bank of Abyssinia. Typical terms are 20–30% down with 10–20 year repayment. See our Financing page for a full estimator and requirements." },
  { cat: "Financing", q: "How long does mortgage approval take?", a: "Usually two to six weeks from complete application to disbursement, depending on the bank and your documentation. Starting the process early, before you find a property, shortens it considerably." },
  { cat: "Selling", q: "How do you price my property?", a: "We use recent comparable transactions in your neighborhood, current listing competition, and the property's condition and finish level. You receive a written valuation with the reasoning, not just a number." },
  { cat: "Selling", q: "What does Mekiya charge to sell my property?", a: "Our commission is agreed in writing before listing and is only payable on successful completion. There are no upfront listing fees, and photography and marketing are included." },
  { cat: "Renting", q: "What's the standard lease term for rentals?", a: "Residential leases usually run 12 months, with furnished executive apartments sometimes available for six. Commercial leases typically run three to five years with agreed escalation clauses." },
  { cat: "Renting", q: "How much deposit do landlords require?", a: "Commonly one to three months' rent, held as security against damage. We document the property's condition at handover so the deposit return is straightforward." },
];

const categories = ["All", "Buying", "Selling", "Renting", "Visits", "Payments", "Financing"];

export function FaqClient() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(faqs[0].q);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchCat = cat === "All" || f.cat === cat;
      const matchQ = !query || (f.q + f.a).toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [cat, query]);

  return (
    <div className="bg-linen min-h-screen">
      <PageHero
        breadcrumb="FAQ"
        eyebrow="Answers"
        title="Everything you wanted"
        accent="to ask."
        description="Straight answers about buying, selling, renting, and financing property in Ethiopia."
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-4 bg-cream border border-ink/[0.08] focus-within:border-brass transition-colors mb-6">
          <svg className="w-[18px] h-[18px] text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full bg-transparent text-ink text-sm font-body placeholder-stone-400 focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-[12px] font-body font-semibold border transition-colors ${
                cat === c ? "bg-ink text-white border-ink" : "border-ink/12 text-graphite/70 hover:border-brass hover:text-brass"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-cream border border-ink/[0.06]">
            <p className="font-display text-2xl text-ink mb-2">No matching questions</p>
            <p className="text-stone-400 font-body text-sm">Try a different search or category.</p>
          </div>
        ) : (
          <div className="border-t border-ink/[0.1]">
            {filtered.map((f) => {
              const isOpen = open === f.q;
              return (
                <div key={f.q} className="border-b border-ink/[0.1]">
                  <button
                    onClick={() => setOpen(isOpen ? null : f.q)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1">
                      <span className="block text-brass text-[10px] font-body font-bold uppercase tracking-[0.16em] mb-2">{f.cat}</span>
                      <span className={`font-display text-xl sm:text-2xl tracking-tight transition-colors ${isOpen ? "text-brass" : "text-ink group-hover:text-brass"}`}>
                        {f.q}
                      </span>
                    </span>
                    <span className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 mt-4 transition-all duration-300 ${isOpen ? "bg-brass border-brass rotate-45" : "border-ink/15 group-hover:border-brass"}`}>
                      <svg className={`w-4 h-4 ${isOpen ? "text-ink" : "text-graphite"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-graphite/70 font-body leading-[1.8] pb-7 pr-14 max-w-3xl">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-16 bg-ink text-white p-10 lg:p-14 text-center">
          <h2 className="font-display text-3xl tracking-tight">Still have a question?</h2>
          <p className="text-white/50 font-body mt-3 mb-8">Our agents answer within two business hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-8 py-3.5 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors">
              Contact Us
            </Link>
            <a href="tel:+251911234567" className="px-8 py-3.5 border border-white/25 text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:border-brass hover:text-brass transition-colors">
              Call +251 911 234 567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
