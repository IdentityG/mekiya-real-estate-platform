"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, List, ChevronLeft, ChevronRight, Check, X, Phone, Mail } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface Visit {
  id: number;
  propertyTitle: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  requestedDate: string;
  requestedTime: string | null;
  message: string | null;
  status: string;
  assignedAgentId: number | null;
}

interface Props {
  visits: Visit[];
  agents: { id: number; name: string }[];
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function AdminVisitsClient({ visits, agents }: Props) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState("");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = visits.filter((v) => !statusFilter || v.status === statusFilter);

  async function update(id: number, data: Record<string, unknown>) {
    await fetch("/api/admin/visits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    router.refresh();
  }

  // Calendar math
  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const visitsOnDate = (key: string) => visits.filter((v) => v.requestedDate === key);
  const shownVisits = selectedDate ? visits.filter((v) => v.requestedDate === selectedDate) : filtered;

  const stats = [
    { label: "Pending", value: visits.filter((v) => v.status === "pending").length, color: "text-amber-600" },
    { label: "Confirmed", value: visits.filter((v) => v.status === "confirmed").length, color: "text-slate" },
    { label: "Completed", value: visits.filter((v) => v.status === "completed").length, color: "text-emerald-600" },
    { label: "Cancelled", value: visits.filter((v) => v.status === "cancelled").length, color: "text-red-500" },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      {/* Header + view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`text-2xl font-body font-bold tabular-nums ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-white border border-ink/[0.08] rounded-lg w-fit">
          <button onClick={() => setView("list")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-body font-semibold transition-colors ${view === "list" ? "bg-ink text-white" : "text-stone-400 hover:text-ink"}`}>
            <List className="w-3.5 h-3.5" strokeWidth={1.8} /> List
          </button>
          <button onClick={() => setView("calendar")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-body font-semibold transition-colors ${view === "calendar" ? "bg-ink text-white" : "text-stone-400 hover:text-ink"}`}>
            <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.8} /> Calendar
          </button>
        </div>
      </div>

      {/* Calendar view */}
      {view === "calendar" && (
        <div className="bg-white border border-ink/[0.07] mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.06]">
            <h3 className="text-[15px] font-body font-bold text-ink">{monthLabel}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month" className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.8} />
              </button>
              <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 text-[12px] font-body font-semibold text-slate hover:bg-linen rounded-lg transition-colors">Today</button>
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month" className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors">
                <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-ink/[0.06]">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-3 py-2.5 text-center text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="min-h-[92px] border-r border-b border-ink/[0.04] bg-linen/40" />;
              const key = dateKey(d);
              const dayVisits = visitsOnDate(key);
              const isSelected = selectedDate === key;
              const isToday = key === dateKey(new Date());
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : key)}
                  className={`min-h-[92px] p-2 border-r border-b border-ink/[0.04] text-left transition-colors hover:bg-linen/60 ${isSelected ? "bg-brass/[0.08]" : ""}`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-body font-semibold tabular-nums ${isToday ? "bg-ink text-white" : "text-graphite"}`}>
                    {d.getDate()}
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {dayVisits.slice(0, 3).map((v) => (
                      <span key={v.id} className={`block truncate text-[10px] font-body font-semibold px-1.5 py-0.5 rounded ${v.status === "confirmed" ? "bg-slate/10 text-slate" : v.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : v.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-600"}`}>
                        {v.requestedTime ?? "TBD"} · {v.name.split(" ")[0]}
                      </span>
                    ))}
                    {dayVisits.length > 3 && <span className="block text-[10px] text-stone-400 font-body">+{dayVisits.length - 3} more</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-body font-bold capitalize transition-colors ${statusFilter === s ? "bg-ink text-white" : "bg-white border border-ink/[0.1] text-graphite/70 hover:border-ink/30"}`}>
            {s || "All"}{s && ` · ${visits.filter((v) => v.status === s).length}`}
          </button>
        ))}
        {selectedDate && (
          <button onClick={() => setSelectedDate(null)} className="ml-auto px-3.5 py-1.5 rounded-full text-[11px] font-body font-bold bg-brass/15 text-brass hover:bg-brass/25 transition-colors">
            {selectedDate} ✕
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white border border-ink/[0.07] divide-y divide-ink/[0.05]">
        {shownVisits.length === 0 && (
          <p className="py-14 text-center text-sm font-body text-stone-400">No visit requests{selectedDate ? ` on ${selectedDate}` : ""}</p>
        )}
        {shownVisits.map((v) => {
          const isOpen = expanded === v.id;
          return (
            <div key={v.id} className="hover:bg-linen/40 transition-colors">
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Visitor */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-body font-semibold text-ink">{v.name}</p>
                  <p className="text-[11.5px] font-body text-stone-400 truncate">{v.propertyTitle ?? "Unknown property"} · {v.requestedDate}{v.requestedTime ? ` at ${v.requestedTime}` : ""}</p>
                </div>

                {/* Status */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wide capitalize w-fit ${getStatusColor(v.status)}`}>{v.status}</span>

                {/* Assign */}
                <select
                  value={v.assignedAgentId ?? ""}
                  onChange={(e) => update(v.id, { assignedAgentId: e.target.value ? Number(e.target.value) : undefined, status: v.status })}
                  className="px-3 py-1.5 bg-linen border border-ink/[0.1] rounded-lg text-[12px] font-body text-graphite focus:outline-none focus:border-brass"
                >
                  <option value="">Assign agent…</option>
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {v.status === "pending" && (
                    <>
                      <button onClick={() => update(v.id, { status: "confirmed" })} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-body font-bold hover:bg-emerald-500/20 transition-colors">
                        <Check className="w-3 h-3" strokeWidth={2.5} /> Confirm
                      </button>
                      <button onClick={() => update(v.id, { status: "cancelled" })} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[11px] font-body font-bold hover:bg-red-500/20 transition-colors">
                        <X className="w-3 h-3" strokeWidth={2.5} /> Cancel
                      </button>
                    </>
                  )}
                  {v.status === "confirmed" && (
                    <button onClick={() => update(v.id, { status: "completed" })} className="px-3 py-1.5 rounded-full bg-slate/10 text-slate text-[11px] font-body font-bold hover:bg-slate/20 transition-colors">
                      Mark completed
                    </button>
                  )}
                  <button onClick={() => setExpanded(isOpen ? null : v.id)} className="px-3 py-1.5 rounded-full border border-ink/10 text-[11px] font-body font-semibold text-graphite hover:border-ink/30 transition-colors">
                    {isOpen ? "Less" : "Details"}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-linen/60 rounded-lg">
                    <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5">Contact</p>
                    {v.email && <p className="text-[12.5px] font-body text-graphite flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-stone-400" strokeWidth={1.7} /> {v.email}</p>}
                    {v.phone && <p className="text-[12.5px] font-body text-graphite flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5 text-stone-400" strokeWidth={1.7} /> {v.phone}</p>}
                    {!v.email && !v.phone && <p className="text-[12.5px] font-body text-stone-400">No contact details</p>}
                  </div>
                  <div className="p-4 bg-linen/60 rounded-lg lg:col-span-2">
                    <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5">Message</p>
                    <p className="text-[12.5px] font-body text-graphite leading-relaxed">{v.message || "No message provided."}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
