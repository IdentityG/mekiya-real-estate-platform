"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  propertyId: number;
  propertyTitle: string;
}

const inputCls =
  "w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-brass transition-colors";

export function VisitRequestForm({ propertyId, propertyTitle }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      propertyId,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      requestedDate: form.get("date"),
      requestedTime: form.get("time"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/visit-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center py-4">
        <div className="w-12 h-12 rounded-full bg-brass/15 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-body font-semibold text-white">Visit requested</p>
        <p className="text-white/50 text-sm font-body mt-1">We&apos;ll confirm your slot within 2 hours.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="mt-2 space-y-3"
    >
      <input type="hidden" name="propertyTitle" value={propertyTitle} />
      <input name="name" placeholder="Full name *" required className={inputCls} />
      <div className="grid grid-cols-2 gap-3">
        <input name="email" type="email" placeholder="Email *" required className={inputCls} />
        <input name="phone" type="tel" placeholder="Phone" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="date" type="date" required min={new Date().toISOString().split("T")[0]}
          className={`${inputCls} [color-scheme:dark]`} />
        <select name="time" className={`${inputCls} appearance-none`}>
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="14:00">2:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
        </select>
      </div>
      <textarea name="message" placeholder="Anything we should know? (optional)" rows={2}
        className={`${inputCls} resize-none`} />

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Confirm Visit Request"}
      </button>
    </motion.form>
  );
}
