"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Search, Star, Pencil, ExternalLink, X, CheckSquare, Square } from "lucide-react";
import { formatPrice, getStatusColor, getPropertyTypeLabel } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";

interface Property {
  id: number; title: string; slug: string; propertyType: string;
  listingType: string; status: string; price: number; currency: string;
  bedrooms: number | null; bathrooms: number | null; size: number | null;
  neighborhood: string | null; block: string | null; address: string | null;
  description: string | null; amenities: string[] | null; media: string[] | null;
  featured: boolean | null; verified: boolean | null; views: number | null;
  yearBuilt: number | null; furnished: boolean | null;
  metaTitle: string | null; metaDescription: string | null;
  agentId: number | null; agentName: string | null; createdAt: Date;
}

interface Props {
  properties: Property[];
  agents: { id: number; name: string }[];
  hoods: string[];
  allAmenities: string[];
}

const statusOptions = ["draft", "published", "reserved", "sold", "archived"];

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminPropertiesClient({ properties, agents, hoods, allAmenities }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; property: Property } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Initialize uploaded images when modal opens
  useEffect(() => {
    if (modal) {
      if (modal.mode === "edit" && modal.property.media) {
        setUploadedImages(modal.property.media);
      } else {
        setUploadedImages([]);
      }
    }
  }, [modal]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || [p.title, p.address, p.neighborhood, p.block].filter(Boolean).join(" ").toLowerCase().includes(q);
      const matchesType = !typeFilter || p.propertyType === typeFilter;
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, search, typeFilter, statusFilter]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  function toggleAll() {
    setSelected(allSelected ? [] : filtered.map((p) => p.id));
  }
  function toggleOne(id: number) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function updateProperty(id: number, data: Record<string, unknown>) {
    await fetch("/api/admin/properties", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    router.refresh();
  }

  async function bulkUpdate(field: string, value: unknown) {
    for (const id of selected) await updateProperty(id, { [field]: value });
    setSelected([]);
  }

  async function saveForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      propertyType: form.get("propertyType"),
      listingType: form.get("listingType"),
      status: form.get("status"),
      price: Number(form.get("price")) || 0,
      bedrooms: form.get("bedrooms") ? Number(form.get("bedrooms")) : null,
      bathrooms: form.get("bathrooms") ? Number(form.get("bathrooms")) : null,
      size: form.get("size") ? Number(form.get("size")) : null,
      yearBuilt: form.get("yearBuilt") ? Number(form.get("yearBuilt")) : null,
      furnished: form.get("furnished") === "on",
      featured: form.get("featured") === "on",
      verified: form.get("verified") === "on",
      neighborhood: form.get("neighborhood") || null,
      block: form.get("block") || null,
      address: form.get("address") || null,
      description: form.get("description") || null,
      amenities: (form.getAll("amenities") as string[]).filter(Boolean),
      media: uploadedImages, // Use uploaded images from state
      metaTitle: form.get("metaTitle") || null,
      metaDescription: form.get("metaDescription") || null,
      agentId: form.get("agentId") ? Number(form.get("agentId")) : undefined,
    };

    const res = modal.mode === "add"
      ? await fetch("/api/admin/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, agentId: payload.agentId ?? undefined }),
        })
      : await fetch("/api/admin/properties", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: modal.property.id, ...payload }),
        });

    if (!res.ok) {
      alert("Failed to save property");
      setSaving(false);
      return;
    }
    setSaving(false);
    setModal(null);
    setUploadedImages([]);
    router.refresh();
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-body font-bold text-ink">Listings</h2>
            <p className="text-[12px] font-body text-stone-400">{properties.length} total · {properties.filter((p) => p.status === "published").length} live</p>
          </div>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> New Listing
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2.5 px-4 bg-white border border-ink/[0.08] focus-within:border-brass transition-colors">
          <Search className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.8} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, address, block…"
            className="w-full py-2.5 bg-transparent text-[13px] font-body text-ink placeholder-stone-400 focus:outline-none"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-ink/[0.08] text-[13px] font-body text-graphite focus:outline-none cursor-pointer">
          <option value="">All types</option>
          <option value="apartment">Apartment</option>
          <option value="commercial">Commercial</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-ink/[0.08] text-[13px] font-body text-graphite focus:outline-none cursor-pointer">
          <option value="">All statuses</option>
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-center gap-2 mb-4 px-4 py-3 bg-ink text-white rounded-lg"
          >
            <span className="text-[12px] font-body font-semibold mr-2">{selected.length} selected</span>
            <button onClick={() => bulkUpdate("status", "published")} className="px-3 py-1.5 text-[11px] font-body font-bold bg-emerald-500/20 text-emerald-300 rounded-full hover:bg-emerald-500/30 transition-colors">Publish</button>
            <button onClick={() => bulkUpdate("status", "archived")} className="px-3 py-1.5 text-[11px] font-body font-bold bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors">Archive</button>
            <button onClick={() => bulkUpdate("featured", true)} className="px-3 py-1.5 text-[11px] font-body font-bold bg-brass/20 text-brass rounded-full hover:bg-brass/30 transition-colors">Feature</button>
            <button onClick={() => bulkUpdate("featured", false)} className="px-3 py-1.5 text-[11px] font-body font-bold bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors">Unfeature</button>
            <button onClick={() => setSelected([])} className="ml-auto text-[11px] font-body font-semibold text-white/60 hover:text-white transition-colors">Clear</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white border border-ink/[0.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] font-body">
            <thead>
              <tr className="border-b border-ink/[0.07] bg-linen/60">
                <th className="w-10 px-3 py-3">
                  <button onClick={toggleAll} aria-label="Select all" className="text-stone-400 hover:text-ink transition-colors">
                    {allSelected ? <CheckSquare className="w-4 h-4 text-brass" strokeWidth={1.8} /> : <Square className="w-4 h-4" strokeWidth={1.8} />}
                  </button>
                </th>
                <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Listing</th>
                <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Type</th>
                <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Price</th>
                <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Status</th>
                <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 hidden lg:table-cell">Agent</th>
                <th className="text-right px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Views</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.05]">
              {filtered.map((p) => (
                <tr key={p.id} className={`hover:bg-linen/50 transition-colors ${selected.includes(p.id) ? "bg-brass/[0.05]" : ""}`}>
                  <td className="px-3 py-3.5">
                    <button onClick={() => toggleOne(p.id)} aria-label="Select" className="text-stone-400 hover:text-ink transition-colors">
                      {selected.includes(p.id) ? <CheckSquare className="w-4 h-4 text-brass" strokeWidth={1.8} /> : <Square className="w-4 h-4" strokeWidth={1.8} />}
                    </button>
                  </td>
                  <td className="px-3 py-3.5 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      {p.featured && <Star className="w-3.5 h-3.5 text-brass fill-brass shrink-0" strokeWidth={1.5} />}
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{p.title}</p>
                        <p className="text-[11px] text-stone-400 truncate">{p.block || p.neighborhood} · {p.bedrooms ?? 0} bd · {p.size ?? 0} m²</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-graphite">{getPropertyTypeLabel(p.propertyType)}</span>
                    <span className="block text-[10px] text-stone-400 capitalize">{p.listingType}</span>
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-ink whitespace-nowrap tabular-nums">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-3 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide capitalize ${getStatusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-3 py-3.5 text-graphite hidden lg:table-cell">{p.agentName ?? "—"}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums text-graphite">{p.views ?? 0}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setModal({ mode: "edit", property: p })} aria-label="Edit"
                        className="w-8 h-8 rounded-lg border border-ink/[0.1] flex items-center justify-center text-graphite hover:border-brass hover:text-brass transition-colors">
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                      <a href={`/properties/${p.slug}`} target="_blank" aria-label="View"
                        className="w-8 h-8 rounded-lg border border-ink/[0.1] flex items-center justify-center text-graphite hover:border-slate hover:text-slate transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-body text-stone-400">No listings match your filters</p>
            <button onClick={() => setModal({ mode: "add" })} className="mt-3 text-[13px] font-body font-semibold text-brass hover:underline">Create your first listing →</button>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-2xl h-[90vh] bg-white flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08] shrink-0">
                <h3 className="text-[15px] font-body font-bold text-ink">
                  {modal.mode === "add" ? "New Listing" : `Edit — ${modal.property.title}`}
                </h3>
                <button onClick={() => setModal(null)} aria-label="Close" className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors">
                  <X className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>

              <form onSubmit={saveForm} className="flex-1 overflow-y-auto px-6 py-5 space-y-5" id="property-form">
                {/* Basic */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Basic Information</p>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Title *</label>
                      <input name="title" required defaultValue={modal.mode === "edit" ? modal.property.title : ""} placeholder="e.g. 3-Bedroom Apartment, CMC Block 9" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Type</label>
                        <select name="propertyType" defaultValue={modal.mode === "edit" ? modal.property.propertyType : "apartment"} className={inputCls}>
                          <option value="apartment">Apartment</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Listing</label>
                        <select name="listingType" defaultValue={modal.mode === "edit" ? modal.property.listingType : "sale"} className={inputCls}>
                          <option value="sale">For Sale</option>
                          <option value="rent">For Rent</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Status</label>
                        <select name="status" defaultValue={modal.mode === "edit" ? modal.property.status : "draft"} className={inputCls}>
                          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className={labelCls}>Price (ETB) *</label>
                        <input name="price" type="number" required defaultValue={modal.mode === "edit" ? modal.property.price : ""} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Bedrooms</label>
                        <input name="bedrooms" type="number" defaultValue={modal.mode === "edit" ? (modal.property.bedrooms ?? "") : ""} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Bathrooms</label>
                        <input name="bathrooms" type="number" defaultValue={modal.mode === "edit" ? (modal.property.bathrooms ?? "") : ""} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Size (m²)</label>
                        <input name="size" type="number" defaultValue={modal.mode === "edit" ? (modal.property.size ?? "") : ""} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea name="description" rows={4} defaultValue={modal.mode === "edit" ? (modal.property.description ?? "") : ""} className={`${inputCls} resize-none`} placeholder="Describe the property in detail…" />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Location</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Neighborhood</label>
                      <select name="neighborhood" defaultValue={modal.mode === "edit" ? (modal.property.neighborhood ?? "") : ""} className={inputCls}>
                        <option value="">Select…</option>
                        {hoods.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Block (CMC ID)</label>
                      <input name="block" defaultValue={modal.mode === "edit" ? (modal.property.block ?? "") : ""} placeholder="CMC Block 9" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Year built</label>
                      <input name="yearBuilt" type="number" defaultValue={modal.mode === "edit" ? (modal.property.yearBuilt ?? "") : ""} className={inputCls} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className={labelCls}>Address</label>
                    <input name="address" defaultValue={modal.mode === "edit" ? (modal.property.address ?? "") : ""} placeholder="Street, block, landmark" className={inputCls} />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {allAmenities.map((a) => {
                      const checked = modal.mode === "edit" && (modal.property.amenities ?? []).includes(a);
                      return (
                        <label key={a} className="cursor-pointer">
                          <input type="checkbox" name="amenities" value={a} defaultChecked={checked} className="sr-only peer" />
                          <span className="inline-block px-3 py-1.5 text-[12px] font-body font-medium border border-ink/[0.12] text-graphite/70 peer-checked:bg-ink peer-checked:text-white peer-checked:border-ink transition-colors">
                            {a}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Media */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Media</p>
                  <ImageUploader
                    propertyId={modal.mode === "edit" ? modal.property.id : undefined}
                    existingImages={uploadedImages}
                    onImagesChange={setUploadedImages}
                  />
                </div>

                {/* SEO + toggles */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">SEO & Flags</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className={labelCls}>Meta title</label>
                      <input name="metaTitle" defaultValue={modal.mode === "edit" ? (modal.property.metaTitle ?? "") : ""} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Agent</label>
                      <select name="agentId" defaultValue={modal.mode === "edit" ? (modal.property.agentId ?? "") : ""} className={inputCls}>
                        <option value="">Unassigned</option>
                        {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className={labelCls}>Meta description</label>
                    <textarea name="metaDescription" rows={2} defaultValue={modal.mode === "edit" ? (modal.property.metaDescription ?? "") : ""} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      { name: "featured", label: "Featured", def: modal.mode === "edit" ? !!modal.property.featured : false },
                      { name: "verified", label: "Verified", def: modal.mode === "edit" ? !!modal.property.verified : true },
                      { name: "furnished", label: "Furnished", def: modal.mode === "edit" ? !!modal.property.furnished : false },
                    ].map((t) => (
                      <label key={t.name} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name={t.name} defaultChecked={t.def} className="w-4 h-4 accent-[#C4A96B]" />
                        <span className="text-[13px] font-body font-medium text-graphite">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>

              <div className="px-6 py-4 border-t border-ink/[0.08] flex gap-3 shrink-0">
                <button type="submit" form="property-form" disabled={saving}
                  className="flex-1 py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60">
                  {saving ? "Saving…" : modal.mode === "add" ? "Create Listing" : "Save Changes"}
                </button>
                <button type="button" onClick={() => setModal(null)}
                  className="px-6 py-3 border border-ink/10 text-[13px] font-body font-semibold text-graphite rounded-full hover:bg-linen transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
