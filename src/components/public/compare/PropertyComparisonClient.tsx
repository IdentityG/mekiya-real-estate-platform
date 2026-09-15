"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Property {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  listingType: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  address: string | null;
  neighborhood: string | null;
  amenities: string[] | null;
  yearBuilt: number | null;
  furnished: boolean | null;
  verified: boolean | null;
  media: string[] | null;
  description: string | null;
}

const COMPARISON_FEATURES = [
  { key: "price", label: "Price", format: (v: any, p: Property) => `${p.currency} ${v?.toLocaleString() || "N/A"}` },
  { key: "propertyType", label: "Property Type", format: (v: any) => v ? v.charAt(0).toUpperCase() + v.slice(1) : "N/A" },
  { key: "listingType", label: "Listing Type", format: (v: any) => v ? `For ${v.charAt(0).toUpperCase() + v.slice(1)}` : "N/A" },
  { key: "bedrooms", label: "Bedrooms", format: (v: any) => v ? `${v} bed${v > 1 ? 's' : ''}` : "N/A" },
  { key: "bathrooms", label: "Bathrooms", format: (v: any) => v ? `${v} bath${v > 1 ? 's' : ''}` : "N/A" },
  { key: "size", label: "Size", format: (v: any) => v ? `${v.toLocaleString()} m²` : "N/A" },
  { key: "neighborhood", label: "Neighborhood", format: (v: any) => v || "N/A" },
  { key: "address", label: "Address", format: (v: any) => v || "N/A" },
  { key: "yearBuilt", label: "Year Built", format: (v: any) => v || "N/A" },
  { key: "furnished", label: "Furnished", format: (v: any) => v ? "Yes" : "No" },
  { key: "verified", label: "Verified", format: (v: any) => v ? "✓ Verified" : "Unverified" },
];

