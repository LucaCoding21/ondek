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
   *  stock-combo generation script sends to the image model. Carries a
   *  ?v= cache key: bump it whenever the file is replaced, or browsers
   *  keep the old photo for a year. */
  photoPath: string;
  /** Cross-promo for the Innovative Aluminum railing visible in the shot */
  railing: {
    name: string;
    url: string;
  };
};

// The client's chosen stock shots (supplied Sep 2026, replacing the
// placeholder site photography). Ids predate the swap and stay stable —
// "lakeview" is an ocean view, but the id lives in deep links and 13
// combo filenames, so only the name says so.
export const STOCK_LAYOUTS: StockLayout[] = [
  {
    id: "lakeview",
    name: "Oceanview deck",
    photoPath: "/images/oceanview-balcony-glass-railing.jpg?v=2",
    railing: {
      name: "Innovative Aluminum glass railing",
      url: "https://www.innovativealuminum.com/",
    },
  },
  {
    id: "glassrail",
    name: "Glass rail deck",
    photoPath: "/images/mountain-balcony-glass-railing.jpg",
    railing: {
      name: "Innovative Aluminum glass railing",
      url: "https://www.innovativealuminum.com/",
    },
  },
  {
    id: "backyard",
    name: "Backyard deck",
    photoPath: "/images/pond-deck-picket-railing.jpg",
    railing: {
      name: "Innovative Aluminum picket railing",
      url: "https://www.innovativealuminum.com/",
    },
  },
];

export function getStockLayout(id: string): StockLayout | undefined {
  return STOCK_LAYOUTS.find((layout) => layout.id === id);
}

/** Where approved stock combos live, and how they are named. The
 *  version (a content hash from the manifest) goes in the query string:
 *  the files are served immutable for a year, so a re-rendered combo
 *  needs a new URL to reach browsers and the CDN. */
export const STOCK_COMBO_DIR = "/images/visualizer/stock";
export function stockComboPath(layoutId: string, sku: string, version?: string) {
  const file = `${STOCK_COMBO_DIR}/${layoutId}__${sku}.webp`;
  return version ? `${file}?v=${version}` : file;
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

/**
 * How long a Custom Mode render gets before the visitor is told to try
 * again. Observed renders land in 15–20s on gpt-image-2.5 Flare (median
 * ~16s); anything past 40s is the model having a bad day, and a visitor
 * watching a spinner for over a minute reads the tool as broken. The route retries once on
 * transient failures, but only inside this budget.
 */
export const GENERATION_BUDGET = {
  /** Longest a single call to the image API may run */
  attemptMs: 40_000,
  /** Wall-clock for the whole request, retry included */
  totalMs: 70_000,
  /** A retry only starts with at least this much budget left. Below the
   *  median render time it's mostly a paid call that can't finish. */
  minRetryMs: 25_000,
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
 * Past the slow tail of normal renders the cycling copy stops and this
 * takes over, so the visitor knows the tool is alive and the wait is
 * unusual, not the norm. Replaces both the cycle and REFINING_MESSAGE.
 */
export const SLOW_RENDER = {
  afterSeconds: 25,
  message: "Taking longer than usual. Hang tight…",
};

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
   *  7 puts ~50% at 5s and ~82% at the 16s median. */
  tauSeconds: 7,
  /** Pacing alone never passes this */
  cap: 0.92,
  /** Floors snapped to when partial frame 1 / frame 2 actually arrive
   *  (a third and two thirds of the way in, ~5s / ~10s on Flare) — the
   *  bar's tie to reality */
  floors: [0.45, 0.72],
};

/**
 * Streamed previews while a Custom Mode render is in flight. The model can
 * send intermediate frames (the first lands around a third of the way in,
 * ~5s of a ~16s render). They are NOT blurred drafts: each is a full-
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
