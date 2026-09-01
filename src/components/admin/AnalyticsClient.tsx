"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Download, Eye, Wallet, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Props {
  propsByType: { type: string; count: number }[];
  propsByStatus: { status: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  visitsByStatus: { status: string; count: number }[];
  totalViews: number;
  totalRevenue: number;
  topViewed: { title: string; views: number | null }[];
  leadsSeries: { month: string; count: number }[];
  visitsSeries: { month: string; count: number }[];
  leads: { createdAt: Date; name: string; email: string | null; phone: string | null; pipelineStatus: string; leadType: string; source: string | null }[];
}

const PIE_COLORS = ["#2C6C8F", "#C4A96B", "#8A9A5B", "#A05C7B", "#D97706", "#9CA3AF"];

export function AnalyticsClient(props: Props) {
  const { propsByType, propsByStatus, leadsByStatus, visitsByStatus, totalViews, totalRevenue, topViewed, leadsSeries, visitsSeries, leads } = props;

  const chartData = leadsSeries.map((l, i) => ({
    month: l.month,
    Leads: l.count,
    Visits: visitsSeries[i]?.count ?? 0,
  }));

  const pieData = useMemo(() => leadsByStatus.map((s) => ({ name: s.status.replace(/_/g, " "), value: s.count })), [leadsByStatus]);

  const maxBar = Math.max(...propsByType.map((t) => t.count), 1);

  function exportCSV() {
    const header = ["Name", "Email", "Phone", "Type", "Status", "Source", "Created"];
    const rows = leads.map((l) => [
      l.name, l.email ?? "", l.phone ?? "", l.leadType,
      l.pipelineStatus, l.source ?? "", new Date(l.createdAt).toISOString().split("T")[0],
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mekiya-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      {/* Header + export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Analytics & Reports</h2>
          <p className="text-[12px] font-body text-stone-400">Traffic, pipeline, and performance — updated live</p>
        </div>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors">
          <Download className="w-4 h-4" strokeWidth={1.8} /> Export Leads CSV
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Listing Views", value: totalViews.toLocaleString(), icon: Eye, tint: "bg-slate/10 text-slate" },
          { label: "Collected Revenue", value: formatPrice(totalRevenue), icon: Wallet, tint: "bg-emerald-500/10 text-emerald-600" },
          { label: "Total Leads", value: leads.length.toString(), icon: TrendingUp, tint: "bg-purple-500/10 text-purple-600" },
          { label: "Published Listings", value: (propsByStatus.find((s) => s.status === "published")?.count ?? 0).toString(), icon: Eye, tint: "bg-brass/15 text-brass" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-ink/[0.07] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.tint}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </span>
              </div>
              <p className="text-2xl font-body font-bold text-ink tabular-nums tracking-tight">{k.value}</p>
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.12em] text-stone-400 mt-1.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      <div className="bg-white border border-ink/[0.07] p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-body font-bold text-ink">Inquiry Volume</h3>
          <div className="flex items-center gap-4 text-[11px] font-body font-semibold">
            <span className="flex items-center gap-1.5 text-slate"><span className="w-2.5 h-2.5 rounded-sm bg-slate" /> Leads</span>
            <span className="flex items-center gap-1.5 text-brass"><span className="w-2.5 h-2.5 rounded-sm bg-brass" /> Visits</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2C6C8F" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2C6C8F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C4A96B" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C4A96B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0B0D12" strokeOpacity={0.06} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#777263" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#777263" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid rgba(11,13,18,0.08)", fontSize: 12, fontFamily: "Space Grotesk" }} />
              <Area type="monotone" dataKey="Leads" stroke="#2C6C8F" strokeWidth={2} fill="url(#aL)" />
              <Area type="monotone" dataKey="Visits" stroke="#C4A96B" strokeWidth={2} fill="url(#aV)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-6">
        {/* Property types bar */}
        <div className="bg-white border border-ink/[0.07] p-6">
          <h3 className="text-sm font-body font-bold text-ink mb-5">Portfolio by Type</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propsByType.map((t) => ({ name: t.type, count: t.count }))} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0B0D12" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#777263" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#777263" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid rgba(11,13,18,0.08)", fontSize: 12 }} />
                <Bar dataKey="count" name="Listings" radius={[4, 4, 0, 0]} fill="#2C6C8F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead status pie */}
        <div className="bg-white border border-ink/[0.07] p-6">
          <h3 className="text-sm font-body font-bold text-ink mb-5">Lead Pipeline Mix</h3>
          <div className="h-56 flex">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid rgba(11,13,18,0.08)", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-36 space-y-2 self-center">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-[11px] font-body">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-graphite capitalize">{d.name}</span>
                  <span className="ml-auto font-bold text-ink tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top viewed + status table */}
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/[0.07] p-6">
          <h3 className="text-sm font-body font-bold text-ink mb-4">Most Viewed Listings</h3>
          <div className="space-y-3">
            {topViewed.map((p, i) => {
              const maxViews = Math.max(...topViewed.map((x) => x.views ?? 0), 1);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[12.5px] font-body text-graphite truncate pr-4">{p.title}</p>
                    <span className="text-[12px] font-body font-bold text-ink tabular-nums">{p.views ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-linen rounded-full overflow-hidden">
                    <div className="h-full bg-brass rounded-full" style={{ width: `${((p.views ?? 0) / maxViews) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            {topViewed.length === 0 && <p className="text-sm font-body text-stone-400">No data yet</p>}
          </div>
        </div>

        <div className="bg-white border border-ink/[0.07] p-6">
          <h3 className="text-sm font-body font-bold text-ink mb-4">Visit Requests by Status</h3>
          <div className="space-y-3">
            {visitsByStatus.map((v) => (
              <div key={v.status} className="flex items-center justify-between py-2.5 border-b border-ink/[0.05] last:border-0">
                <span className="text-[12.5px] font-body text-graphite capitalize">{v.status}</span>
                <span className="text-[13px] font-body font-bold text-ink tabular-nums">{v.count}</span>
              </div>
            ))}
            {visitsByStatus.length === 0 && <p className="text-sm font-body text-stone-400">No visit data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
