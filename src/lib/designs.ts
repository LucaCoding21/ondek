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

// Swatches are the real membrane shots (supplied by the owners) under
// /public/images/designs/swatches. Every `tone` is sampled from its file.
// SCENES ARE STILL PLACEHOLDERS — stock Unsplash decks, not our membranes.
// Swap them for real install photos before launch and drop the
// `images.remotePatterns` block in next.config.ts at the same time.
const SCENE = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
const SWATCH = (slug: string) => `/images/designs/swatches/${slug}.jpg`;

/** Real pattern tile, shot from the membrane. Only where one exists. */
const TILE = (slug: string) => `/images/designs/${slug}.jpg`;

// The full range, in the order the colour cards should read.
export const DESIGNS: Design[] = [
  {
    name: "Speckled Stone Grey",
    slug: "speckled-stone-grey",
    blurb: "Cool mid-grey with a fine stone speckle through it.",
    swatch: SWATCH("speckled-stone-grey"),
    scene: "/images/grey-deck-modern-farmhouse.jpg",
    tile: TILE("speckled-stone-grey"),
    tileTone: "#a1a09d",
    tone: "#a09f9d",
    family: "grey",
    tag: "best-seller",
  },
  {
    name: "Speckled Stone Silver",
    slug: "speckled-stone-silver",
    blurb: "Light silver that keeps decks bright and cool underfoot.",
    swatch: SWATCH("speckled-stone-silver"),
    scene: "/images/silver-deck-backyard.jpg",
    tile: TILE("speckled-stone-silver"),
    tileTone: "#c6c6c6",
    tone: "#c5c5c5",
    family: "silver",
  },
  {
    name: "Speckled Stone Brown",
    slug: "speckled-stone-brown",
    blurb: "Deep earth brown, speckled to hide the everyday.",
    swatch: SWATCH("speckled-stone-brown"),
    scene: SCENE("1613544723371-23b514a78c85"),
    tile: TILE("speckled-stone-brown"),
    tileTone: "#b7a697",
    tone: "#b6a596",
    family: "brown",
  },
  {
    name: "Speckled Stone Tan",
    slug: "speckled-stone-tan",
    blurb: "Warm, sandy neutral that pairs beautifully with wood tones.",
    swatch: SWATCH("speckled-stone-tan"),
    scene: SCENE("1574120583586-de8847ae992c"),
    tile: TILE("speckled-stone-tan"),
    tileTone: "#ddd2c3",
    tone: "#ddd2c2",
    family: "tan",
  },
  {
    name: "Granite Grey",
    slug: "granite-grey",
    blurb: "Dense granite pattern in a true neutral grey.",
    swatch: SWATCH("granite-grey"),
    scene: SCENE("1656646549607-8fda5837a4ca"),
    tile: TILE("granite-grey"),
    tileTone: "#b7b2ae",
    tone: "#b6b1ad",
    family: "grey",
  },
  {
    name: "Granite Silver",
    slug: "granite-silver",
    blurb: "The palest of the granites. Bright without going stark.",
    swatch: SWATCH("granite-silver"),
    scene: SCENE("1716904519810-349244919824"),
    tile: TILE("granite-silver"),
    tileTone: "#c4c2c3",
    tone: "#c4c2c3",
    family: "silver",
  },
  {
    name: "Granite Brown",
    slug: "granite-brown",
    blurb: "Rich, grounded brown for decks that sit under trees.",
    swatch: SWATCH("granite-brown"),
    scene: "/images/grey-deck-modern-farmhouse.jpg",
    tile: TILE("granite-brown"),
    tileTone: "#a79b8e",
    tone: "#a79b8e",
    family: "brown",
  },
  {
    name: "Granite Tan",
    slug: "granite-tan",
    blurb: "Golden tan granite. The warmest colour in the range.",
    swatch: SWATCH("granite-tan"),
    scene: "/images/tan-plank-deck-glass-railing.jpg",
    tile: TILE("granite-tan"),
    tileTone: "#d7d0ca",
    tone: "#d6d0c9",
    family: "tan",
  },
  {
    name: "Portland Grey",
    slug: "portland-grey",
    blurb: "Even, concrete-toned grey that suits modern builds.",
    swatch: SWATCH("portland-grey"),
    tile: SWATCH("portland-grey"),
    tileTone: "#797877",
    tone: "#797877",
    family: "grey",
    tag: "sold-out",
  },
  {
    name: "Urban Mist",
    slug: "urban-mist",
    blurb: "Soft concrete grey. Clean, modern, goes with everything.",
    swatch: SWATCH("urban-mist"),
    scene: SCENE("1656646549607-8fda5837a4ca"),
    tile: TILE("urban-mist"),
    tileTone: "#b4ada8",
    tone: "#b3aca7",
    family: "grey",
  },
  {
    name: "Driftwood",
    slug: "driftwood",
    blurb: "Weathered timber look, greyed off by sun and salt.",
    swatch: SWATCH("driftwood"),
    scene: SCENE("1716904519810-349244919824"),
    tile: SWATCH("driftwood"),
    tileTone: "#a29a8e",
    tone: "#a29a8e",
    family: "grey",
    tag: "coming-soon",
  },
];

/** Picks surfaced in the homepage carousel — order matters */
const FEATURED_SLUGS = [
  "speckled-stone-grey",
  "granite-tan",
  "speckled-stone-silver",
  "granite-brown",
];

export const FEATURED_DESIGNS = FEATURED_SLUGS.map(
  (slug) => DESIGNS.find((d) => d.slug === slug)!,
);
