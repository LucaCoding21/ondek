/**
 * The visualizer's vinyl lineup — config only, no component code.
 *
 * Derived from the site's design catalogue (src/lib/designs.ts) so the two
 * can never disagree about names or swatch photos. Adding or removing a
 * vinyl here (or in DESIGNS) changes every visualizer surface with no
 * component edits.
 *
 * `regions` is carried on every vinyl for the day regional availability
 * goes live, but nothing filters on it yet — see getAvailableVinyls().
 */

import { DESIGNS, type Design } from "@/lib/designs";

export type Region = "CA" | "US";

export type Vinyl = {
  /** Stable id — doubles as the ?vinyl= deep-link value and the stock
   *  combo filename segment. Never rename a shipped sku. */
  sku: string;
  name: string;
  /** Membrane swatch photo, served from /public. Also what the generation
   *  pipeline sends to the image model as the pattern reference. */
  swatchPath: string;
  regions: Region[];
  /** Average colour of the swatch — placeholder wash while it loads */
  tone: string;
  /** One-liner under the selected swatch name */
  blurb?: string;
};

/** Designs a visitor can actually order get visualized; sold-out and
 *  coming-soon stay out of the strip until their tag is dropped. */
const EXCLUDED_TAGS = new Set(["sold-out", "coming-soon"]);

function toVinyl(design: Design): Vinyl {
  return {
    sku: design.slug,
    name: design.name,
    swatchPath: design.swatch,
    regions: ["CA", "US"],
    tone: design.tone,
    blurb: design.blurb,
  };
}

export const VINYLS: Vinyl[] = DESIGNS.filter(
  (design) => !design.tag || !EXCLUDED_TAGS.has(design.tag),
).map(toVinyl);

/**
 * THE geogating seam. Every visualizer surface reads the lineup through
 * this call and nothing else. When region detection ships, filter here —
 * `vinyls.filter((v) => v.regions.includes(region))` — and the whole
 * feature is gated. Until then: everyone sees everything.
 */
export function getAvailableVinyls(region?: Region): Vinyl[] {
  void region; // unused until geogating goes live
  return VINYLS;
}

export function getVinyl(sku: string): Vinyl | undefined {
  return VINYLS.find((vinyl) => vinyl.sku === sku);
}
