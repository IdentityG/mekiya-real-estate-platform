"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, ChevronRight, Plus } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface Lead {
  id: number;
  propertyTitle: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  leadType: string;
  pipelineStatus: string;
  source: string | null;
  notes: { date: string; text: string }[] | null;
  assignedAgentId: number | null;
  createdAt: Date;
}

interface Props {
  leads: Lead[];
  agents: { id: number; name: string }[];
}

const STAGES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "visit_scheduled", label: "Visit Scheduled" },
  { id: "negotiating", label: "Negotiating" },
  { id: "closed_won", label: "Closed Won" },
  { id: "closed_lost", label: "Closed Lost" },
];

const stageTints: Record<string, string> = {
  new: "bg-slate/10 text-slate",
  contacted: "bg-purple-500/10 text-purple-600",
  visit_scheduled: "bg-amber-500/10 text-amber-600",
  negotiating: "bg-brass/15 text-brass",
  closed_won: "bg-emerald-500/10 text-emerald-600",
  closed_lost: "bg-red-500/10 text-red-500",
};

export function AdminLeadsClient({ leads, agents }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState("");

  async function update(id: number, data: Record<string, unknown>) {
    await fetch("/api/admin/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    router.refresh();
    setSelected((s) => (s && s.id === id ? { ...s, ...(data as Partial<Lead>), pipelineStatus: (data.pipelineStatus as string) ?? s.pipelineStatus } : s));
  }

  async function addNote() {
    if (!selected || !noteText.trim()) return;
    const notes = [...(selected.notes ?? []), { date: new Date().toISOString().split("T")[0], text: noteText.trim() }];
    await fetch("/api/admin/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, pipelineStatus: selected.pipelineStatus, notes }),
    });
    setNoteText("");
    router.refresh();
    setSelected({ ...selected, notes });
  }

  const nextStage = (s: string) => STAGES[Math.min(STAGES.findIndex((x) => x.id === s) + 1, STAGES.length - 1)].id;

  return (
    <div className="p-5 lg:p-8 max-w-[1600px] h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 shrink-0">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Leads Pipeline</h2>
          <p className="text-[12px] font-body text-stone-400">{leads.length} leads · drag-free workflow, click a lead to act</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {agents.map((a) => {
            const count = leads.filter((l) => l.assignedAgentId === a.id).length;
            return (
              <span key={a.id} className="px-3 py-1.5 rounded-full bg-white border border-ink/[0.08] text-[11px] font-body font-semibold text-graphite">
                {a.name} · <span className="text-brass font-bold">{count}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const col = leads.filter((l) => l.pipelineStatus === stage.id);
          return (
            <div key={stage.id} className="flex flex-col w-[270px] shrink-0 bg-white/60 border border-ink/[0.07] rounded-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-ink/[0.06] shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wide ${stageTints[stage.id]}`}>{stage.label}</span>
                <span className="text-[12px] font-body font-bold text-stone-400 tabular-nums">{col.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2 min-h-[120px]">
                {col.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="w-full text-left bg-white border border-ink/[0.08] p-3.5 hover:border-brass/60 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-body font-semibold text-ink leading-snug">{lead.name}</p>
                      <span className="shrink-0 w-6 h-6 rounded-full bg-linen text-[10px] font-body font-bold text-stone-400 flex items-center justify-center">
                        {lead.propertyTitle ? (lead.propertyTitle.charAt(0).toUpperCase()) : "?"}
                      </span>
                    </div>
                    <p className="text-[11px] font-body text-stone-400 mt-1 truncate">{lead.propertyTitle ?? "General enquiry"}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-ink/[0.05]">
                      <span className="text-[10px] font-body font-bold uppercase tracking-wide text-stone-400">{lead.leadType}</span>
                      <span className="text-[10px] font-body text-stone-400">{agents.find((a) => a.id === lead.assignedAgentId)?.name.split(" ")[0] ?? "Unassigned"}</span>
                    </div>
                  </button>
                ))}
                {col.length === 0 && (
                  <div className="text-center py-6 text-[11px] font-body text-stone-300 border border-dashed border-ink/[0.08] rounded-lg">Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08] shrink-0">
                <h3 className="text-[15px] font-body font-bold text-ink">Lead Details</h3>
                <button onClick={() => setSelected(null)} aria-label="Close" className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors">
                  <X className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Identity */}
                <div className="flex items-center gap-4">
                  <span className="w-14 h-14 rounded-full bg-ink text-white text-lg font-body font-bold flex items-center justify-center shrink-0">
                    {selected.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-body font-bold text-ink">{selected.name}</p>
                    <p className="text-[12px] font-body text-stone-400">{selected.email ?? "No email"} · {selected.phone ?? "No phone"}</p>
                    <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-brass mt-1">{selected.source ?? "unknown"} · {selected.leadType}</p>
                  </div>
                </div>

                {/* Property interest */}
                <div className="p-4 bg-linen rounded-lg">
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1">Interested in</p>
                  <p className="text-[13px] font-body font-semibold text-ink">{selected.propertyTitle ?? "General enquiry"}</p>
                </div>

                {/* Stage */}
                <div>
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Pipeline stage</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STAGES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => update(selected.id, { pipelineStatus: s.id })}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-body font-bold transition-colors ${selected.pipelineStatus === s.id ? "bg-ink text-white" : "bg-linen text-graphite/60 hover:bg-cream"}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => update(selected.id, { pipelineStatus: nextStage(selected.pipelineStatus) })}
                    className="mt-3 inline-flex items-center gap-1 text-[12px] font-body font-semibold text-slate hover:text-ink transition-colors"
                  >
                    Advance to next stage <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>

                {/* Assign */}
                <div>
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-2">Assigned agent</p>
                  <select
                    value={selected.assignedAgentId ?? ""}
                    onChange={(e) => update(selected.id, { assignedAgentId: e.target.value ? Number(e.target.value) : null, pipelineStatus: selected.pipelineStatus })}
                    className="w-full px-3 py-2.5 bg-linen border border-ink/[0.1] rounded-lg text-[13px] font-body text-ink focus:outline-none focus:border-brass"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-3">Timeline</p>
                  <div className="space-y-2.5">
                    {(selected.notes ?? []).map((n, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brass shrink-0" />
                        <div>
                          <p className="text-[10px] font-body font-bold text-stone-400">{n.date}</p>
                          <p className="text-[12.5px] font-body text-graphite leading-relaxed">{n.text}</p>
                        </div>
                      </div>
                    ))}
                    {(selected.notes ?? []).length === 0 && <p className="text-[12.5px] font-body text-stone-400">No notes yet</p>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addNote()}
                      placeholder="Add a note…"
                      className="flex-1 px-3 py-2.5 bg-linen border border-ink/[0.1] rounded-lg text-[13px] font-body focus:outline-none focus:border-brass"
                    />
                    <button onClick={addNote} aria-label="Add note" className="w-10 h-10 rounded-lg bg-ink text-white flex items-center justify-center hover:bg-graphite transition-colors">
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
