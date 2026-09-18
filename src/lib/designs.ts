export type DesignTag = "best-seller" | "new" | "sold-out" | "coming-soon";

export type DesignFamily = "grey" | "silver" | "tan" | "brown" | "wood";

export type Design = {
  name: string;
  slug: string;
  swatch: string;
  /** Full-width membrane strip sent to the image model as the pattern
   *  reference. One roll width: the long edge is 6 feet of real membrane
   *  (per the owners), which is how the model learns plank scale and the
   *  pattern's true repeat. The square `swatch` is a crop of this and is
   *  only for the UI. */
  reference?: string;
  /** Measured real-world sizes of the pattern, spliced into the generation
   *  prompt. Only patterns with a visible unit (planks, chevrons) need one;
   *  speckles have nothing to size. */
  scaleHint?: string;
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
  wood: "Woodgrains",
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
const REFERENCE = (slug: string) => `/images/designs/reference/${slug}.jpg`;

// Sizes measured off the 1600px reference strips at 22.2 px per inch
// (joint-darkness minima, Sep 2026). Straight-laid woodgrains: 13 to 14
// planks across the 6 ft strip, so 5 to 5.5 in each. Chevrons: spine
// boards about 3 in wide on a 16 to 18 in pitch (four bays per strip),
// diagonals about 2.5 in wide, six or seven per bay. Both chevron strips
// have the same geometry; only their colour differs.
const PLANK_HINT =
  "Count the planks in Image 2: about 14 straight planks side by side across its 6 foot length, so each plank is about 5 inches (13 cm) wide, and a 12 foot wide deck shows about 28 planks.";
const CHEVRON_HINT =
  "Look at Image 2 first: across its 6 foot length it shows exactly four bays, so one bay is about 18 inches (45 cm) wide. A bay is a straight vertical spine board about 3 inches (7 cm) wide, then six or seven narrow diagonal boards about 2.5 inches (6 cm) wide that all lean the same way, then the next vertical spine, then a bay of diagonals leaning the opposite way, and so on. Every bay of diagonals has a spine on both sides; diagonals never meet other diagonals directly and never form a mitred V without a spine between them. On the deck the boards must stay this narrow: a diagonal board is narrower than the gap between two railing pickets, and a 12 foot wide deck shows about 8 spines.";

/** Real pattern tile, shot from the membrane. Only where one exists. */
const TILE = (slug: string) => `/images/designs/${slug}.jpg`;

// The full range, in the order the colour cards should read.
export const DESIGNS: Design[] = [
  {
    name: "Speckled Stone Grey",
    slug: "speckled-stone-grey",
    blurb: "Cool mid-grey with a fine stone speckle through it.",
    swatch: SWATCH("speckled-stone-grey"),
    reference: REFERENCE("speckled-stone-grey"),
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
    reference: REFERENCE("speckled-stone-silver"),
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
    reference: REFERENCE("speckled-stone-brown"),
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
    reference: REFERENCE("speckled-stone-tan"),
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
    reference: REFERENCE("granite-grey"),
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
    reference: REFERENCE("granite-silver"),
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
    reference: REFERENCE("granite-brown"),
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
    reference: REFERENCE("granite-tan"),
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
    reference: REFERENCE("urban-mist"),
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
    reference: REFERENCE("driftwood"),
    scaleHint: PLANK_HINT,
    scene: SCENE("1716904519810-349244919824"),
    tile: SWATCH("driftwood"),
    tileTone: "#a29a8e",
    tone: "#a29a8e",
    family: "wood",
  },
  // The US-side woodgrains, added when the owners supplied the full
  // CAN + US pattern set (Sep 2026; Walnut followed on Sep 16). Swatches
  // are square crops of the 1600px reference strips; tones sampled from
  // the crops.
  {
    name: "Ipe",
    slug: "ipe",
    blurb: "Deep, rich hardwood tones in a classic plank layout.",
    swatch: SWATCH("ipe"),
    reference: REFERENCE("ipe"),
    scaleHint: PLANK_HINT,
    tile: SWATCH("ipe"),
    tileTone: "#733b28",
    tone: "#733b28",
    family: "wood",
  },
  {
    name: "Boardwalk",
    slug: "boardwalk",
    blurb: "Chevron planks in a cool, weathered grey-brown.",
    swatch: SWATCH("boardwalk"),
    reference: REFERENCE("boardwalk"),
    scaleHint:
      CHEVRON_HINT +
      " The boards are a weathered grey-brown with crisp joints between them.",
    tile: SWATCH("boardwalk"),
    tileTone: "#7d7063",
    tone: "#7d7063",
    family: "wood",
  },
  {
    name: "Hansberry",
    slug: "hansberry",
    blurb: "Warm chevron woodgrain with a hand-laid character.",
    swatch: SWATCH("hansberry"),
    reference: REFERENCE("hansberry"),
    scaleHint:
      CHEVRON_HINT +
      " The boards are warm brown, some greyer and some redder side by side, with bold grain and clear dark joints; keep that board to board variation.",
    tile: SWATCH("hansberry"),
    tileTone: "#8d7361",
    tone: "#8d7361",
    family: "wood",
  },
  {
    name: "Walnut",
    slug: "walnut",
    blurb: "Straight-laid walnut planks in a soft, smoky brown.",
    swatch: SWATCH("walnut"),
    reference: REFERENCE("walnut"),
    scaleHint: PLANK_HINT,
    tile: SWATCH("walnut"),
    tileTone: "#785f43",
    tone: "#785f43",
    family: "wood",
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
