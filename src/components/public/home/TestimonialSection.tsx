"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { IMG } from "@/lib/images";

interface Props {
  testimonials: Array<{
    id: number; name: string; role: string | null; content: string; rating: number | null;
  }>;
}

const faces = [IMG.penthouse, IMG.villa, IMG.aboutOffice, IMG.apartment];

export function TestimonialSection({ testimonials }: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const next = useCallback(() => setI((p) => (p + 1) % total), [total]);
  const prev = () => setI((p) => (p - 1 + total) % total);

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next, total]);

  if (!total) return null;
  const active = testimonials[i];

  return (
    <section
      className="relative bg-ink text-white overflow-hidden py-24 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] rounded-full bg-brass/[0.07] blur-3xl" />
      <div className="absolute -bottom-40 right-0 w-[480px] h-[480px] rounded-full bg-slate/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Client Stories</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.94] tracking-[-0.02em]">
              Trusted by people<br />
              <span className="italic text-brass">who don&apos;t settle.</span>
            </h2>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md shrink-0">
            <div>
              <p className="font-display text-4xl text-brass leading-none">4.9</p>
              <div className="flex gap-0.5 mt-1.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-brass text-xs">★</span>
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <p className="text-white/50 text-xs font-body leading-relaxed">
              Average rating from<br /><span className="text-white font-semibold">340+ verified clients</span>
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Quote */}
          <div className="relative lg:col-span-8 min-h-[260px] sm:min-h-[230px]">
            <AnimatePresence initial={false}>
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <span className="font-display text-brass/25 text-[5rem] leading-none block h-12">&ldquo;</span>
                <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.22] tracking-[-0.015em] text-white/95">
                  {active.content}
                </p>
                <footer className="flex items-center gap-4 mt-8">
                  <span className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brass/40 shrink-0">
                    <Image src={faces[i % faces.length]} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <div>
                    <p className="font-body font-semibold text-white">{active.name}</p>
                    {active.role && <p className="text-white/40 text-sm font-body">{active.role}</p>}
                  </div>
                  <div className="flex gap-0.5 ml-auto">
                    {Array.from({ length: active.rating || 5 }).map((_, s) => (
                      <span key={s} className="text-brass text-sm">★</span>
                    ))}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls + selector */}
          <div className="lg:col-span-4 flex lg:flex-col gap-4 items-center lg:items-stretch">
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-brass hover:text-brass transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-brass hover:text-brass transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Progress bars */}
            <div className="flex-1 flex lg:flex-col gap-2 w-full">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setI(idx)}
                  aria-label={`Show testimonial from ${t.name}`}
                  className="group flex-1 lg:flex-none text-left"
                >
                  <span className="block h-0.5 w-full bg-white/12 overflow-hidden">
                    <motion.span
                      className="block h-full bg-brass"
                      initial={false}
                      animate={{ width: idx === i ? "100%" : "0%" }}
                      transition={{ duration: idx === i && !paused ? 6 : 0.3, ease: "linear" }}
                    />
                  </span>
                  <span className={`hidden lg:block text-xs font-body mt-2 transition-colors ${idx === i ? "text-white" : "text-white/35 group-hover:text-white/60"}`}>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
