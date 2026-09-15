"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface SavedSearch {
  id: number;
  name: string;
  searchCriteria: any;
  emailAlerts: boolean;
  alertFrequency: "instant" | "daily" | "weekly";
  lastAlertSent: string | null;
  createdAt: string;
  updatedAt: string;
}

export function SavedSearchesClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/my-searches");
      return;
    }

    if (status === "authenticated") {
      loadSearches();
    }
  }, [status, router]);

  const loadSearches = async () => {
    try {
      const response = await fetch("/api/saved-searches");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load searches");
      }

      setSearches(data.searches);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this saved search?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/saved-searches?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete search");
      }

      setSearches(searches.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAlerts = async (search: SavedSearch) => {
    try {
      const response = await fetch("/api/saved-searches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: search.id,
          emailAlerts: !search.emailAlerts,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update search");
      }

      setSearches(
        searches.map((s) =>
          s.id === search.id ? { ...s, emailAlerts: !s.emailAlerts } : s
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const buildSearchUrl = (criteria: any): string => {
    const params = new URLSearchParams();

    if (criteria.q) params.set("q", criteria.q);
    if (criteria.propertyTypes?.length)
      params.set("type", criteria.propertyTypes.join(","));
    if (criteria.listingType) params.set("listing", criteria.listingType);
    if (criteria.minPrice) params.set("minPrice", criteria.minPrice.toString());
    if (criteria.maxPrice) params.set("maxPrice", criteria.maxPrice.toString());
    if (criteria.minSize) params.set("minSize", criteria.minSize.toString());
    if (criteria.maxSize) params.set("maxSize", criteria.maxSize.toString());
    if (criteria.bedrooms)
      params.set("bedrooms", criteria.bedrooms.toString());
    if (criteria.bathrooms)
      params.set("bathrooms", criteria.bathrooms.toString());
    if (criteria.neighborhoods?.length)
      params.set("neighborhood", criteria.neighborhoods.join(","));
    if (criteria.amenities?.length)
      params.set("amenities", criteria.amenities.join(","));
    if (criteria.furnished) params.set("furnished", "true");
    if (criteria.verified) params.set("verified", "true");

    return `/properties?${params.toString()}`;
  };

  const formatCriteria = (criteria: any): string => {
    const parts: string[] = [];

    if (criteria.propertyTypes?.length) {
      parts.push(
        criteria.propertyTypes
          .map((t: string) => t.charAt(0).toUpperCase() + t.slice(1))
          .join(", ")
      );
    }

    if (criteria.listingType) {
      parts.push(`For ${criteria.listingType}`);
    }

    if (criteria.bedrooms) {
      parts.push(`${criteria.bedrooms}+ beds`);
    }

    if (criteria.minPrice || criteria.maxPrice) {
      const min = criteria.minPrice
        ? `${criteria.minPrice.toLocaleString()} ETB`
        : "";
      const max = criteria.maxPrice
        ? `${criteria.maxPrice.toLocaleString()} ETB`
        : "";
      if (min && max) parts.push(`${min} - ${max}`);
      else if (min) parts.push(`From ${min}`);
      else if (max) parts.push(`Up to ${max}`);
    }

    if (criteria.neighborhoods?.length) {
      parts.push(criteria.neighborhoods.slice(0, 2).join(", "));
      if (criteria.neighborhoods.length > 2) {
        parts[parts.length - 1] += ` +${criteria.neighborhoods.length - 2}`;
      }
    }

    return parts.join(" • ") || "All properties";
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-cream border border-ink/[0.06] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-cream border border-ink/[0.06]">
        <p className="text-red-600 font-body">{error}</p>
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-16 bg-cream border border-ink/[0.06]">
        <svg
          className="w-16 h-16 mx-auto mb-5 text-stone-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h3 className="font-display text-2xl text-ink mb-2">
          No saved searches yet
        </h3>
        <p className="text-stone-400 font-body text-sm mb-8 max-w-md mx-auto">
          Start searching for properties and save your search to get notified
          when new matches are available
        </p>
        <Link
          href="/properties"
          className="inline-block px-6 py-3 bg-ink text-white text-sm font-body font-semibold rounded-full hover:bg-graphite transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map((search, index) => (
        <motion.div
          key={search.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-cream border border-ink/[0.06] p-6 hover:border-brass/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-display text-xl text-ink mb-2">
                {search.name}
              </h3>
              <p className="text-sm font-body text-graphite/70">
                {formatCriteria(search.searchCriteria)}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Link
                href={buildSearchUrl(search.searchCriteria)}
                className="p-2.5 border border-ink/[0.12] hover:border-brass hover:text-brass transition-colors"
                title="View results"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>

              <button
                onClick={() => handleDelete(search.id)}
                disabled={deletingId === search.id}
                className="p-2.5 border border-ink/[0.12] hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete search"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ink/[0.06]">
            <div className="flex items-center gap-4 text-xs font-body text-graphite/60">
              <span>
                Created {new Date(search.createdAt).toLocaleDateString()}
              </span>
              {search.lastAlertSent && (
                <span>
                  Last alert{" "}
                  {new Date(search.lastAlertSent).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-body text-graphite/70">
                  Email alerts {search.emailAlerts && `(${search.alertFrequency})`}
                </span>
                <button
                  onClick={() => toggleAlerts(search)}
                  className="relative"
                >
                  <span
                    className={`w-10 h-5.5 h-[22px] rounded-full relative transition-colors ${
                      search.emailAlerts ? "bg-brass" : "bg-ink/15"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${
                        search.emailAlerts ? "left-[21px]" : "left-[3px]"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
