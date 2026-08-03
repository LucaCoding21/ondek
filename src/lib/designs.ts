export type DesignTag = "best-seller" | "new" | "sold-out" | "coming-soon";

export type DesignFamily = "grey" | "silver" | "tan" | "brown";

export type Design = {
  name: string;
  slug: string;
  swatch: string;
  /** Deck scene photo — swap in when product shots are ready */
  scene?: string;
  /** Real membrane pattern tile, where one has been shot */
  tile?: string;
  /** Average colour of `tile`, sampled from the file */
  tileTone?: string;
  /** Fallback colour shown while imagery loads */
  tone: string;
  family: DesignFamily;
  tag?: DesignTag;
  /** One-liner shown on the active row of the homepage colour menu */
  blurb?: string;
};

export const DESIGN_TAG_LABELS: Record<DesignTag, string> = {
  "best-seller": "Best seller",
  new: "New!",
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
};

export const DESIGN_FAMILY_LABELS: Record<DesignFamily, string> = {
  grey: "Greys",
  silver: "Silvers",
  tan: "Tans",
  brown: "Browns",
};

/** Families that actually have designs, in first-appearance order */
export function familiesInUse(designs: Design[]): DesignFamily[] {
  return [...new Set(designs.map((d) => d.family))];
}

// PLACEHOLDER IMAGERY — every `scene` and `swatch` below points at Unsplash
// while we wait on the real product shots. These are stock decks and wood
// grain, not our membranes, so none of them show the actual colour or
// pattern they're labelled with. Swap them for files under
// /public/images/designs before this goes anywhere near production, and drop
// the `images.remotePatterns` block in next.config.ts at the same time.
const SCENE = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
const SWATCH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

/** Real pattern tile, shot from the membrane. Only where one exists. */
const TILE = (slug: string) => `/images/designs/${slug}.jpg`;

// The full range, in the order the colour cards should read.
export const DESIGNS: Design[] = [
  {
    name: "Speckled Stone Grey",
    slug: "speckled-stone-grey",
    blurb: "Cool mid-grey with a fine stone speckle through it.",
    swatch: SWATCH("1736506159893-22cca29b8018"),
    scene: SCENE("1656646549607-8fda5837a4ca"),
    tile: TILE("speckled-stone-grey"),
    tileTone: "#a1a09d",
    tone: "#8b8d90",
    family: "grey",
    tag: "best-seller",
  },
  {
    name: "Speckled Stone Silver",
    slug: "speckled-stone-silver",
    blurb: "Light silver that keeps decks bright and cool underfoot.",
    swatch: SWATCH("1644931551533-02906718127f"),
    scene: SCENE("1716904519810-349244919824"),
    tile: TILE("speckled-stone-silver"),
    tileTone: "#c6c6c6",
    tone: "#c0bdb6",
    family: "silver",
  },
  {
    name: "Speckled Stone Brown",
    slug: "speckled-stone-brown",
    blurb: "Deep earth brown, speckled to hide the everyday.",
    swatch: SWATCH("1501258480117-ddc2b0447dab"),
    scene: SCENE("1613544723371-23b514a78c85"),
    tile: TILE("speckled-stone-brown"),
    tileTone: "#b7a697",
    tone: "#7a6656",
    family: "brown",
  },
  {
    name: "Speckled Stone Tan",
    slug: "speckled-stone-tan",
    blurb: "Warm, sandy neutral that pairs beautifully with wood tones.",
    swatch: SWATCH("1644925757334-d0397c01518c"),
    scene: SCENE("1574120583586-de8847ae992c"),
    tile: TILE("speckled-stone-tan"),
    tileTone: "#ddd2c3",
    tone: "#b8a894",
    family: "tan",
  },
  {
    name: "Granite Grey",
    slug: "granite-grey",
    blurb: "Dense granite pattern in a true neutral grey.",
    swatch: SWATCH("1644931551533-02906718127f"),
    scene: SCENE("1656646549607-8fda5837a4ca"),
    tile: TILE("granite-grey"),
    tileTone: "#b7b2ae",
    tone: "#86888b",
    family: "grey",
  },
  {
    name: "Granite Silver",
    slug: "granite-silver",
    blurb: "The palest of the granites. Bright without going stark.",
    swatch: SWATCH("1736506159893-22cca29b8018"),
    scene: SCENE("1716904519810-349244919824"),
    tile: TILE("granite-silver"),
    tileTone: "#c4c2c3",
    tone: "#b9b7b2",
    family: "silver",
  },
  {
    name: "Granite Brown",
    slug: "granite-brown",
    blurb: "Rich, grounded brown for decks that sit under trees.",
    swatch: SWATCH("1501258480117-ddc2b0447dab"),
    scene: SCENE("1613544723371-23b514a78c85"),
    tile: TILE("granite-brown"),
    tileTone: "#a79b8e",
    tone: "#6f5c4c",
    family: "brown",
  },
  {
    name: "Granite Tan",
    slug: "granite-tan",
    blurb: "Golden tan granite. The warmest colour in the range.",
    swatch: SWATCH("1644925757334-d0397c01518c"),
    scene: SCENE("1574120583586-de8847ae992c"),
    tile: TILE("granite-tan"),
    tileTone: "#d7d0ca",
    tone: "#b3a389",
    family: "tan",
  },
  {
    name: "Urban Mist",
    slug: "urban-mist",
    blurb: "Soft concrete grey. Clean, modern, goes with everything.",
    swatch: SWATCH("1644925757334-d0397c01518c"),
    scene: SCENE("1656646549607-8fda5837a4ca"),
    tile: TILE("urban-mist"),
    tileTone: "#b4ada8",
    tone: "#9a958c",
    family: "grey",
    tag: "new",
  },
  // No tile shot for either of these yet
  {
    name: "Driftwood",
    slug: "driftwood",
    blurb: "Weathered timber look, greyed off by sun and salt.",
    swatch: SWATCH("1736506159893-22cca29b8018"),
    scene: SCENE("1716904519810-349244919824"),
    tone: "#a39c92",
    family: "grey",
    tag: "coming-soon",
  },
  {
    name: "Dekplank Brown",
    slug: "dekplank-brown",
    blurb: "Wide plank grain in a classic stained-timber brown.",
    swatch: SWATCH("1501258480117-ddc2b0447dab"),
    scene: SCENE("1574120583586-de8847ae992c"),
    tone: "#6b5443",
    family: "brown",
    tag: "coming-soon",
  },
];

/** Top picks surfaced on the homepage — order matters */
export const FEATURED_DESIGNS = DESIGNS.slice(0, 4);
