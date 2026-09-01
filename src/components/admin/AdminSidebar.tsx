"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, CalendarDays, Users, UserRound,
  Wallet, BarChart3, Settings, LogOut, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user: { name: string; email: string; role: string };
  counts: { pendingVisits: number; newLeads: number };
  onNavigate?: () => void;
}

const groups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/properties", label: "Properties", icon: Building2 },
      { href: "/admin/visits", label: "Visit Requests", icon: CalendarDays, badge: "pendingVisits" as const },
      { href: "/admin/leads", label: "Leads Pipeline", icon: Users, badge: "newLeads" as const },
      { href: "/admin/agents", label: "Team & Agents", icon: UserRound },
    ],
  },
  {
    label: "Finance",
    items: [{ href: "/admin/transactions", label: "Payments", icon: Wallet }],
  },
  {
    label: "Insights",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/settings", label: "Content & Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ user, counts, onNavigate }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full bg-ink text-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/[0.06] shrink-0">
        <span className="w-9 h-9 rounded-full bg-brass flex items-center justify-center font-display text-ink text-lg leading-none">M</span>
        <div className="leading-tight">
          <p className="font-display text-white text-lg tracking-tight">Mekiya</p>
          <p className="text-[9px] font-body uppercase tracking-[0.22em] text-white/35">Admin Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-white/25">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const badgeCount = item.badge ? counts[item.badge] : 0;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-body font-medium transition-all duration-150",
                      active ? "bg-white/[0.09] text-white" : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-brass" />}
                    <Icon className={cn("w-[17px] h-[17px] shrink-0", active ? "text-brass" : "text-white/35 group-hover:text-white/70")} strokeWidth={1.8} />
                    {item.label}
                    {badgeCount > 0 && (
                      <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-brass text-ink text-[10px] font-bold flex items-center justify-center tabular-nums">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 px-2 pb-3">
          <span className="w-9 h-9 rounded-full bg-slate/40 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-body font-semibold truncate">{user.name}</p>
            <p className="text-[10px] font-body uppercase tracking-[0.14em] text-brass">{user.role.replace("_", " ")}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-body font-semibold bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" strokeWidth={1.8} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-body font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.8} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
