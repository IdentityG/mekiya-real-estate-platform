"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchCriteria {
  q?: string;
  propertyTypes?: string[];
  listingType?: "sale" | "rent";
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  neighborhoods?: string[];
  amenities?: string[];
  furnished?: boolean;
  verified?: boolean;
}

interface Props {
  criteria: SearchCriteria;
  resultCount: number;
}

export function SaveSearchButton({ criteria, resultCount }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<"instant" | "daily" | "weekly">("daily");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!session) {
      router.push("/login?redirect=/properties");
      return;
    }

    if (!searchName.trim()) {
      setError("Please enter a name for this search");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: searchName.trim(),
          searchCriteria: criteria,
          emailAlerts,
          alertFrequency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save search");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setSearchName("");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are active filters
  const hasActiveFilters =
    criteria.q ||
    (criteria.propertyTypes && criteria.propertyTypes.length > 0) ||
    criteria.listingType ||
    criteria.minPrice ||
    criteria.maxPrice ||
    criteria.minSize ||
    criteria.maxSize ||
    criteria.bedrooms ||
    criteria.bathrooms ||
    (criteria.neighborhoods && criteria.neighborhoods.length > 0) ||
    (criteria.amenities && criteria.amenities.length > 0) ||
    criteria.furnished ||
    criteria.verified;

  if (!hasActiveFilters) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-ink/[0.12] text-ink text-sm font-body font-medium hover:border-brass hover:text-brass transition-colors rounded-full"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        Save this search
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-linen border border-ink/[0.08] shadow-2xl"
            >
              <div className="p-6 border-b border-ink/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-2xl text-ink">
                    Save this search
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center hover:border-brass hover:text-brass transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm font-body text-graphite/70">
                  {resultCount} properties match your criteria
                </p>
              </div>

              <div className="p-6 space-y-5">
                {success ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="font-display text-xl text-ink mb-2">
                      Search saved!
                    </p>
                    <p className="text-sm font-body text-graphite/70">
                      You'll be notified when new properties match
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-stone-400 mb-2">
                        Search name
                      </label>
                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="e.g., 3BR apartments in Bole"
                        className="w-full px-4 py-3 bg-cream border border-ink/[0.08] text-sm font-body focus:outline-none focus:border-brass"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-body font-medium text-ink">
                            Email alerts
                          </p>
                          <p className="text-xs font-body text-graphite/60">
                            Get notified about new matches
                          </p>
                        </div>
                        <button
                          onClick={() => setEmailAlerts(!emailAlerts)}
                          className="relative"
                        >
                          <span
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              emailAlerts ? "bg-brass" : "bg-ink/15"
                            }`}
                          >
                            <span
                              className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${
                                emailAlerts ? "left-[25px]" : "left-[3px]"
                              }`}
                            />
                          </span>
                        </button>
                      </div>

                      {emailAlerts && (
                        <div>
                          <label className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-stone-400 mb-2">
                            Frequency
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["instant", "daily", "weekly"] as const).map(
                              (freq) => (
                                <button
                                  key={freq}
                                  onClick={() => setAlertFrequency(freq)}
                                  className={`py-2.5 text-xs font-body font-semibold uppercase tracking-wider border transition-colors ${
                                    alertFrequency === freq
                                      ? "bg-ink text-white border-ink"
                                      : "border-ink/[0.12] text-graphite/60 hover:border-ink/30"
                                  }`}
                                >
                                  {freq}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-body">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-3.5 bg-ink text-white font-body font-bold text-sm uppercase tracking-[0.1em] hover:bg-graphite transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save search"}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
