import L from "leaflet";

/**
 * Map Configuration for Mekiya Real Estate
 * Focused on Addis Ababa, Ethiopia
 */

// Default center: Addis Ababa city center
export const DEFAULT_CENTER: [number, number] = [9.0320, 38.7469];
export const DEFAULT_ZOOM = 12;

// Bounds for Addis Ababa
export const ADDIS_BOUNDS: L.LatLngBoundsExpression = [
  [8.8, 38.6], // Southwest
  [9.2, 38.9], // Northeast
];

// Raw bounds for calculations
const ADDIS_BOUNDS_RAW: [[number, number], [number, number]] = [
  [8.8, 38.6], // Southwest
  [9.2, 38.9], // Northeast
];

// Neighborhood coordinates (approximate centers)
export const NEIGHBORHOOD_COORDS: Record<string, [number, number]> = {
  Bole: [8.9945, 38.7835],
  "Old Airport": [9.0011, 38.7967],
  Sarbet: [9.0156, 38.7523],
  CMC: [9.0087, 38.7234],
  Gerji: [9.0456, 38.8123],
  Kazanchis: [9.0245, 38.7678],
  Megenagna: [9.0178, 38.7789],
  "Arat Kilo": [9.0334, 38.7612],
  Piassa: [9.0389, 38.7556],
  Merkato: [9.0345, 38.7234],
  "Addis Ketema": [9.0456, 38.7345],
  Kolfe: [8.9789, 38.7123],
  Kirkos: [9.0012, 38.7567],
  Lideta: [9.0256, 38.7423],
  Arada: [9.0389, 38.7489],
  "Yeka": [9.0567, 38.8012],
  "Nifas Silk": [8.9678, 38.7456],
  Akaki: [8.8756, 38.7678],
  "Gulele": [9.0678, 38.7234],
  "Lemi Kura": [9.0456, 38.8234],
};

// Custom marker icons
export const createPropertyMarker = (options: {
  price: number;
  propertyType: string;
  isFeatured?: boolean;
  isSelected?: boolean;
}) => {
  const { price, propertyType, isFeatured, isSelected } = options;
  
  const priceText = price >= 1000000 
    ? `${(price / 1000000).toFixed(1)}M` 
    : `${(price / 1000).toFixed(0)}K`;

  const backgroundColor = isFeatured 
    ? "#C4A96B" // brass
    : propertyType === "commercial" 
    ? "#2C6C8F" // slate
    : "#0B0D12"; // ink

  const borderColor = isSelected ? "#C4A96B" : "white";
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: "custom-property-marker",
    html: `
      <div style="
        position: relative;
        width: 80px;
        text-align: center;
      ">
        <div style="
          background: ${backgroundColor};
          color: white;
          padding: 6px 10px;
          border-radius: 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          border: ${borderWidth}px solid ${borderColor};
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          white-space: nowrap;
        ">
          ${priceText} ETB
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid ${backgroundColor};
          margin: 0 auto;
          margin-top: -2px;
        "></div>
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 40],
  });
};

// Cluster marker
export const createClusterMarker = (count: number) => {
  const size = count < 10 ? 40 : count < 50 ? 50 : 60;
  
  return L.divIcon({
    className: "custom-cluster-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(196, 169, 107, 0.8);
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Space Grotesk', sans-serif;
        font-size: ${size > 50 ? '16px' : '14px'};
        font-weight: 700;
        color: #0B0D12;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Get properties within radius
export function getPropertiesInRadius(
  properties: Array<{ lat: number | null; lng: number | null; id: number }>,
  centerLat: number,
  centerLng: number,
  radiusKm: number
) {
  return properties.filter((property) => {
    if (!property.lat || !property.lng) return false;
    const distance = calculateDistance(
      centerLat,
      centerLng,
      property.lat,
      property.lng
    );
    return distance <= radiusKm;
  });
}

// Get bounds for an array of coordinates
export function getBoundsForProperties(
  properties: Array<{ lat: number | null; lng: number | null }>
): L.LatLngBoundsExpression | null {
  const validCoords = properties
    .filter((p) => p.lat && p.lng)
    .map((p) => [p.lat!, p.lng!] as [number, number]);

  if (validCoords.length === 0) return null;

  return validCoords;
}

// Geocode address to coordinates (simplified - would normally use API)
export function geocodeAddress(address: string): [number, number] | null {
  // Simple neighborhood matching
  const addressLower = address.toLowerCase();
  
  for (const [neighborhood, coords] of Object.entries(NEIGHBORHOOD_COORDS)) {
    if (addressLower.includes(neighborhood.toLowerCase())) {
      return coords;
    }
  }
  
  // Default to Addis Ababa center if no match
  return DEFAULT_CENTER;
}

// Format coordinates for display
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// Check if coordinates are within Addis Ababa bounds
export function isWithinAddis(lat: number, lng: number): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = ADDIS_BOUNDS_RAW;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}
