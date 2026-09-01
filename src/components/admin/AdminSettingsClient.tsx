"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Pencil, Trash2, X, Save, Quote, MapPin, Building } from "lucide-react";

interface Testimonial {
  id: number; name: string; role: string | null; content: string;
  rating: number | null; featured: boolean | null;
}

interface Hood {
  id: number; name: string; slug: string; description: string | null;
  avgPrice: number | null; imageUrl: string | null; block: string | null;
}

interface Props {
  testimonials: Testimonial[];
  neighborhoods: Hood[];
  settings: Record<string, string>;
}

const TABS = [
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "neighborhoods", label: "Neighborhoods", icon: MapPin },
  { id: "general", label: "Site Information", icon: Building },
] as const;

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminSettingsClient({ testimonials, neighborhoods, settings }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("testimonials");
  const [tModal, setTModal] = useState<{ mode: "add" } | { mode: "edit"; t: Testimonial } | null>(null);
  const [nModal, setNModal] = useState<{ mode: "add" } | { mode: "edit"; n: Hood } | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => router.refresh();

  async function saveTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tModal) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      kind: "testimonial",
      id: tModal.mode === "edit" ? tModal.t.id : undefined,
      name: form.get("name"),
      role: form.get("role"),
      content: form.get("content"),
      rating: Number(form.get("rating")),
      featured: form.get("featured") === "on",
    };
    const res = await fetch("/api/admin/content", {
      method: tModal.mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setTModal(null); refresh(); }
  }

  async function saveNeighborhood(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nModal) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      kind: "neighborhood",
      id: nModal.mode === "edit" ? nModal.n.id : undefined,
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      avgPrice: form.get("avgPrice") || null,
      imageUrl: form.get("imageUrl") || null,
      block: form.get("block") || null,
    };
    const res = await fetch("/api/admin/content", {
      method: nModal.mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setNModal(null); refresh(); }
  }

  async function deleteItem(type: "testimonial" | "neighborhood", id: number) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await fetch(`/api/admin/content?type=${type}&id=${id}`, { method: "DELETE" });
    refresh();
  }

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    for (const [key, value] of form.entries()) {
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "setting", key, value }),
      });
    }
    setSaving(false);
    refresh();
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <div className="mb-6">
        <h2 className="text-lg font-body font-bold text-ink">Content & Settings</h2>
        <p className="text-[12px] font-body text-stone-400">Everything that appears on the public site</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white border border-ink/[0.08] rounded-full w-fit mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[12.5px] font-body font-semibold transition-colors whitespace-nowrap ${
                tab === t.id ? "bg-ink text-white" : "text-stone-400 hover:text-ink"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.8} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ===== TESTIMONIALS ===== */}
      {tab === "testimonials" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-body text-stone-400">{testimonials.length} testimonials · {testimonials.filter((t) => t.featured).length} featured</p>
            <button onClick={() => setTModal({ mode: "add" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white text-[12.5px] font-body font-bold rounded-full hover:bg-graphite transition-colors">
              <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Add Testimonial
            </button>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white border border-ink/[0.07] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-brass fill-brass" strokeWidth={1.5} />
                    ))}
                  </div>
                  {t.featured && <span className="px-2 py-0.5 rounded-full bg-brass/15 text-brass text-[9px] font-body font-bold uppercase tracking-wide">Featured</span>}
                </div>
                <p className="text-[13px] font-body text-graphite leading-relaxed line-clamp-3 italic">“{t.content}”</p>
                <p className="text-[12px] font-body font-bold text-ink mt-3">{t.name}</p>
                <p className="text-[11px] font-body text-stone-400">{t.role}</p>
                <div className="flex gap-1.5 mt-4 pt-3 border-t border-ink/[0.05]">
                  <button onClick={() => setTModal({ mode: "edit", t })} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-ink/10 text-[11px] font-body font-semibold text-graphite hover:border-brass hover:text-brass transition-colors">
                    <Pencil className="w-3 h-3" strokeWidth={1.8} /> Edit
                  </button>
                  <button onClick={() => deleteItem("testimonial", t.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-500/20 text-[11px] font-body font-semibold text-red-500 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3 h-3" strokeWidth={1.8} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-sm font-body text-stone-400 col-span-full text-center py-12">No testimonials yet</p>}
          </div>
        </div>
      )}

      {/* ===== NEIGHBORHOODS ===== */}
      {tab === "neighborhoods" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-body text-stone-400">{neighborhoods.length} neighborhoods</p>
            <button onClick={() => setNModal({ mode: "add" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white text-[12.5px] font-body font-bold rounded-full hover:bg-graphite transition-colors">
              <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Add Neighborhood
            </button>
          </div>
          <div className="bg-white border border-ink/[0.07] divide-y divide-ink/[0.05]">
            {neighborhoods.map((n) => (
              <div key={n.id} className="px-5 py-4 flex items-center gap-4">
                <span className="w-10 h-10 rounded-lg bg-linen flex items-center justify-center text-graphite">
                  <MapPin className="w-4.5 h-4.5 w-[18px] h-[18px] text-brass" strokeWidth={1.7} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-body font-bold text-ink">{n.name}</p>
                  <p className="text-[11px] font-body text-stone-400 truncate">{n.description}</p>
                </div>
                {n.block && <span className="hidden sm:block px-2.5 py-1 rounded bg-linen text-[10px] font-body font-bold uppercase tracking-wide text-graphite/70">{n.block}</span>}
                {n.avgPrice != null && <span className="hidden md:block text-[12.5px] font-body font-bold text-ink tabular-nums">{(n.avgPrice / 1000000).toFixed(1)}M ETB</span>}
                <div className="flex gap-1.5">
                  <button onClick={() => setNModal({ mode: "edit", n })} aria-label="Edit" className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center text-graphite hover:border-brass hover:text-brass transition-colors">
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </button>
                  <button onClick={() => deleteItem("neighborhood", n.id)} aria-label="Delete" className="w-8 h-8 rounded-lg border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            ))}
            {neighborhoods.length === 0 && <p className="text-sm font-body text-stone-400 text-center py-12">No neighborhoods yet</p>}
          </div>
        </div>
      )}

      {/* ===== GENERAL ===== */}
      {tab === "general" && (
        <div className="max-w-xl">
          <form onSubmit={saveSettings} className="bg-white border border-ink/[0.07] p-6 space-y-4">
            {[
              { key: "office_phone", label: "Office phone" },
              { key: "office_email", label: "Office email" },
              { key: "office_address", label: "Office address" },
              { key: "whatsapp", label: "WhatsApp number" },
              { key: "office_hours", label: "Office hours" },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input name={f.key} defaultValue={settings[f.key] ?? ""} className={inputCls} />
              </div>
            ))}
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60">
              <Save className="w-4 h-4" strokeWidth={1.8} /> {saving ? "Saving…" : "Save Settings"}
            </button>
          </form>
        </div>
      )}

      {/* Testimonial modal */}
      <AnimatePresence>
        {tModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTModal(null)} className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-md h-fit bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08]">
                <h3 className="text-[15px] font-body font-bold text-ink">{tModal.mode === "add" ? "Add Testimonial" : "Edit Testimonial"}</h3>
                <button onClick={() => setTModal(null)} aria-label="Close" className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors"><X className="w-4 h-4" strokeWidth={1.8} /></button>
              </div>
              <form onSubmit={saveTestimonial} className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input name="name" required defaultValue={tModal.mode === "edit" ? tModal.t.name : ""} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Role / context</label>
                  <input name="role" defaultValue={tModal.mode === "edit" ? (tModal.t.role ?? "") : ""} placeholder="e.g. Buyer · CMC Block 9" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Rating</label>
                  <select name="rating" defaultValue={tModal.mode === "edit" ? (tModal.t.rating ?? 5) : 5} className={inputCls}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Content *</label>
                  <textarea name="content" required rows={4} defaultValue={tModal.mode === "edit" ? tModal.t.content : ""} className={`${inputCls} resize-none`} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" defaultChecked={tModal.mode === "edit" ? !!tModal.t.featured : false} className="w-4 h-4 accent-[#C4A96B]" />
                  <span className="text-[13px] font-body font-medium text-graphite">Show on homepage</span>
                </label>
                <button type="submit" disabled={saving} className="w-full py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60">
                  {saving ? "Saving…" : "Save Testimonial"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Neighborhood modal */}
      <AnimatePresence>
        {nModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNModal(null)} className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-md h-fit bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08]">
                <h3 className="text-[15px] font-body font-bold text-ink">{nModal.mode === "add" ? "Add Neighborhood" : "Edit Neighborhood"}</h3>
                <button onClick={() => setNModal(null)} aria-label="Close" className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors"><X className="w-4 h-4" strokeWidth={1.8} /></button>
              </div>
              <form onSubmit={saveNeighborhood} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input name="name" required defaultValue={nModal.mode === "edit" ? nModal.n.name : ""} className={inputCls} placeholder="CMC Block 9" />
                  </div>
                  <div>
                    <label className={labelCls}>Slug *</label>
                    <input name="slug" required defaultValue={nModal.mode === "edit" ? nModal.n.slug : ""} className={inputCls} placeholder="cmc-block-9" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input name="description" defaultValue={nModal.mode === "edit" ? (nModal.n.description ?? "") : ""} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Avg price (ETB)</label>
                    <input name="avgPrice" type="number" defaultValue={nModal.mode === "edit" ? (nModal.n.avgPrice ?? "") : ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Block ID</label>
                    <input name="block" defaultValue={nModal.mode === "edit" ? (nModal.n.block ?? "") : ""} className={inputCls} placeholder="CMC Block 9" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Image URL</label>
                  <input name="imageUrl" defaultValue={nModal.mode === "edit" ? (nModal.n.imageUrl ?? "") : ""} className={inputCls} placeholder="/images/prop-apartment.jpg" />
                </div>
                <button type="submit" disabled={saving} className="w-full py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60">
                  {saving ? "Saving…" : "Save Neighborhood"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
