/**
 * Everything tunable about the deck visualizer in one place: the stock
 * layouts, the railing cross-promo links, generation limits, and where
 * quote leads are delivered. Components read from here and never hardcode.
 */

export type StockLayout = {
  /** Stable id — the ?layout= deep-link value and stock combo filename
   *  segment ({layoutId}__{sku}.webp). Never rename a shipped id. */
  id: string;
  name: string;
  /** The untouched deck photo, served from /public. Also the input the
   *  stock-combo generation script sends to the image model. */
  photoPath: string;
  /** Cross-promo for the Innovative Aluminum railing visible in the shot */
  railing: {
    name: string;
    url: string;
  };
};

// PLACEHOLDER PHOTOS — these three are existing site photography standing in
// until the client drops the real stock layout shots into the repo. Swap
// photoPath (and re-run the stock combo script) when they land; ids can stay.
export const STOCK_LAYOUTS: StockLayout[] = [
  {
    id: "lakeview",
    name: "Lakeview deck",
    photoPath: "/images/grey-deck-lake-view.jpg",
    railing: {
      name: "Innovative Aluminum picket railing",
      url: "https://www.innovativealuminum.com/",
    },
  },
  {
    id: "glassrail",
    name: "Glass rail deck",
    photoPath: "/images/tan-plank-deck-glass-railing.jpg",
    railing: {
      name: "Innovative Aluminum glass railing",
      url: "https://www.innovativealuminum.com/",
    },
  },
  {
    id: "backyard",
    name: "Backyard deck",
    photoPath: "/images/silver-deck-backyard.jpg",
    railing: {
      name: "Innovative Aluminum aluminum railing",
      url: "https://www.innovativealuminum.com/",
    },
  },
];

export function getStockLayout(id: string): StockLayout | undefined {
  return STOCK_LAYOUTS.find((layout) => layout.id === id);
}

/** Where approved stock combos live, and how they are named */
export const STOCK_COMBO_DIR = "/images/visualizer/stock";
export function stockComboPath(layoutId: string, sku: string) {
  return `${STOCK_COMBO_DIR}/${layoutId}__${sku}.webp`;
}

// ── Custom Mode limits ──────────────────────────────────────────────────
// A public page calling a paid API: every number here is a cost control.

export const LIMITS = {
  /** Renders one visitor gets per day before the friendly cutoff. Not
   *  surfaced as a countdown in the UI: a visitor deep in designing is a
   *  lead, and the limit only exists to stop runaway spend. */
  sessionRenders: 25,
  /** Sliding-window per-IP cap on the generate route */
  ipWindowMs: 10 * 60 * 1000,
  ipWindowMax: 20,
  /** Uploads: accepted types and size ceiling (server re-checks both) */
  uploadMaxBytes: 10 * 1024 * 1024,
  uploadTypes: ["image/jpeg", "image/png", "image/webp"],
  /** Longest edge the deck photo is downscaled to before hitting the API */
  workingEdgePx: 1536,
  /**
   * Monthly hard cap on generations (the plan includes 600; the default
   * leaves headroom for the stock-combo script and retries). Overridable
   * via VISUALIZER_MONTHLY_CAP. When exceeded, Custom Mode shows its
   * "temporarily unavailable" state; Stock Mode keeps working.
   */
  monthlyCap: Number(process.env.VISUALIZER_MONTHLY_CAP ?? 550),
};

/** Inbox visualizer quote requests are delivered to */
export const LEAD_INBOX =
  process.env.VISUALIZER_LEAD_INBOX ?? "info@ondekvinylworx.com";

/** Progress theater — cycled on screen while a render is in flight */
export const GENERATION_MESSAGES = [
  "Analyzing your deck…",
  "Reading the light in your photo…",
  "Laying the new surface…",
  "Matching your lighting…",
  "Welding the seams…",
  "Finishing the edges…",
];

/** Shown once a streamed preview is on the stage and the final is coming */
export const REFINING_MESSAGE = "Sharpening the details…";

/**
 * The progress bar under the status chip. The API gives no true percent,
 * so the bar is honest in a different way: it paces itself against the
 * observed median render time and snaps forward on REAL events (the
 * streamed partial frames, which land around 1/3 and 2/3 of the way in).
 * It never claims completion — `cap` is as far as pacing alone can take
 * it; only the finished render ends it.
 */
export const GENERATION_PROGRESS = {
  /** Time constant of the pacing curve, in seconds. Progress follows
   *  cap × (1 − e^(−t/tau)): quick early movement, slowing as it goes.
   *  16 puts ~45% at 12s and ~84% at the 37s median. */
  tauSeconds: 16,
  /** Pacing alone never passes this */
  cap: 0.92,
  /** Floors snapped to when partial frame 1 / frame 2 actually arrive
   *  (~12s / ~22s observed) — the bar's tie to reality */
  floors: [0.45, 0.72],
};

/**
 * Streamed previews while a Custom Mode render is in flight. The model can
 * send intermediate frames (the first lands around a third of the way in,
 * ~12s of a ~33s render). They are NOT blurred drafts: each is a full-
 * detail guess that still shows the old deck boards, so the route shrinks
 * every frame to `edgePx` before it leaves the server and the stage shows
 * it as a soft colour wash. Nothing misleading can survive 96px.
 *
 * Costs ~13% more output tokens per render. `count: 0` turns it off and
 * the route answers with plain JSON again.
 */
export const PARTIAL_PREVIEWS = {
  count: 2,
  edgePx: 96,
};
