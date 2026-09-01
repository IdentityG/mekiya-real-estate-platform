"use client";

import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Building2, CalendarDays, Users, Wallet, ArrowUpRight, Plus, Star } from "lucide-react";
import { getStatusColor, formatPrice } from "@/lib/utils";

interface Props {
  stats: {
    totalListings: number;
    activeListings: number;
    pendingVisits: number;
    newLeads: number;
    revenue: number;
    totalAgents: number;
  };
  chartData: { month: string; leads: number; visits: number }[];
  propsByStatus: { status: string; count: number }[];
  propsByType: { type: string; count: number }[];
  topViewed: { title: string; views: number | null }[];
  recentVisits: { id: number; name: string; status: string; requestedDate: string; propertyTitle: string | null }[];
  recentLeads: { id: number; name: string; pipelineStatus: string; leadType: string; propertyTitle: string | null }[];
}

const kpis = [
  { key: "totalListings", label: "Total Listings", icon: Building2, tint: "bg-slate/10 text-slate" },
  { key: "activeListings", label: "Active Listings", icon: Star, tint: "bg-emerald-500/10 text-emerald-600" },
  { key: "pendingVisits", label: "Pending Visits", icon: CalendarDays, tint: "bg-amber-500/10 text-amber-600" },
  { key: "newLeads", label: "New Leads", icon: Users, tint: "bg-purple-500/10 text-purple-600" },
] as const;

