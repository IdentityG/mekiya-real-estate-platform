"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserPlus, X, ShieldCheck, UserRound, Pencil } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  specialty: string | null;
  bio: string | null;
  createdAt: Date;
  listingCount: number;
  leadCount: number;
  avatarUrl: string | null;
}

interface Props {
  team: Member[];
  canManage: boolean;
}

const roleMeta: Record<string, { label: string; color: string }> = {
  super_admin: { label: "Super Admin", color: "bg-brass/15 text-brass" },
  sales_manager: { label: "Sales Manager", color: "bg-slate/10 text-slate" },
  agent: { label: "Agent", color: "bg-emerald-500/10 text-emerald-600" },
};

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminAgentsClient({ team, canManage }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; member: Member } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadedAvatar, setUploadedAvatar] = useState<string[]>([]);

  // Initialize avatar when modal opens
  useEffect(() => {
    if (modal) {
      if (modal.mode === "edit" && modal.member.avatarUrl) {
        setUploadedAvatar([modal.member.avatarUrl]);
      } else {
        setUploadedAvatar([]);
      }
    }
  }, [modal]);

  async function updateRole(id: number, role: string) {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    router.refresh();
  }

  async function saveForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);
    
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      role: form.get("role"),
      phone: form.get("phone") || null,
      specialty: form.get("specialty") || null,
      bio: form.get("bio") || null,
      avatarUrl: uploadedAvatar[0] || null,
      ...(modal.mode === "add" && { password: form.get("password") }),
    };

    const url = "/api/admin/users";
    const method = modal.mode === "add" ? "POST" : "PUT";
    const body = modal.mode === "edit" 
      ? JSON.stringify({ id: modal.member.id, ...payload })
      : JSON.stringify(payload);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || `Failed to ${modal.mode === "add" ? "add" : "update"} team member`);
      setSaving(false);
      return;
    }
    setSaving(false);
    setModal(null);
    setUploadedAvatar([]);
    router.refresh();
  }

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Team & Agents</h2>
          <p className="text-[12px] font-body text-stone-400">{team.length} team members</p>
        </div>
        {canManage && (
          <button
            onClick={() => setModal({ mode: "add" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors"
          >
            <UserPlus className="w-4 h-4" strokeWidth={2} /> Add Team Member
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((m) => {
          const meta = roleMeta[m.role] ?? roleMeta.agent;
          return (
            <div key={m.id} className="bg-white border border-ink/[0.07] overflow-hidden hover:border-ink/20 transition-colors">
              {/* Header */}
              <div className="p-5 flex items-center gap-4 border-b border-ink/[0.05]">
                <span className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-ink text-white text-lg font-body font-bold flex items-center justify-center shrink-0">
                  {m.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-body font-bold text-ink truncate">{m.name}</p>
                  <p className="text-[11.5px] font-body text-stone-400 truncate">{m.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-body font-bold uppercase tracking-wide ${meta.color}`}>{meta.label}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-ink/[0.05] border-b border-ink/[0.05]">
                <div className="py-4 text-center">
                  <p className="text-xl font-body font-bold text-ink tabular-nums">{m.listingCount}</p>
                  <p className="text-[9px] font-body font-bold uppercase tracking-[0.12em] text-stone-400 mt-0.5">Listings</p>
                </div>
                <div className="py-4 text-center">
                  <p className="text-xl font-body font-bold text-ink tabular-nums">{m.leadCount}</p>
                  <p className="text-[9px] font-body font-bold uppercase tracking-[0.12em] text-stone-400 mt-0.5">Leads</p>
                </div>
                <div className="py-4 text-center">
                  <p className="text-xl font-body font-bold text-slate tabular-nums">{Math.round((m.leadCount / Math.max(m.listingCount, 1)) * 10) / 10 || "—"}</p>
                  <p className="text-[9px] font-body font-bold uppercase tracking-[0.12em] text-stone-400 mt-0.5">Leads/Listing</p>
                </div>
              </div>

              {/* Info */}
              <div className="px-5 py-4 space-y-1.5">
                <p className="text-[12.5px] font-body text-graphite">
                  <span className="text-stone-400">Specialty:</span> {m.specialty || "—"}
                </p>
                <p className="text-[12.5px] font-body text-graphite">
                  <span className="text-stone-400">Phone:</span> {m.phone || "—"}
                </p>
              </div>

              {/* Actions */}
              {canManage && (
                <div className="px-5 pb-5 flex gap-2">
                  <button
                    onClick={() => setModal({ mode: "edit", member: m })}
                    className="flex-1 py-2 px-3 border border-ink/[0.1] text-[12px] font-body font-semibold text-graphite rounded-lg hover:border-brass hover:text-brass transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} /> Edit Details
                  </button>
                  {m.role !== "super_admin" && (
                    <select
                      value={m.role}
                      onChange={(e) => updateRole(m.id, e.target.value)}
                      className="px-3 py-2 bg-linen border border-ink/[0.1] rounded-lg text-[12px] font-body text-graphite focus:outline-none focus:border-brass cursor-pointer"
                    >
                      <option value="agent">Agent</option>
                      <option value="sales_manager">Manager</option>
                    </select>
                  )}
                </div>
              )}
              {m.role === "super_admin" && (
                <div className="px-5 pb-5 flex items-center gap-2 text-[11px] font-body font-semibold text-brass">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.8} /> Full access — protected account
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit member modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-2xl h-[90vh] bg-white flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08] shrink-0">
                <h3 className="text-[15px] font-body font-bold text-ink flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-brass" strokeWidth={1.8} /> 
                  {modal.mode === "add" ? "Add Team Member" : `Edit — ${modal.member.name}`}
                </h3>
                <button onClick={() => setModal(null)} aria-label="Close" className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors">
                  <X className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>

              <form onSubmit={saveForm} className="flex-1 overflow-y-auto px-6 py-5 space-y-5" id="agent-form">
                {/* Basic Info */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Basic Information</p>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Full name *</label>
                      <input 
                        name="name" 
                        required 
                        defaultValue={modal.mode === "edit" ? modal.member.name : ""}
                        className={inputCls} 
                        placeholder="e.g. Sara Haile" 
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input 
                        name="email" 
                        type="email" 
                        required 
                        defaultValue={modal.mode === "edit" ? modal.member.email : ""}
                        className={inputCls} 
                        placeholder="name@mekiya.com" 
                      />
                    </div>
                    {modal.mode === "add" && (
                      <div>
                        <label className={labelCls}>Temporary password *</label>
                        <input name="password" type="password" required minLength={6} className={inputCls} placeholder="Min. 6 characters" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Role</label>
                        <select 
                          name="role" 
                          defaultValue={modal.mode === "edit" ? modal.member.role : "agent"}
                          className={inputCls}
                        >
                          <option value="agent">Agent</option>
                          <option value="sales_manager">Sales Manager</option>
                          {modal.mode === "edit" && modal.member.role === "super_admin" && (
                            <option value="super_admin">Super Admin</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Phone</label>
                        <input 
                          name="phone" 
                          defaultValue={modal.mode === "edit" ? (modal.member.phone ?? "") : ""}
                          className={inputCls} 
                          placeholder="+251…" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Professional Details</p>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Specialty</label>
                      <input 
                        name="specialty" 
                        defaultValue={modal.mode === "edit" ? (modal.member.specialty ?? "") : ""}
                        className={inputCls} 
                        placeholder="e.g. Commercial Properties, Luxury Apartments" 
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Bio</label>
                      <textarea 
                        name="bio" 
                        rows={4} 
                        defaultValue={modal.mode === "edit" ? (modal.member.bio ?? "") : ""}
                        className={`${inputCls} resize-none`} 
                        placeholder="Tell us about this agent's experience and expertise..." 
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <p className="text-[11px] font-body font-bold uppercase tracking-[0.16em] text-brass mb-3">Profile Photo</p>
                  <ImageUploader
                    existingImages={uploadedAvatar}
                    onImagesChange={(images) => setUploadedAvatar(images.slice(0, 1))}
                  />
                  <p className="text-[11px] font-body text-stone-400 mt-2">Upload one profile photo (square format recommended)</p>
                </div>

                {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-[12.5px] font-body rounded-lg">{error}</div>}
              </form>

              <div className="px-6 py-4 border-t border-ink/[0.08] flex gap-3 shrink-0">
                <button type="submit" form="agent-form" disabled={saving}
                  className="flex-1 py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors disabled:opacity-60">
                  {saving ? "Saving…" : modal.mode === "add" ? "Create Account" : "Save Changes"}
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