export function PropertyComparisonClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (!ids) {
      setLoading(false);
      return;
    }

    const propertyIds = ids.split(",").map(Number).filter(Boolean);
    if (propertyIds.length === 0) {
      setLoading(false);
      return;
    }

    loadProperties(propertyIds);
  }, [searchParams]);

  const loadProperties = async (propertyIds: number[]) => {
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load properties");
      }

      setProperties(data.properties);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (propertyId: number) => {
    const remaining = properties.filter(p => p.id !== propertyId);
    setProperties(remaining);
    
    // Update URL
    if (remaining.length > 0) {
      const ids = remaining.map(p => p.id).join(",");
      router.replace(`/compare?ids=${ids}`, { scroll: false });
    } else {
      router.replace("/compare", { scroll: false });
    }
  };

  const getHighlightClass = (key: string, value: any, allValues: any[]) => {
    if (key === "price" && typeof value === "number") {
      const prices = allValues.filter(v => typeof v === "number");
      const minPrice = Math.min(...prices);
      return value === minPrice ? "bg-green-50 border-green-200" : "";
    }
    if (key === "size" && typeof value === "number") {
      const sizes = allValues.filter(v => typeof v === "number");
      const maxSize = Math.max(...sizes);
      return value === maxSize ? "bg-green-50 border-green-200" : "";
    }
    if (key === "verified" && value === true) {
      return "bg-blue-50 border-blue-200";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-96 bg-cream border border-ink/[0.06] animate-pulse"
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

  if (properties.length === 0) {
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 className="font-display text-2xl text-ink mb-2">
          No properties selected
        </h3>
        <p className="text-stone-400 font-body text-sm mb-8 max-w-md mx-auto">
          Browse properties and add them to comparison to see them side-by-side
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
    <div className="space-y-8">
      {/* Info banner */}
      <div className="bg-brass/10 border border-brass/20 p-4 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-brass shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-body text-graphite">
            <strong className="font-semibold">Tip:</strong> Best values are
            highlighted in green. You can compare up to 3 properties at once.
          </p>
        </div>
      </div>

      {/* Desktop: Side-by-side comparison */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ink text-white">
              <th className="p-4 text-left font-display text-lg sticky left-0 bg-ink z-10">
                Feature
              </th>
              {properties.map((property, idx) => (
                <th
                  key={property.id}
                  className="p-4 text-left font-display text-lg min-w-[300px]"
                >
                  <div className="space-y-3">
                    {property.media && property.media[0] ? (
                      <div className="relative h-48 bg-graphite">
                        <Image
                          src={property.media[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-graphite flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/properties/${property.slug}`}
                        className="hover:text-brass transition-colors"
                      >
                        {property.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeProperty(property.id)}
                      className="text-xs font-body text-white/70 hover:text-white underline"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FEATURES.map((feature, idx) => {
              const values = properties.map(p => (p as any)[feature.key]);
              return (
                <tr
                  key={feature.key}
                  className={idx % 2 === 0 ? "bg-cream" : "bg-white"}
                >
                  <td className="p-4 font-body font-semibold text-graphite sticky left-0 z-10 border-r border-ink/[0.06]" style={{ background: idx % 2 === 0 ? "#f8f6f3" : "#ffffff" }}>
                    {feature.label}
                  </td>
                  {properties.map((property, pIdx) => {
                    const value = (property as any)[feature.key];
                    const highlightClass = getHighlightClass(
                      feature.key,
                      value,
                      values
                    );
                    return (
                      <td
                        key={property.id}
                        className={`p-4 font-body text-graphite border ${highlightClass || "border-ink/[0.06]"}`}
                      >
                        {feature.format(value, property)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Amenities */}
            <tr className="bg-cream">
              <td className="p-4 font-body font-semibold text-graphite sticky left-0 bg-cream z-10 border-r border-ink/[0.06]">
                Amenities
              </td>
              {properties.map(property => (
                <td
                  key={property.id}
                  className="p-4 font-body text-graphite border border-ink/[0.06] align-top"
                >
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {property.amenities.map(amenity => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-white border border-ink/[0.1] text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-400">None listed</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr className="bg-white">
              <td className="p-4 font-body font-semibold text-graphite sticky left-0 bg-white z-10 border-r border-ink/[0.06]">
                Actions
              </td>
              {properties.map(property => (
                <td
                  key={property.id}
                  className="p-4 border border-ink/[0.06]"
                >
                  <Link
                    href={`/properties/${property.slug}`}
                    className="block w-full py-2.5 bg-ink text-white text-center text-sm font-body font-semibold hover:bg-graphite transition-colors"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: Stacked comparison */}
      <div className="lg:hidden space-y-6">
        {properties.map((property, idx) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-cream border border-ink/[0.06] overflow-hidden"
          >
            {property.media && property.media[0] ? (
              <div className="relative h-64 bg-graphite">
                <Image
                  src={property.media[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-64 bg-graphite flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-xl text-ink flex-1">
                  {property.title}
                </h3>
                <button
                  onClick={() => removeProperty(property.id)}
                  className="text-stone-400 hover:text-red-500 ml-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {COMPARISON_FEATURES.map(feature => (
                  <div
                    key={feature.key}
                    className="flex justify-between py-2 border-b border-ink/[0.06]"
                  >
                    <span className="font-body text-sm text-graphite/70">
                      {feature.label}
                    </span>
                    <span className="font-body text-sm text-ink font-medium">
                      {feature.format((property as any)[feature.key], property)}
                    </span>
                  </div>
                ))}

                {property.amenities && property.amenities.length > 0 && (
                  <div className="pt-3">
                    <p className="font-body text-sm text-graphite/70 mb-2">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {property.amenities.map(amenity => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-white border border-ink/[0.1] text-xs font-body rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/properties/${property.slug}`}
                className="block w-full py-3 bg-ink text-white text-center text-sm font-body font-semibold hover:bg-graphite transition-colors"
              >
                View Full Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
