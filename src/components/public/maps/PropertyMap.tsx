"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import { DEFAULT_CENTER, DEFAULT_ZOOM, createPropertyMarker, ADDIS_BOUNDS } from "@/lib/maps";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Eye, Bed, Bath, Maximize } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface Property {
  id: number;
  title: string;
  slug: string;
  price: number;
  currency: string;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  propertyType: string;
  featured: boolean | null;
  media: string[];
}

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: number | null;
  onPropertySelect?: (propertyId: number) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showRadius?: boolean;
  radiusKm?: number;
}

// Component to handle map bounds and centering
function MapController({ 
  properties, 
  selectedPropertyId,
  center,
  zoom 
}: { 
  properties: Property[]; 
  selectedPropertyId?: number | null;
  center?: [number, number];
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPropertyId) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      if (property?.lat && property?.lng) {
        map.flyTo([property.lat, property.lng], 15, { duration: 0.5 });
      }
    } else if (center) {
      map.setView(center, zoom || DEFAULT_ZOOM);
    } else {
      // Fit bounds to show all properties
      const validCoords = properties
        .filter((p) => p.lat && p.lng)
        .map((p) => [p.lat!, p.lng!] as L.LatLngExpression);

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [map, properties, selectedPropertyId, center, zoom]);

  return null;
}

export function PropertyMap({
  properties,
  selectedPropertyId,
  onPropertySelect,
  center,
  zoom,
  height = "600px",
  showRadius = false,
  radiusKm = 2,
}: PropertyMapProps) {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Only render on client side to avoid SSR issues with Leaflet
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="bg-cream border border-ink/10 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-stone-400 font-body text-sm">Loading map...</p>
      </div>
    );
  }

  // Filter properties with valid coordinates
  const mappableProperties = properties.filter((p) => p.lat && p.lng);

  if (mappableProperties.length === 0) {
    return (
      <div 
        className="bg-cream border border-ink/10 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-stone-400 font-body text-sm">No properties with location data</p>
          <p className="text-stone-400 font-body text-xs mt-1">
            Properties will appear here once coordinates are added
          </p>
        </div>
      </div>
    );
  }

  const mapCenter = center || DEFAULT_CENTER;
  const mapZoom = zoom || DEFAULT_ZOOM;

  return (
    <div style={{ height }} className="relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        maxBounds={ADDIS_BOUNDS}
        maxBoundsViscosity={0.5}
        ref={mapRef}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Controller */}
        <MapController 
          properties={mappableProperties}
          selectedPropertyId={selectedPropertyId}
          center={center}
          zoom={zoom}
        />

        {/* Radius Circle (if enabled) */}
        {showRadius && center && (
          <Circle
            center={center}
            radius={radiusKm * 1000} // Convert km to meters
            pathOptions={{
              color: "#C4A96B",
              fillColor: "#C4A96B",
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

        {/* Property Markers */}
        {mappableProperties.map((property) => {
          const isSelected = selectedPropertyId === property.id;
          
          const customMarker = createPropertyMarker({
            price: property.price,
            propertyType: property.propertyType,
            isFeatured: property.featured || false,
            isSelected,
          });

          return (
            <Marker
              key={property.id}
              position={[property.lat!, property.lng!]}
              icon={customMarker}
              eventHandlers={{
                click: () => {
                  if (onPropertySelect) {
                    onPropertySelect(property.id);
                  }
                },
              }}
            >
              <Popup className="property-popup" maxWidth={300}>
                <Link 
                  href={`/properties/${property.slug}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  {/* Property Image */}
                  {property.media && property.media.length > 0 && (
                    <div className="relative w-full h-40 mb-3 overflow-hidden rounded">
                      <img
                        src={property.media[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      {property.featured && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-brass text-ink text-[10px] font-body font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                  )}

                  {/* Property Info */}
                  <div className="space-y-2">
                    <h3 className="font-display text-ink text-lg leading-tight">
                      {property.title}
                    </h3>
                    
                    <p className="font-display text-brass text-xl">
                      {formatPrice(property.price, property.currency)}
                    </p>

                    {/* Property Stats */}
                    <div className="flex items-center gap-3 text-stone-400 text-xs font-body">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />
                          {property.bathrooms}
                        </span>
                      )}
                      {property.size && (
                        <span className="flex items-center gap-1">
                          <Maximize className="w-3 h-3" />
                          {property.size} m²
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-ink/5">
                      <span className="text-slate text-xs font-body font-semibold flex items-center gap-1">
                        View Details
                        <span className="text-brass">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white border border-ink/10 p-3 shadow-lg rounded">
        <p className="text-[10px] font-body font-bold uppercase tracking-wider text-stone-400 mb-2">
          Legend
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brass" />
            <span className="text-xs font-body text-graphite">Featured</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ink" />
            <span className="text-xs font-body text-graphite">Apartment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate" />
            <span className="text-xs font-body text-graphite">Commercial</span>
          </div>
        </div>
        <p className="text-[9px] font-body text-stone-400 mt-2">
          {mappableProperties.length} properties shown
        </p>
      </div>
    </div>
  );
}
