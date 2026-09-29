/**
 * Which stock combos have an APPROVED render in
 * /public/images/visualizer/stock. Maintained by the approval step of
 * scripts/generate-stock-combos.ts — run it with --approve and this list
 * is rewritten from what's actually on disk. Do not edit by hand.
 *
 * The UI treats a missing combo as "preview being prepared" and shows the
 * base layout photo, so shipping with a partial list is safe.
 */

/** combo id -> short content hash of the approved file (cache key) */
export const STOCK_COMBOS: Record<string, string> = {
  "backyard__boardwalk": "c2b684b3",
  "backyard__driftwood": "0343ffca",
  "backyard__granite-brown": "35925403",
  "backyard__granite-grey": "81f8dc39",
  "backyard__granite-silver": "06ddcdfe",
  "backyard__granite-tan": "7ca735cf",
  "backyard__hansberry": "9ee7289c",
  "backyard__ipe": "a10ec829",
  "backyard__speckled-stone-brown": "dfd521be",
  "backyard__speckled-stone-grey": "037003c9",
  "backyard__speckled-stone-silver": "c7a1abbc",
  "backyard__speckled-stone-tan": "59fc5194",
  "backyard__urban-mist": "87d01fe4",
  "backyard__walnut": "faf28dd5",
  "glassrail__boardwalk": "1aa9e181",
  "glassrail__driftwood": "2a3152b1",
  "glassrail__granite-brown": "04b405b7",
  "glassrail__granite-grey": "129054ee",
  "glassrail__granite-silver": "ffb45dc6",
  "glassrail__granite-tan": "2aa97db4",
  "glassrail__hansberry": "9b1ab639",
  "glassrail__ipe": "3ab04ed3",
  "glassrail__speckled-stone-brown": "d9a29ebf",
  "glassrail__speckled-stone-grey": "bc06b71d",
  "glassrail__speckled-stone-silver": "e46c94fa",
  "glassrail__speckled-stone-tan": "8d52dad0",
  "glassrail__urban-mist": "156deb52",
  "glassrail__walnut": "cd154502",
  "lakeview__boardwalk": "aafa1d69",
  "lakeview__driftwood": "b0b519c2",
  "lakeview__granite-brown": "162b6a00",
  "lakeview__granite-grey": "1a691a4f",
  "lakeview__granite-silver": "feda911d",
  "lakeview__granite-tan": "d24742c8",
  "lakeview__hansberry": "a1c594aa",
  "lakeview__ipe": "4bfffa48",
  "lakeview__speckled-stone-brown": "a33fcb24",
  "lakeview__speckled-stone-grey": "d3b601df",
  "lakeview__speckled-stone-silver": "14c339a5",
  "lakeview__speckled-stone-tan": "d69125b1",
  "lakeview__urban-mist": "15004236",
  "lakeview__walnut": "5ed9458c"
};

export function hasStockCombo(layoutId: string, sku: string): boolean {
  return `${layoutId}__${sku}` in STOCK_COMBOS;
}

/** The cache key for a combo, or undefined when it has no approved render */
export function stockComboVersion(layoutId: string, sku: string): string | undefined {
  return STOCK_COMBOS[`${layoutId}__${sku}`];
}
