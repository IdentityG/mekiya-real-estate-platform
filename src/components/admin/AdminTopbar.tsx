"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, ChevronDown, LogOut, Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "visit" | "lead" | "property";
  text: string;
  time: string;
}

interface Props {
  user: { name: string; role: string };
  activity: Activity[];
  onMenu?: () => void;
}

const titles: Record<string, { title: string; sub: string }> = {
  "/admin": { title: "Dashboard", sub: "Live overview of your real estate operations" },
  "/admin/properties": { title: "Properties", sub: "Manage listings, media, and publishing" },
  "/admin/visits": { title: "Visit Requests", sub: "Schedule, confirm, and assign viewings" },
  "/admin/leads": { title: "Leads Pipeline", sub: "Move enquiries from first contact to closed" },
  "/admin/agents": { title: "Team & Agents", sub: "Roles, performance, and access" },
  "/admin/transactions": { title: "Payments", sub: "Deposits, reconciliation, and refunds" },
  "/admin/analytics": { title: "Analytics", sub: "Traffic, conversion, and performance" },
  "/admin/settings": { title: "Content & Settings", sub: "Testimonials, neighborhoods, and site info" },
};

export function AdminTopbar({ user, activity, onMenu }: Props) {
  const pathname = usePathname();
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const meta = titles[pathname] ?? titles["/admin"];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-5 lg:px-8 h-16 bg-linen/85 backdrop-blur-lg border-b border-ink/[0.07]">
      {/* Mobile menu */}
      <button
        onClick={() => {
          if (onMenu) onMenu();
          else window.dispatchEvent(new CustomEvent("mekiya:open-mobile-nav"));
        }}
        className="lg:hidden w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center text-ink hover:bg-cream transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-[18px] h-[18px]" strokeWidth={1.8} />
      </button>

      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-[15px] font-body font-bold text-ink truncate leading-tight">{meta.title}</h1>
        <p className="hidden sm:block text-[11px] font-body text-stone-400 truncate">{meta.sub}</p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className={cn(
              "relative w-9 h-9 rounded-lg border flex items-center justify-center transition-colors",
              bellOpen ? "bg-ink text-white border-ink" : "border-ink/10 text-graphite hover:bg-cream"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.8} />
            {activity.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brass text-ink text-[9px] font-bold flex items-center justify-center">
                {activity.length > 9 ? "9+" : activity.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 bg-white border border-ink/[0.08] shadow-[0_20px_50px_-15px_rgba(11,13,18,0.25)] rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink/[0.06]">
                  <p className="text-xs font-body font-bold uppercase tracking-[0.14em] text-ink">Recent Activity</p>
                  <span className="text-[10px] font-body text-stone-400">Live</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-ink/[0.05]">
                  {activity.length === 0 && (
                    <p className="px-4 py-8 text-center text-sm font-body text-stone-400">All quiet. No new activity.</p>
                  )}
                  {activity.map((a) => (
                    <div key={a.id} className="px-4 py-3 flex gap-3 hover:bg-linen transition-colors">
                      <span className={cn(
                        "mt-1 w-2 h-2 rounded-full shrink-0",
                        a.type === "visit" ? "bg-amber-500" : a.type === "lead" ? "bg-slate" : "bg-emerald-500"
                      )} />
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-body text-ink leading-snug">{a.text}</p>
                        <p className="text-[10px] font-body text-stone-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-full border border-ink/10 hover:bg-cream transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center">
              {user.name.charAt(0)}
            </span>
            <span className="hidden md:block text-left leading-tight">
              <span className="block text-[12px] font-body font-semibold text-ink">{user.name.split(" ")[0]}</span>
              <span className="block text-[9px] font-body uppercase tracking-[0.12em] text-brass">{user.role.replace("_", " ")}</span>
            </span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-stone-400 transition-transform", userOpen && "rotate-180")} strokeWidth={2} />
          </button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 bg-white border border-ink/[0.08] rounded-xl shadow-[0_20px_50px_-15px_rgba(11,13,18,0.25)] overflow-hidden py-1"
              >
                <p className="px-4 py-2.5 text-[11px] font-body text-stone-400 leading-snug border-b border-ink/[0.06]">
                  Signed in as<br /><span className="text-ink font-semibold">{user.name}</span>
                </p>
                <a href="/" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body text-ink hover:bg-linen transition-colors">
                  <Globe className="w-4 h-4 text-stone-400" strokeWidth={1.8} /> View public site
                </a>
                <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" strokeWidth={1.8} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
