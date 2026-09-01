"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, X, CreditCard, Banknote, CheckCircle2, RotateCcw } from "lucide-react";
import { formatPrice, getStatusColor } from "@/lib/utils";

interface Tx {
  id: number;
  amount: number;
  currency: string | null;
  method: string;
  status: string;
  reference: string | null;
  createdAt: Date;
  leadId: number | null;
  leadName: string | null;
  visitorName: string | null;
}

interface Props {
  transactions: Tx[];
  leads: { id: number; name: string }[];
}

const methodMeta: Record<string, { label: string; icon: typeof Banknote }> = {
  chapa: { label: "Chapa", icon: CreditCard },
  stripe: { label: "Stripe", icon: CreditCard },
  bank_transfer: { label: "Bank Transfer", icon: Banknote },
};

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminTransactionsClient({ transactions, leads }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered = transactions.filter(
    (t) => (!filter || t.status === filter) && (!methodFilter || t.method === methodFilter)
  );

  const totals = useMemo(() => {
    const paid = transactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
    const refunded = transactions.filter((t) => t.status === "refunded").reduce((s, t) => s + t.amount, 0);
    return { paid, pending, refunded };
  }, [transactions]);

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  async function addTx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: form.get("leadId") ? Number(form.get("leadId")) : null,
        amount: Number(form.get("amount")),
        method: form.get("method") || "bank_transfer",
        status: form.get("status") || "pending",
        reference: form.get("reference") || null,
      }),
    });
    if (res.ok) {
      setAddOpen(false);
      setSaving(false);
      router.refresh();
    } else {
      setSaving(false);
      alert("Failed to record payment");
    }
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Payments & Transactions</h2>
          <p className="text-[12px] font-body text-stone-400">Deposits, reservations, and reconciliation</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Record Payment
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Collected", value: totals.paid, cls: "text-emerald-600" },
          { label: "Pending", value: totals.pending, cls: "text-amber-600" },
          { label: "Refunded", value: totals.refunded, cls: "text-red-500" },
        ].map((t) => (
          <div key={t.label} className="bg-white border border-ink/[0.07] p-5">
            <p className={`text-2xl font-body font-bold tabular-nums tracking-tight ${t.cls}`}>{formatPrice(t.value)}</p>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["", "paid", "pending", "refunded"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-body font-bold capitalize transition-colors ${filter === s ? "bg-ink text-white" : "bg-white border border-ink/[0.1] text-graphite/70 hover:border-ink/30"}`}>
            {s || "All"}{s && ` · ${transactions.filter((t) => t.status === s).length}`}
          </button>
        ))}
        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}
          className="ml-auto px-4 py-1.5 bg-white border border-ink/[0.1] rounded-full text-[11px] font-body font-semibold text-graphite focus:outline-none cursor-pointer">
          <option value="">All methods</option>
          <option value="chapa">Chapa</option>
          <option value="stripe">Stripe</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-ink/[0.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] font-body">
            <thead>
              <tr className="border-b border-ink/[0.07] bg-linen/60">
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Reference</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Payer</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Method</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Status</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.05]">
              {filtered.map((t) => {
                const meta = methodMeta[t.method] ?? methodMeta.bank_transfer;
                const Icon = meta.icon;
                return (
                  <tr key={t.id} className="hover:bg-linen/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-ink text-[12px]">{t.reference ?? `TX-${t.id}`}</p>
                      <p className="text-[10.5px] text-stone-400">{new Date(t.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </td>
                    <td className="px-4 py-3.5 text-graphite">{t.leadName ?? t.visitorName ?? "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-graphite">
                        <Icon className="w-4 h-4 text-stone-400" strokeWidth={1.7} /> {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-ink tabular-nums whitespace-nowrap">{formatPrice(t.amount, t.currency ?? "ETB")}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide capitalize ${getStatusColor(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === "pending" && (
                          <button onClick={() => updateStatus(t.id, "paid")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-body font-bold hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} /> Confirm
                          </button>
                        )}
                        {t.status === "paid" && (
                          <button onClick={() => updateStatus(t.id, "refunded")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[11px] font-body font-bold hover:bg-red-500/20 transition-colors">
                            <RotateCcw className="w-3 h-3" strokeWidth={2.5} /> Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-body text-stone-400">No payments recorded yet</p>
            <button onClick={() => setAddOpen(true)} className="mt-3 text-[13px] font-body font-semibold text-brass hover:underline">
              Record your first payment →
            </button>
          </div>
        )}
      </div>

      {/* Record payment modal */}
      <AnimatePresence>
        {addOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddOpen(false)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-md h-fit bg-white"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08]">
                <h3 className="text-[15px] font-body font-bold text-ink">Record Payment</h3>
                <button onClick={() => setAddOpen(false)} aria-label="Close" className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors">
                  <X className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>

              <form onSubmit={addTx} className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Amount (ETB) *</label>
                  <input name="amount" type="number" required min={1} className={inputCls} placeholder="e.g. 500000" />
                </div>
                <div>
                  <label className={labelCls}>Method</label>
                  <select name="method" className={inputCls} defaultValue="bank_transfer">
                    <option value="bank_transfer">Bank Transfer (manual)</option>
                    <option value="chapa">Chapa</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Link to lead</label>
                  <select name="leadId" className={inputCls}>
                    <option value="">No lead</option>
                    {leads.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Reference (optional)</label>
                  <input name="reference" className={inputCls} placeholder="e.g. Deposit – apt 3B" />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select name="status" className={inputCls} defaultValue="pending">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <button type="submit" disabled={saving}
                  className="w-full py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60">
                  {saving ? "Recording…" : "Record Payment"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
