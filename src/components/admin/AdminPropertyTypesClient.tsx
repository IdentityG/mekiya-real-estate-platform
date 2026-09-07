"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, X, Home, Building2, Pencil, Trash2, Warehouse, Building, TreePine, Map } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface PropertyType {
  id: number;
  value: string;
  label: string;
  description: string | null;
  icon: string;
  imageUrl: string | null;
  color: string;
  isActive: boolean;
  sortOrder: number;
  count: number;
}

interface Props {
  types: PropertyType[];
  canManage: boolean;
}

const ICON_OPTIONS = [
  { value: "Home", label: "Home", Icon: Home },
  { value: "Building2", label: "Building", Icon: Building2 },
  { value: "Building", label: "Office", Icon: Building },
  { value: "Warehouse", label: "Warehouse", Icon: Warehouse },
  { value: "TreePine", label: "Villa/Land", Icon: TreePine },
  { value: "Map", label: "Land", Icon: Map },
];

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminPropertyTypesClient({ types, canManage }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; type: PropertyType } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);

  // Initialize image when modal opens
  useEffect(() => {
    if (modal) {
      if (modal.mode === "edit" && modal.type.imageUrl) {
        setUploadedImage([modal.type.imageUrl]);
      } else {
        setUploadedImage([]);
      }
    }
  }, [modal]);

  function getIcon(iconName: string) {
    const iconOption = ICON_OPTIONS.find((opt) => opt.value === iconName);
    return iconOption?.Icon || Building2;
  }

  async function saveForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const payload = {
      value: modal.mode === "add" ? form.get("value") : undefined,
      label: form.get("label"),
      description: form.get("description") || null,
      icon: form.get("icon") || "Building2",
      imageUrl: uploadedImage[0] || null,
      color: form.get("color") || "#C4A96B",
      sortOrder: form.get("sortOrder") ? Number(form.get("sortOrder")) : 0,
      isActive: form.get("isActive") === "on",
    };

    const url = "/api/admin/property-types";
    const method = modal.mode === "add" ? "POST" : "PUT";
    const body =
      modal.mode === "edit"
        ? JSON.stringify({ id: modal.type.id, ...payload })
        : JSON.stringify(payload);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error || `Failed to ${modal.mode === "add" ? "add" : "update"} property type`
      );
      setSaving(false);
      return;
    }

    setSaving(false);
    setModal(null);
    setUploadedImage([]);
    router.refresh();
  }

  async function deleteType(id: number) {
    if (!confirm("Are you sure you want to delete this property type? Properties using this type may be affected.")) {
      return;
    }

    const res = await fetch(`/api/admin/property-types?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete property type");
      return;
    }

    router.refresh();
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Property Types</h2>
          <p className="text-[12px] font-body text-stone-400">
            {types.length} types configured
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setModal({ mode: "add" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Property Type
          </button>
        )}
      </div>

      {/* Current Types Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {types.map((type) => {
          const Icon = getIcon(type.icon);
          return (
            <div
              key={type.id}
              className="bg-white border border-ink/[0.07] overflow-hidden hover:border-ink/20 transition-colors"
            >
              {/* Image or Icon Header */}
              {type.imageUrl ? (
                <div className="relative h-40 bg-gradient-to-br from-linen to-cream">
                  <img
                    src={type.imageUrl}
                    alt={type.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6" style={{ color: type.color }} strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="p-5 flex items-center gap-4 border-b border-ink/[0.05]"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${type.color}25`, color: type.color }}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-body font-bold text-ink">{type.label}</p>
                    <p className="text-[11.5px] font-body text-stone-400 truncate">
                      {type.description || "No description"}
                    </p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {type.imageUrl && (
                  <div className="mb-4">
                    <p className="text-[14.5px] font-body font-bold text-ink mb-1">
                      {type.label}
                    </p>
                    <p className="text-[11.5px] font-body text-stone-400">
                      {type.description || "No description"}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-body font-bold uppercase tracking-[0.12em] text-stone-400">
                    Active Listings
                  </span>
                  <span className="text-2xl font-body font-bold text-ink tabular-nums">
                    {type.count}
                  </span>
                </div>

                {/* Technical Info */}
                <div className="pb-4 border-b border-ink/[0.05] mb-4">
                  <p className="text-[11px] font-body text-stone-400">
                    <span className="font-mono text-brass">{type.value}</span> · Database
                    value
                  </p>
                  {!type.isActive && (
                    <p className="text-[11px] font-body text-red-500 mt-1">● Inactive</p>
                  )}
                </div>

                {/* Actions */}
                {canManage && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal({ mode: "edit", type })}
                      className="flex-1 py-2 px-3 border border-ink/[0.1] text-[12px] font-body font-semibold text-graphite rounded-lg hover:border-brass hover:text-brass transition-colors flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} /> Edit
                    </button>
                    <button
                      onClick={() => deleteType(type.id)}
                      className="px-3 py-2 border border-red-200 text-[12px] font-body font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
                    ? "Add Property Type"
                    : `Edit — ${modal.type.label}`}
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
                id="property-type-form"
              >
                {/* Basic Info */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Basic Information
                  </p>
                  <div className="space-y-3">
                    {modal.mode === "add" && (
                      <div>
                        <label className={labelCls}>Value (Database key) *</label>
                        <input
                          name="value"
                          required
                          pattern="[a-z0-9_]+"
                          placeholder="e.g. villa, land, warehouse"
                          className={inputCls}
                        />
                        <p className="text-[10px] font-body text-stone-400 mt-1">
                          Lowercase, no spaces. Use underscores for multi-word (e.g. town_house)
                        </p>
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>Label (Display name) *</label>
                      <input
                        name="label"
                        required
                        defaultValue={modal.mode === "edit" ? modal.type.label : ""}
                        placeholder="e.g. Villa, Land, Warehouse"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={
                          modal.mode === "edit" ? modal.type.description || "" : ""
                        }
                        placeholder="Brief description of this property type"
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Settings */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Visual Settings
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelCls}>Icon</label>
                      <select
                        name="icon"
                        defaultValue={modal.mode === "edit" ? modal.type.icon : "Building2"}
                        className={inputCls}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Color</label>
                      <input
                        name="color"
                        type="color"
                        defaultValue={modal.mode === "edit" ? modal.type.color : "#C4A96B"}
                        className="w-full h-[42px] px-2 py-1 bg-linen border border-ink/[0.1] rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Sort Order</label>
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={modal.mode === "edit" ? modal.type.sortOrder : 0}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isActive"
                          defaultChecked={
                            modal.mode === "edit" ? modal.type.isActive : true
                          }
                          className="w-4 h-4 accent-[#C4A96B]"
                        />
                        <span className="text-[13px] font-body font-medium text-graphite">
                          Active
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">
                    Type Image (Optional)
                  </p>
                  <ImageUploader
                    existingImages={uploadedImage}
                    onImagesChange={(images) => setUploadedImage(images.slice(0, 1))}
                  />
                  <p className="text-[11px] font-body text-stone-400 mt-2">
                    Upload a representative image for this property type
                  </p>
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
                  form="property-type-form"
                  disabled={saving}
                  className="flex-1 py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : modal.mode === "add"
                    ? "Create Property Type"
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
