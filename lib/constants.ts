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
