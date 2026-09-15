"use client";

import { useState, useMemo } from "react";
import { PropertyMap } from "./PropertyMap";
import { Search, SlidersHorizontal, X, MapPin, List } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { NEIGHBORHOOD_COORDS } from "@/lib/maps";

interface Property {
  id: number;
  title: string;
  slug: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  propertyType: string;
  listingType: string;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  featured: boolean | null;
  media: string[];
}

interface PropertiesMapClientProps {
  properties: Property[];
}

export function PropertiesMapClient({ properties }: PropertiesMapClientProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "split">("split");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPropertyType, setFilterPropertyType] = useState<string>("all");
  const [filterListingType, setFilterListingType] = useState<string>("all");
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>("all");
  const [filterPriceMin, setFilterPriceMin] = useState<string>("");
  const [filterPriceMax, setFilterPriceMax] = useState<string>("");
  const [filterBedrooms, setFilterBedrooms] = useState<string>("all");

  // Filter properties
  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.neighborhood?.toLowerCase().includes(query)
      );
    }

    // Property type
    if (filterPropertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType === filterPropertyType);
    }

    // Listing type
    if (filterListingType !== "all") {
      filtered = filtered.filter((p) => p.listingType === filterListingType);
    }

    // Neighborhood
    if (filterNeighborhood !== "all") {
      filtered = filtered.filter((p) => p.neighborhood === filterNeighborhood);
    }

    // Price range
    if (filterPriceMin) {
      filtered = filtered.filter((p) => p.price >= parseInt(filterPriceMin));
    }
    if (filterPriceMax) {
      filtered = filtered.filter((p) => p.price <= parseInt(filterPriceMax));
    }

    // Bedrooms
    if (filterBedrooms !== "all") {
      filtered = filtered.filter((p) => p.bedrooms === parseInt(filterBedrooms));
    }

    return filtered;
  }, [
    properties,
    searchQuery,
    filterPropertyType,
    filterListingType,
    filterNeighborhood,
    filterPriceMin,
    filterPriceMax,
    filterBedrooms,
  ]);

  // Get unique neighborhoods
  const neighborhoods = useMemo(() => {
    const unique = new Set(
      properties.map((p) => p.neighborhood).filter(Boolean) as string[]
    );
    return Array.from(unique).sort();
  }, [properties]);

  // Get center based on selected neighborhood
  const mapCenter = useMemo((): [number, number] | undefined => {
    if (filterNeighborhood !== "all" && filterNeighborhood in NEIGHBORHOOD_COORDS) {
      return NEIGHBORHOOD_COORDS[filterNeighborhood];
    }
    return undefined;
  }, [filterNeighborhood]);

  const selectedProperty = selectedPropertyId
    ? filteredProperties.find((p) => p.id === selectedPropertyId)
    : null;

  return (
    <div className="bg-linen min-h-screen">
      {/* Header */}
      <div className="bg-ink pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-white text-3xl tracking-tight">
                Property Map
              </h1>
              <p className="text-white/60 font-body text-sm mt-1">
                {filteredProperties.length} properties in Addis Ababa
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "map" ? "split" : "map")}
                className={`px-4 py-2 font-body text-sm font-semibold uppercase tracking-wider transition-colors ${
                  viewMode === "split"
                    ? "bg-brass text-ink"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  {viewMode === "split" ? <List className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  {viewMode === "split" ? "List" : "Map Only"}
                </span>
              </button>

              <Link
                href="/properties"
                className="px-4 py-2 border border-white/20 text-white font-body text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Grid View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b border-ink/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by title or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-wider transition-colors ${
                showFilters
                  ? "bg-brass text-ink"
                  : "border border-ink/10 text-ink hover:border-brass"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-ink/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <select
                value={filterPropertyType}
                onChange={(e) => setFilterPropertyType(e.target.value)}
                className="px-3 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
              </select>

              <select
                value={filterListingType}
                onChange={(e) => setFilterListingType(e.target.value)}
                className="px-3 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              >
                <option value="all">Sale & Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>

              <select
                value={filterNeighborhood}
                onChange={(e) => setFilterNeighborhood(e.target.value)}
                className="px-3 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              >
                <option value="all">All Neighborhoods</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                className="px-3 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                className="px-3 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              />

              <select
                value={filterBedrooms}
                onChange={(e) => setFilterBedrooms(e.target.value)}
                className="px-3 py-2 border border-ink/10 text-sm font-body focus:outline-none focus:border-brass"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4+ Beds</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Map & List Layout */}
      <div className={`grid ${viewMode === "split" ? "lg:grid-cols-2" : "grid-cols-1"} h-[calc(100vh-250px)]`}>
        {/* Map */}
        <div className={viewMode === "map" ? "col-span-full" : ""}>
          <PropertyMap
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            onPropertySelect={setSelectedPropertyId}
            center={mapCenter}
            height="100%"
          />
        </div>

        {/* Property List (Split view only) */}
        {viewMode === "split" && (
          <div className="overflow-y-auto bg-white border-l border-ink/10 p-6">
            {filteredProperties.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="font-body text-stone-400">No properties found</p>
                  <p className="text-xs text-stone-400 mt-1">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => setSelectedPropertyId(property.id)}
                    className={`w-full text-left border p-4 transition-colors ${
                      selectedPropertyId === property.id
                        ? "border-brass bg-brass/5"
                        : "border-ink/10 hover:border-brass/50"
                    }`}
                  >
                    <div className="flex gap-4">
                      {property.media && property.media.length > 0 && (
                        <img
                          src={property.media[0]}
                          alt={property.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-body font-semibold text-ink text-sm mb-1 truncate">
                          {property.title}
                        </h3>
                        <p className="font-display text-brass text-lg">
                          {formatPrice(property.price, property.currency)}
                        </p>
                        <div className="flex items-center gap-3 text-stone-400 text-xs mt-2">
                          {property.bedrooms && <span>{property.bedrooms} beds</span>}
                          {property.bathrooms && <span>• {property.bathrooms} baths</span>}
                          {property.size && <span>• {property.size} m²</span>}
                        </div>
                        {property.neighborhood && (
                          <p className="text-stone-400 text-xs mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.neighborhood}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
