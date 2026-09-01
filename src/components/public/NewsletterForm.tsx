"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0],
          email,
          leadType: "general",
          source: "newsletter",
          message: "Subscribed to property alerts from the site footer.",
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-brass/10 border border-brass/25">
        <span className="w-10 h-10 rounded-full bg-brass flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div>
          <p className="font-body font-semibold text-white">You&apos;re on the list</p>
          <p className="text-white/50 text-sm font-body">Your first alert arrives this week.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl sm:rounded-full bg-white/[0.06] border border-white/12">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="flex-1 px-5 py-3 bg-transparent text-white text-sm font-body placeholder-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="px-8 py-3 bg-brass text-ink text-[12px] font-body font-bold uppercase tracking-[0.12em] rounded-full hover:bg-white transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {state === "sending" ? "Joining…" : "Get Alerts"}
        </button>
      </div>
      {state === "error" && (
        <p className="text-red-400 text-xs font-body mt-2 px-2">Something went wrong. Please try again.</p>
      )}
      <p className="text-white/25 text-[11px] font-body mt-3 px-2">
        By subscribing you agree to our{" "}
        <a href="/privacy" className="underline hover:text-brass">Privacy Policy</a>.
      </p>
    </form>
  );
}
