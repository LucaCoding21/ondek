export type DesignTag = "best-seller" | "new" | "sold-out";

export type DesignFamily = "grey" | "tan" | "brown";

export type Design = {
  name: string;
  slug: string;
  swatch: string;
  /** Deck scene photo — swap in when product shots are ready */
  scene?: string;
  /** Fallback colour shown while imagery loads */
  tone: string;
  family: DesignFamily;
  tag?: DesignTag;
  /** One-liner shown on the active row of the homepage colour menu */
  blurb?: string;
};

export const DESIGN_TAG_LABELS: Record<DesignTag, string> = {
  "best-seller": "Best seller",
  new: "New",
  "sold-out": "Sold out",
};

export const DESIGN_FAMILY_LABELS: Record<DesignFamily, string> = {
  grey: "Greys",
  tan: "Tans",
  brown: "Browns",
};

/** Families that actually have designs, in first-appearance order */
export function familiesInUse(designs: Design[]): DesignFamily[] {
  return [...new Set(designs.map((d) => d.family))];
}

// TODO: fill in the remaining colours (10 total) as assets come in.
export const DESIGNS: Design[] = [
  {
    name: "Speckled Tan",
    slug: "speckled-tan",
    blurb: "Warm, sandy neutral that pairs beautifully with wood tones.",
    swatch: "/images/designs/speckled-tan-800px.jpg",
    // Temporary: hero shot standing in until the real tan scene is shot
    scene: "/images/hero-deck-backyard.jpg",
    tone: "#b8a894",
    family: "tan",
    tag: "best-seller",
  },
  {
    name: "Granite Grey",
    slug: "granite-grey",
    blurb: "Cool mid-grey with a natural stone speckle.",
    swatch: "/images/designs/granite-grey-800px.jpg",
    // Temporary: silver scene standing in for testing
    scene: "/images/designs/speckled-silver-scene.jpg",
    tone: "#8b8d90",
    family: "grey",
  },
  {
    name: "Portland Grey",
    slug: "portland-grey",
    blurb: "Soft concrete grey. Clean, modern, goes with everything.",
    swatch: "/images/designs/portland-grey-800px.jpg",
    // Temporary: tan/hero scene standing in for testing
    scene: "/images/hero-deck-backyard.jpg",
    tone: "#9a958c",
    family: "grey",
    tag: "new",
  },
  {
    name: "Speckled Silver",
    slug: "speckled-silver",
    blurb: "Light silver that keeps decks bright and cool underfoot.",
    swatch: "/images/designs/speckled-silver-800px.jpg",
    scene: "/images/designs/speckled-silver-scene.jpg",
    tone: "#c0bdb6",
    family: "grey",
  },
];

/** Top picks surfaced on the homepage — order matters */
export const FEATURED_DESIGNS = DESIGNS.slice(0, 4);
