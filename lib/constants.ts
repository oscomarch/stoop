/**
 * Stoop product constants. Single source of truth for trades, neighborhoods,
 * and copy strings used in multiple places. Keep this small and stable.
 */

export const BRAND = {
  name: "Stoop",
  tagline: "Ask your stoop.",
  pitch:
    "The neighborhood marketplace for home services. Built for Brooklyn brownstones, then everywhere.",
  email: "hello@stoop.app",
  twitter: "@stoopapp",
} as const;

export type TradeId =
  | "handyman"
  | "plumbing"
  | "electrical"
  | "painting"
  | "appliance_repair";

export const TRADES: ReadonlyArray<{
  id: TradeId;
  label: string;
  emoji: string;
  description: string;
  examples: string[];
}> = [
  {
    id: "handyman",
    label: "Handyman",
    emoji: "🔨",
    description: "Mounting, assembly, small repairs. The everyday stuff.",
    examples: ["TV mounting", "IKEA assembly", "Drilling", "Curtain rods"],
  },
  {
    id: "plumbing",
    label: "Plumbing",
    emoji: "🔧",
    description: "Leaks, clogs, fixtures, water heaters.",
    examples: ["Leaking faucet", "Toilet rebuild", "Clogged drain", "New fixture"],
  },
  {
    id: "electrical",
    label: "Electrical",
    emoji: "💡",
    description: "Outlets, fixtures, switches. Anything with a wire.",
    examples: ["New outlet", "Ceiling fan", "Smart switch", "Light fixture"],
  },
  {
    id: "painting",
    label: "Painting",
    emoji: "🎨",
    description: "Rooms, hallways, trim, prep work included.",
    examples: ["Bedroom repaint", "Trim & molding", "Patch & paint", "Cabinet refresh"],
  },
  {
    id: "appliance_repair",
    label: "Appliance Repair",
    emoji: "⚙️",
    description: "Dishwasher, washer/dryer, oven, fridge, AC.",
    examples: ["Dishwasher leak", "Dryer no heat", "Fridge not cooling", "AC service"],
  },
];

export const BROOKLYN_NEIGHBORHOODS = [
  "Park Slope",
  "Cobble Hill",
  "Carroll Gardens",
  "Boerum Hill",
  "Fort Greene",
  "Clinton Hill",
  "Bed-Stuy",
  "Crown Heights",
  "Prospect Heights",
  "Brooklyn Heights",
  "DUMBO",
  "Williamsburg",
  "Greenpoint",
  "Bushwick",
  "Sunset Park",
  "Windsor Terrace",
  "Kensington",
  "Ditmas Park",
  "Other Brooklyn",
  "Other NYC",
] as const;

export type Neighborhood = (typeof BROOKLYN_NEIGHBORHOODS)[number];

/**
 * Approximate centroid (lat/lng) for each neighborhood. Until we wire up Mapbox
 * geocoding + a draggable pin, we locate jobs and contractors at their
 * neighborhood center. This is intentionally coarse: it keeps exact addresses
 * private and is plenty accurate for radius matching in a dense beachhead.
 */
export const NEIGHBORHOOD_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  "Park Slope": { lat: 40.671, lng: -73.9814 },
  "Cobble Hill": { lat: 40.6862, lng: -73.996 },
  "Carroll Gardens": { lat: 40.6795, lng: -73.9991 },
  "Boerum Hill": { lat: 40.685, lng: -73.984 },
  "Fort Greene": { lat: 40.69, lng: -73.974 },
  "Clinton Hill": { lat: 40.6896, lng: -73.965 },
  "Bed-Stuy": { lat: 40.6872, lng: -73.9418 },
  "Crown Heights": { lat: 40.6694, lng: -73.9442 },
  "Prospect Heights": { lat: 40.677, lng: -73.968 },
  "Brooklyn Heights": { lat: 40.696, lng: -73.9933 },
  DUMBO: { lat: 40.7033, lng: -73.9881 },
  Williamsburg: { lat: 40.7081, lng: -73.9571 },
  Greenpoint: { lat: 40.7304, lng: -73.951 },
  Bushwick: { lat: 40.6944, lng: -73.9213 },
  "Sunset Park": { lat: 40.6453, lng: -74.0119 },
  "Windsor Terrace": { lat: 40.6555, lng: -73.979 },
  Kensington: { lat: 40.6418, lng: -73.973 },
  "Ditmas Park": { lat: 40.6395, lng: -73.9645 },
  "Other Brooklyn": { lat: 40.6782, lng: -73.9442 },
  "Other NYC": { lat: 40.7128, lng: -74.006 },
};

const DEFAULT_CENTROID = NEIGHBORHOOD_CENTROIDS["Other Brooklyn"];

/** Resolve a neighborhood name to a lat/lng, falling back to central Brooklyn. */
export function neighborhoodToLatLng(neighborhood: string | null | undefined): {
  lat: number;
  lng: number;
} {
  if (!neighborhood) return DEFAULT_CENTROID;
  return NEIGHBORHOOD_CENTROIDS[neighborhood] ?? DEFAULT_CENTROID;
}

/** Reverse of neighborhoodToLatLng: find the neighborhood at these coords. */
export function latLngToNeighborhood(
  lat: number | null | undefined,
  lng: number | null | undefined
): string | null {
  if (lat == null || lng == null) return null;
  for (const [name, c] of Object.entries(NEIGHBORHOOD_CENTROIDS)) {
    if (Math.abs(c.lat - lat) < 0.0005 && Math.abs(c.lng - lng) < 0.0005) {
      return name;
    }
  }
  return null;
}

export function tradeLabel(id: string): string {
  return TRADES.find((t) => t.id === id)?.label ?? id;
}
