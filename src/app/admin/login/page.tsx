"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@mekiya.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      // Hard navigation ensures the cookie is committed and the server
      // re-evaluates the session before any redirect logic runs.
      window.location.href = "/admin";
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink relative overflow-hidden flex items-center justify-center px-4">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brass/[0.07] blur-3xl" />
      <div className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-slate/[0.12] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-12 h-12 rounded-full bg-brass flex items-center justify-center font-display text-ink text-2xl leading-none">M</span>
            <span className="text-left">
              <span className="block font-display text-white text-2xl tracking-tight leading-none">Mekiya</span>
              <span className="block text-[9px] font-body uppercase tracking-[0.24em] text-white/35 mt-1">Admin Suite</span>
            </span>
          </div>
          <h1 className="text-white font-body font-bold text-xl">Welcome back</h1>
          <p className="text-white/40 font-body text-sm mt-1.5">Sign in to manage your real estate operations</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="bg-graphite/60 backdrop-blur-xl border border-white/[0.08] p-7 space-y-4">
          <div>
            <label className="block text-[10px] font-body font-bold uppercase tracking-[0.16em] text-white/35 mb-2">Email</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/[0.1] focus-within:border-brass transition-colors">
              <Mail className="w-4 h-4 text-white/30 shrink-0" strokeWidth={1.7} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-body placeholder-white/25 focus:outline-none"
                placeholder="you@mekiya.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-body font-bold uppercase tracking-[0.16em] text-white/35 mb-2">Password</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/[0.1] focus-within:border-brass transition-colors">
              <Lock className="w-4 h-4 text-white/30 shrink-0" strokeWidth={1.7} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-body placeholder-white/25 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-[12.5px] font-body">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brass text-ink font-body font-bold text-sm rounded-full hover:bg-white transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"} {!loading && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
          </button>

          <p className="text-white/25 text-[11px] font-body text-center pt-1">
            Demo access — admin@mekiya.com / admin123
          </p>
        </form>
      </motion.div>
    </div>
  );
}