export function DashboardClient(props: Props) {
  const { stats, chartData, propsByStatus, propsByType, topViewed, recentVisits, recentLeads } = props;

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.key} className="bg-white border border-ink/[0.07] p-5 hover:border-ink/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.tint}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-300" strokeWidth={1.7} />
              </div>
              <p className="text-3xl font-body font-bold text-ink tabular-nums tracking-tight">{stats[k.key]}</p>
              <p className="text-[11px] font-body font-semibold uppercase tracking-[0.12em] text-stone-400 mt-1.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mb-6">
        {/* Inquiries chart */}
        <div className="xl:col-span-2 bg-white border border-ink/[0.07] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-body font-bold text-ink">Inquiries Over Time</h2>
              <p className="text-[11px] font-body text-stone-400 mt-0.5">Leads and visit requests, last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-body font-semibold">
              <span className="flex items-center gap-1.5 text-slate"><span className="w-2.5 h-2.5 rounded-sm bg-slate" /> Leads</span>
              <span className="flex items-center gap-1.5 text-brass"><span className="w-2.5 h-2.5 rounded-sm bg-brass" /> Visits</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C6C8F" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2C6C8F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4A96B" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#C4A96B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0B0D12" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#777263" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#777263" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid rgba(11,13,18,0.08)", fontSize: 12, fontFamily: "Space Grotesk" }}
                />
                <Area type="monotone" dataKey="leads" stroke="#2C6C8F" strokeWidth={2} fill="url(#gLeads)" />
                <Area type="monotone" dataKey="visits" stroke="#C4A96B" strokeWidth={2} fill="url(#gVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue + quick stats */}
        <div className="space-y-6">
          <div className="bg-ink text-white p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brass/15 blur-2xl" />
            <div className="flex items-center gap-2.5 mb-5 relative">
              <Wallet className="w-4 h-4 text-brass" strokeWidth={1.8} />
              <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-white/50">Collected Revenue</p>
            </div>
            <p className="text-3xl font-body font-bold text-white tabular-nums tracking-tight relative">{formatPrice(stats.revenue)}</p>
            <p className="text-[11px] font-body text-white/40 mt-1.5 relative">From paid deposits & reservations</p>
            <Link href="/admin/transactions" className="inline-flex items-center gap-1 mt-4 text-[12px] font-body font-semibold text-brass hover:text-white transition-colors relative">
              View payments <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="bg-white border border-ink/[0.07] p-6">
            <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-stone-400 mb-4">Portfolio Mix</p>
            <div className="space-y-4">
              {propsByType.map((t) => {
                const total = propsByType.reduce((s, x) => s + x.count, 0) || 1;
                return (
                  <div key={t.type}>
                    <div className="flex justify-between text-[12.5px] font-body mb-1.5">
                      <span className="text-graphite capitalize">{t.type}</span>
                      <span className="font-bold text-ink tabular-nums">{t.count}</span>
                    </div>
                    <div className="h-1.5 bg-linen rounded-full overflow-hidden">
                      <div className="h-full bg-slate rounded-full" style={{ width: `${(t.count / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between text-[12.5px] font-body pt-2 border-t border-ink/[0.06]">
                <span className="text-stone-400">Team members</span>
                <span className="font-bold text-ink tabular-nums">{stats.totalAgents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mb-6">
        {/* Listing status */}
        <div className="bg-white border border-ink/[0.07] p-6">
          <h2 className="text-sm font-body font-bold text-ink mb-4">Listings by Status</h2>
          <div className="space-y-2.5">
            {propsByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between py-2 border-b border-ink/[0.05] last:border-0">
                <span className={`px-2 py-0.5 rounded text-[11px] font-body font-semibold capitalize ${getStatusColor(s.status)}`}>{s.status}</span>
                <span className="text-sm font-body font-bold text-ink tabular-nums">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top viewed */}
        <div className="bg-white border border-ink/[0.07] p-6">
          <h2 className="text-sm font-body font-bold text-ink mb-4">Top Performing Listings</h2>
          <div className="space-y-3">
            {topViewed.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-linen text-[11px] font-body font-bold text-stone-400 flex items-center justify-center tabular-nums">{i + 1}</span>
                <p className="flex-1 text-[12.5px] font-body text-graphite truncate">{p.title}</p>
                <span className="text-[12px] font-body font-bold text-ink tabular-nums">{p.views ?? 0}</span>
              </div>
            ))}
            {topViewed.length === 0 && <p className="text-sm font-body text-stone-400">No data yet</p>}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-ink/[0.07] p-6">
          <h2 className="text-sm font-body font-bold text-ink mb-4">Quick Actions</h2>
          <div className="space-y-2.5">
            {[
              { href: "/admin/properties", label: "Add a property", desc: "Create a new listing" },
              { href: "/admin/leads", label: "Review new leads", desc: `${stats.newLeads} waiting` },
              { href: "/admin/visits", label: "Approve visits", desc: `${stats.pendingVisits} pending` },
            ].map((a) => (
              <Link key={a.label} href={a.href} className="group flex items-center gap-3 p-3 border border-ink/[0.07] hover:border-brass/50 transition-colors">
                <span className="w-8 h-8 rounded bg-linen flex items-center justify-center text-graphite group-hover:bg-brass/10 group-hover:text-brass transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-[13px] font-body font-semibold text-ink">{a.label}</span>
                  <span className="block text-[11px] font-body text-stone-400">{a.desc}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-brass transition-colors" strokeWidth={1.8} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/[0.07]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.06]">
            <h2 className="text-sm font-body font-bold text-ink">Recent Visit Requests</h2>
            <Link href="/admin/visits" className="text-[12px] font-body font-semibold text-slate hover:text-ink transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-ink/[0.05]">
            {recentVisits.map((v) => (
              <div key={v.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-body font-semibold text-ink">{v.name}</p>
                  <p className="text-[11px] font-body text-stone-400 truncate">{v.propertyTitle ?? "Unknown property"} · {v.requestedDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-body font-bold uppercase tracking-wide capitalize ${getStatusColor(v.status)}`}>{v.status}</span>
              </div>
            ))}
            {recentVisits.length === 0 && <p className="px-6 py-8 text-sm font-body text-stone-400 text-center">No visit requests yet</p>}
          </div>
        </div>

        <div className="bg-white border border-ink/[0.07]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.06]">
            <h2 className="text-sm font-body font-bold text-ink">Recent Leads</h2>
            <Link href="/admin/leads" className="text-[12px] font-body font-semibold text-slate hover:text-ink transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-ink/[0.05]">
            {recentLeads.map((l) => (
              <div key={l.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-body font-semibold text-ink">{l.name}</p>
                  <p className="text-[11px] font-body text-stone-400 truncate">{l.propertyTitle ?? "General enquiry"} · {l.leadType}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-body font-bold uppercase tracking-wide ${getStatusColor(l.pipelineStatus)}`}>
                  {l.pipelineStatus.replace("_", " ")}
                </span>
              </div>
            ))}
            {recentLeads.length === 0 && <p className="px-6 py-8 text-sm font-body text-stone-400 text-center">No leads yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
