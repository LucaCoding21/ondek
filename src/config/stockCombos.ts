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
  "glassrail__boardwalk": "2bdf91b7",
  "glassrail__driftwood": "47d4faec",
  "glassrail__granite-brown": "83e8ed15",
  "glassrail__granite-grey": "971dc38d",
  "glassrail__granite-silver": "a16ae4ee",
  "glassrail__granite-tan": "9b59c7d1",
  "glassrail__hansberry": "706a8717",
  "glassrail__ipe": "a71b71bf",
  "glassrail__speckled-stone-brown": "46c3ae1d",
  "glassrail__speckled-stone-grey": "57e46e3b",
  "glassrail__speckled-stone-silver": "31f2c8c2",
  "glassrail__speckled-stone-tan": "d1721dc4",
  "glassrail__urban-mist": "b2dc6d6e",
  "glassrail__walnut": "02952b80",
  "lakeview__boardwalk": "771b5027",
  "lakeview__driftwood": "68c269b0",
  "lakeview__granite-brown": "41790e18",
  "lakeview__granite-grey": "85b632b1",
  "lakeview__granite-silver": "441a3a9b",
  "lakeview__granite-tan": "9da43966",
  "lakeview__hansberry": "54fbb4bd",
  "lakeview__ipe": "be8e824f",
  "lakeview__speckled-stone-brown": "4d1c6c58",
  "lakeview__speckled-stone-grey": "fd4ea3bb",
  "lakeview__speckled-stone-silver": "04b6a9ca",
  "lakeview__speckled-stone-tan": "b0de2616",
  "lakeview__urban-mist": "2354e021",
  "lakeview__walnut": "a3040df4"
};

export function hasStockCombo(layoutId: string, sku: string): boolean {
  return `${layoutId}__${sku}` in STOCK_COMBOS;
}

/** The cache key for a combo, or undefined when it has no approved render */
export function stockComboVersion(layoutId: string, sku: string): string | undefined {
  return STOCK_COMBOS[`${layoutId}__${sku}`];
}
