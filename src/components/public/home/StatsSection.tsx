"use client";

import { motion, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 1200, suffix: "+", label: "Properties Sold", note: "Since opening in 2015" },
  { value: 500, suffix: "+", label: "Verified Listings", note: "Every one physically inspected" },
  { value: 98, suffix: "%", label: "Client Satisfaction", note: "Based on 340 reviews" },
  { value: 24, suffix: "h", label: "Average Response", note: "From enquiry to first reply" },
];

export function StatsSection() {
  return (
    <section className="bg-linen py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Editorial intro — asymmetric left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">By the numbers</p>
            <h2 className="font-display text-ink text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-[-0.02em]">
              Track record,<br />
              <span className="italic text-brass">not talk.</span>
            </h2>
            <p className="text-graphite/65 font-body leading-relaxed mt-5">
              Eight years of transactions across Addis Ababa — measured, audited, and
              published. These figures update as we close.
            </p>
            <Link
              href="/about"
              className="inline-block mt-7 text-sm font-body font-semibold text-ink border-b-2 border-brass pb-0.5 hover:text-brass transition-colors"
            >
              Read our story →
            </Link>
          </motion.div>

          {/* Stats grid — hairline cells, high contrast numbers */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.09 }}
                className="group relative bg-cream p-8 lg:p-10 hover:bg-white transition-colors duration-500"
              >
                {/* Brass corner tick */}
                <span className="absolute top-0 left-0 w-8 h-px bg-brass scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                <span className="absolute top-0 left-0 h-8 w-px bg-brass scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />

                <p className="font-display text-ink text-[clamp(2.75rem,5vw,4rem)] leading-none tracking-[-0.03em]">
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p className="font-body font-bold text-ink text-sm uppercase tracking-[0.14em] mt-4">
                  {s.label}
                </p>
                <p className="font-body text-graphite/55 text-sm mt-1.5">{s.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
