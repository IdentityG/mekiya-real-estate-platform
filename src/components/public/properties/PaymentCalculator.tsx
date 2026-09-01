"use client";

import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";

export function PaymentCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const { monthly, down, loan, total } = useMemo(() => {
    const down = Math.round((price * downPct) / 100);
    const loan = price - down;
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthly = loan <= 0 || r <= 0 ? loan / Math.max(n, 1) : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = down + monthly * n;
    return { monthly: Math.round(monthly), down, loan, total: Math.round(total) };
  }, [price, downPct, rate, years]);

  return (
    <div className="bg-graphite text-white p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl tracking-tight">Payment Estimator</h3>
        <span className="text-[10px] font-body font-bold uppercase tracking-[0.18em] text-brass">Interactive</span>
      </div>

      {/* Result */}
      <div className="flex items-end justify-between pb-6 mb-6 border-b border-white/10">
        <div>
          <p className="text-white/40 text-[11px] font-body uppercase tracking-[0.15em]">Est. monthly payment</p>
          <p className="font-display text-4xl lg:text-5xl text-brass tracking-tight mt-2">{formatPrice(monthly)}</p>
        </div>
        <p className="text-white/40 text-xs font-body">/month · {years}yr</p>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        {[
          { label: "Down payment", val: downPct, set: setDownPct, min: 10, max: 60, step: 5, suffix: `%`, note: formatPrice(down) },
          { label: "Interest rate", val: rate, set: setRate, min: 5, max: 20, step: 0.5, suffix: `%`, note: `${rate}% annual` },
          { label: "Loan term", val: years, set: setYears, min: 5, max: 30, step: 1, suffix: ` yrs`, note: `${years * 12} payments` },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-body text-white/70">{s.label}</span>
              <span className="text-sm font-body font-semibold text-brass">{s.val}{s.suffix}</span>
            </div>
            <input
              type="range"
              min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-[#C4A96B]"
            />
            <p className="text-white/30 text-[11px] font-body mt-1.5">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-sm font-body">
        <div className="flex justify-between text-white/60"><span>Down payment</span><span className="text-white">{formatPrice(down)}</span></div>
        <div className="flex justify-between text-white/60"><span>Loan amount</span><span className="text-white">{formatPrice(loan)}</span></div>
        <div className="flex justify-between text-white/60"><span>Total cost</span><span className="text-white">{formatPrice(total)}</span></div>
      </div>

      <p className="mt-5 text-[11px] font-body text-white/30 leading-relaxed">
        Estimate only. We connect you with partner banks for real mortgage terms — CBE, Awash, and more.
      </p>
    </div>
  );
}
