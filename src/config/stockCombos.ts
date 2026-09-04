/**
 * Which stock combos have an APPROVED render in
 * /public/images/visualizer/stock. Maintained by the approval step of
 * scripts/generate-stock-combos.ts — run it with --approve and this list
 * is rewritten from what's actually on disk. Do not edit by hand.
 *
 * The UI treats a missing combo as "preview being prepared" and shows the
 * base layout photo, so shipping with a partial list is safe.
 */

export const STOCK_COMBOS: string[] = [
  "backyard__granite-brown",
  "backyard__granite-grey",
  "backyard__granite-silver",
  "backyard__granite-tan",
  "backyard__speckled-stone-brown",
  "backyard__speckled-stone-grey",
  "backyard__speckled-stone-silver",
  "backyard__speckled-stone-tan",
  "backyard__urban-mist",
  "glassrail__granite-brown",
  "glassrail__granite-grey",
  "glassrail__granite-silver",
  "glassrail__granite-tan",
  "glassrail__speckled-stone-brown",
  "glassrail__speckled-stone-grey",
  "glassrail__speckled-stone-silver",
  "glassrail__speckled-stone-tan",
  "glassrail__urban-mist",
  "lakeview__granite-brown",
  "lakeview__granite-grey",
  "lakeview__granite-silver",
  "lakeview__granite-tan",
  "lakeview__speckled-stone-brown",
  "lakeview__speckled-stone-grey",
  "lakeview__speckled-stone-silver",
  "lakeview__speckled-stone-tan",
  "lakeview__urban-mist"
];

export function hasStockCombo(layoutId: string, sku: string): boolean {
  return STOCK_COMBOS.includes(`${layoutId}__${sku}`);
}
