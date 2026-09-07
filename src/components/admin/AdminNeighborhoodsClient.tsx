"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, X, MapPin, Pencil, Trash2, Star, DollarSign } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { formatPrice } from "@/lib/utils";

interface Neighborhood {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  avgPrice: number | null;
  imageUrl: string | null;
  block: string | null;
  lat: number | null;
  lng: number | null;
  featured: boolean | null;
  sortOrder: number | null;
  propertyCount: number;
}

interface Props {
  neighborhoods: Neighborhood[];
  canManage: boolean;
}

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminNeighborhoodsClient({ neighborhoods: initialNeighborhoods, canManage }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; neighborhood: Neighborhood } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);

  // Initialize image when modal opens
  useEffect(() => {
    if (modal) {
      if (modal.mode === "edit" && modal.neighborhood.imageUrl) {
        setUploadedImage([modal.neighborhood.imageUrl]);
      } else {
        setUploadedImage([]);
      }
    }
  }, [modal]);

  async function saveForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const payload = {
      name: form.get("name"),
      description: form.get("description") || null,
      avgPrice: form.get("avgPrice") || null,
      imageUrl: uploadedImage[0] || null,
      block: form.get("block") || null,
      lat: form.get("lat") || null,
      lng: form.get("lng") || null,
      featured: form.get("featured") === "on",
      sortOrder: form.get("sortOrder") ? Number(form.get("sortOrder")) : 0,
    };

    const url = "/api/admin/neighborhoods";
    const method = modal.mode === "add" ? "POST" : "PUT";
    const body =
      modal.mode === "edit"
        ? JSON.stringify({ id: modal.neighborhood.id, ...payload })
        : JSON.stringify(payload);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error || `Failed to ${modal.mode === "add" ? "add" : "update"} neighborhood`
      );
      setSaving(false);
      return;
    }

    setSaving(false);
    setModal(null);
    setUploadedImage([]);
    router.refresh();
  }

  async function deleteNeighborhood(id: number) {
    if (!confirm("Are you sure you want to delete this neighborhood? This action cannot be undone.")) {
      return;
    }

    const res = await fetch(`/api/admin/neighborhoods?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || "Failed to delete neighborhood");
      return;
    }

    router.refresh();
  }

  const featured = initialNeighborhoods.filter((n) => n.featured);
  const regular = initialNeighborhoods.filter((n) => !n.featured);

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Neighborhoods</h2>
          <p className="text-[12px] font-body text-stone-400">
            {initialNeighborhoods.length} neighborhoods · {featured.length} featured
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setModal({ mode: "add" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Neighborhood
          </button>
        )}
      </div>

      {/* Featured Section */}
      {featured.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-brass fill-brass" strokeWidth={1.8} />
            <h3 className="text-[13px] font-body font-bold uppercase tracking-[0.14em] text-stone-400">
              Featured Neighborhoods
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {featured.map((neighborhood) => (
              <NeighborhoodCard
                key={neighborhood.id}
                neighborhood={neighborhood}
                canManage={canManage}
                onEdit={() => setModal({ mode: "edit", neighborhood })}
                onDelete={() => deleteNeighborhood(neighborhood.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Neighborhoods */}
      <div>
        {featured.length > 0 && (
          <h3 className="text-[13px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-4">
            All Neighborhoods
          </h3>
        )}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {regular.map((neighborhood) => (
            <NeighborhoodCard
              key={neighborhood.id}
              neighborhood={neighborhood}
              canManage={canManage}
              onEdit={() => setModal({ mode: "edit", neighborhood })}
              onDelete={() => deleteNeighborhood(neighborhood.id)}
            />
          ))}
        </div>
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-2xl h-[90vh] bg-white flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08] shrink-0">
                <h3 className="text-[15px] font-body font-bold text-ink">
                  {modal.mode === "add"
                    ? "Add Neighborhood"
                    : `Edit — ${modal.neighborhood.name}`}
                </h3>
                <button
                  onClick={() => setModal(null)}
                  aria-label="Close"
                  className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>

              <form
                onSubmit={saveForm}
                className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
                id="neighborhood-form"
              >
                {/* Basic Info */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Basic Information
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Neighborhood Name *</label>
                      <input
                        name="name"
                        required
                        defaultValue={modal.mode === "edit" ? modal.neighborhood.name : ""}
                        placeholder="e.g. Bole, CMC, Sarbet"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={
                          modal.mode === "edit" ? modal.neighborhood.description || "" : ""
                        }
                        placeholder="Describe this neighborhood..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>CMC Block</label>
                        <input
                          name="block"
                          defaultValue={modal.mode === "edit" ? modal.neighborhood.block || "" : ""}
                          placeholder="e.g. CMC Block 9"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Avg. Price (ETB)</label>
                        <input
                          name="avgPrice"
                          type="number"
                          step="0.01"
                          defaultValue={modal.mode === "edit" ? modal.neighborhood.avgPrice || "" : ""}
                          placeholder="e.g. 15000000"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Location Coordinates (Optional)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Latitude</label>
                      <input
                        name="lat"
                        type="number"
                        step="any"
                        defaultValue={modal.mode === "edit" ? modal.neighborhood.lat || "" : ""}
                        placeholder="e.g. 9.0192"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Longitude</label>
                      <input
                        name="lng"
                        type="number"
                        step="any"
                        defaultValue={modal.mode === "edit" ? modal.neighborhood.lng || "" : ""}
                        placeholder="e.g. 38.7525"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Neighborhood Image
                  </p>
                  <ImageUploader
                    existingImages={uploadedImage}
                    onImagesChange={(images) => setUploadedImage(images.slice(0, 1))}
                  />
                  <p className="text-[11px] font-body text-stone-400 mt-2">
                    Upload a representative image of this neighborhood
                  </p>
                </div>

                {/* Settings */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Display Settings
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Sort Order</label>
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={modal.mode === "edit" ? modal.neighborhood.sortOrder || 0 : 0}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={
                            modal.mode === "edit" ? modal.neighborhood.featured || false : true
                          }
                          className="w-4 h-4 accent-[#C4A96B]"
                        />
                        <span className="text-[13px] font-body font-medium text-graphite">
                          Featured
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-[12.5px] font-body rounded-lg">
                    {error}
                  </div>
                )}
              </form>

              <div className="px-6 py-4 border-t border-ink/[0.08] flex gap-3 shrink-0">
                <button
                  type="submit"
                  form="neighborhood-form"
                  disabled={saving}
                  className="flex-1 py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : modal.mode === "add"
                    ? "Create Neighborhood"
                    : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-6 py-3 border border-ink/10 text-[13px] font-body font-semibold text-graphite rounded-full hover:bg-linen transition-colors"
                >
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

function NeighborhoodCard({
  neighborhood,
  canManage,
  onEdit,
  onDelete,
}: {
  neighborhood: Neighborhood;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-ink/[0.07] overflow-hidden hover:border-ink/20 transition-colors">
      {/* Image */}
      {neighborhood.imageUrl ? (
        <div className="relative h-40 bg-gradient-to-br from-linen to-cream">
          <img
            src={neighborhood.imageUrl}
            alt={neighborhood.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          {neighborhood.featured && (
            <div className="absolute top-3 right-3">
              <Star className="w-5 h-5 text-brass fill-brass" strokeWidth={1.8} />
            </div>
          )}
        </div>
      ) : (
        <div
          className="h-40 bg-gradient-to-br from-linen to-cream flex items-center justify-center relative"
        >
          <MapPin className="w-12 h-12 text-stone-300" strokeWidth={1.5} />
          {neighborhood.featured && (
            <div className="absolute top-3 right-3">
              <Star className="w-5 h-5 text-brass fill-brass" strokeWidth={1.8} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[15px] font-body font-bold text-ink mb-2">
          {neighborhood.name}
        </h3>
        {neighborhood.description && (
          <p className="text-[12.5px] font-body text-stone-400 line-clamp-2 mb-4">
            {neighborhood.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-ink/[0.05] mb-4">
          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.12em] text-stone-400 mb-1">
              Properties
            </p>
            <p className="text-lg font-body font-bold text-ink tabular-nums">
              {neighborhood.propertyCount}
            </p>
          </div>
          {neighborhood.avgPrice && (
            <div>
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.12em] text-stone-400 mb-1">
                Avg. Price
              </p>
              <p className="text-[13px] font-body font-semibold text-brass tabular-nums">
                {formatPrice(neighborhood.avgPrice)}
              </p>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-1 mb-4">
          {neighborhood.block && (
            <p className="text-[11px] font-body text-stone-400">
              <span className="font-mono text-brass">{neighborhood.block}</span>
            </p>
          )}
          {neighborhood.lat && neighborhood.lng && (
            <p className="text-[11px] font-body text-stone-400">
              {neighborhood.lat.toFixed(4)}, {neighborhood.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* Actions */}
        {canManage && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-2 px-3 border border-ink/[0.1] text-[12px] font-body font-semibold text-graphite rounded-lg hover:border-brass hover:text-brass transition-colors flex items-center justify-center gap-2"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} /> Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 border border-red-200 text-[12px] font-body font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
