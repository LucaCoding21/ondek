/**
 * Which stock combos have an APPROVED render in
 * /public/images/visualizer/stock. Maintained by the approval step of
 * scripts/generate-stock-combos.ts — run it with --approve and this list
 * is rewritten from what's actually on disk. Do not edit by hand.
 *
 * The UI treats a missing combo as "preview being prepared" and shows the
 * base layout photo, so shipping with a partial list is safe.
 */

export const STOCK_COMBOS: string[] = [];

export function hasStockCombo(layoutId: string, sku: string): boolean {
  return STOCK_COMBOS.includes(`${layoutId}__${sku}`);
}
