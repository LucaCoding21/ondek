"use client";

import { useEffect, useState } from "react";
import { useScrollLock } from "./useScrollLock";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

export type CompareItem = {
  id: string;
  /** The image that goes on the slider (colour cards resolve via `sku`
   *  instead — rendering first if needed) */
  src: string;
  /** What the card shows — the vinyl swatch for colour cards */
  previewSrc?: string;
  label: string;
  sublabel?: string;
  /** Colour card: the vinyl to show on the current photo when picked */
  sku?: string;
  /** Already generated — comparing it is instant and free */
  rendered?: boolean;
};

/**
 * The compare flow: one Compare button, then this picker. Everything
 * comparable on the photo on stage is a card — its original, every vinyl.
 * The design on stage comes pre-picked; the visitor taps one more (the
 * first pick goes left, the second right; a third tap swaps out the
 * oldest) and confirms with the button pinned at the bottom.
 */
export default function ComparePicker({
  open,
  onClose,
  loadItems,
  preselectedId,
  onCompare,
}: {
  open: boolean;
  onClose: () => void;
  /** Resolved fresh on every open, so the list is never stale */
  loadItems: () => Promise<CompareItem[]>;
  /** The design on stage, picked before the visitor touches anything */
  preselectedId: string | null;
  onCompare: (a: CompareItem, b: CompareItem) => void;
}) {
  const [items, setItems] = useState<CompareItem[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  // The page holds still while this overlay is up
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadItems().then((resolved) => {
      if (cancelled) return;
      setItems(resolved);
      setPicked(
        preselectedId && resolved.some((item) => item.id === preselectedId)
          ? [preselectedId]
          : [],
      );
    });
    return () => {
      cancelled = true;
      setItems(null);
      setPicked([]);
    };
  }, [open, loadItems, preselectedId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function tap(item: CompareItem) {
    if (picked.includes(item.id)) {
      setPicked(picked.filter((id) => id !== item.id));
      return;
    }
    // Two already picked: the newest tap takes the place of the oldest
    setPicked(picked.length < 2 ? [...picked, item.id] : [picked[1], item.id]);
  }

  const pair = picked.map((id) => items?.find((item) => item.id === id));
  const ready = pair.length === 2 && pair.every(Boolean);

  function confirm() {
    if (!ready) return;
    const [first, second] = pair as [CompareItem, CompareItem];
    onCompare(first, second);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-0 tablet:items-center tablet:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Compare two looks"
            data-lenis-prevent
            className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain bg-background"
            onClick={(event) => event.stopPropagation()}
          >
            {/* The title bar stays put while the grid scrolls under it, so
                the way out is always in reach */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-foreground/10 bg-background px-6 py-4 tablet:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em]">
                Compare
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-m-2 cursor-pointer p-2 text-foreground/50 transition-colors hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 pt-5 tablet:p-8 tablet:pt-6">
              <h2 className="text-xl font-bold tablet:text-2xl">
                Compare two vinyls side by side.
              </h2>
              <p className="mt-2 text-sm text-foreground/55">
                Choose two vinyls, or a vinyl and the original photo.
              </p>

            <div className="mt-6">
              {items === null ? (
                <p className="text-sm text-foreground/45">Loading…</p>
              ) : items.length < 2 ? (
                <p className="text-sm leading-relaxed text-foreground/55">
                  No previews of this deck yet. Pick another deck or upload
                  your own photo.
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-3">
                  {items.map((item) => {
                    const pickIndex = picked.indexOf(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => tap(item)}
                          aria-pressed={pickIndex >= 0}
                          className={`group relative block w-full cursor-pointer border text-left transition-colors duration-200 ${
                            pickIndex >= 0
                              ? "border-cta"
                              : "border-foreground/15 hover:border-foreground/40"
                          }`}
                        >
                          <span className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-100">
                            {/* Blob and public URLs both land here — plain
                                img keeps them on equal footing */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.previewSrc ?? item.src}
                              alt={item.label}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {pickIndex >= 0 && (
                              <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-cta text-white shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                                <Check size={14} strokeWidth={3} aria-hidden />
                                <span className="sr-only">Picked</span>
                              </span>
                            )}
                          </span>
                          <span className="block px-2.5 py-2">
                            <span className="block truncate text-xs font-bold leading-tight">
                              {item.label}
                            </span>
                            {(item.sublabel ?? (item.rendered && "Ready")) && (
                              <span className="mt-0.5 block text-[11px] text-foreground/45">
                                {item.sublabel ?? "Ready"}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            </div>

            {items !== null && items.length >= 2 && (
              <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-foreground/10 bg-background px-6 py-4 tablet:px-8">
                <p className="min-w-0 truncate text-sm text-foreground/60">
                  {ready ? (
                    <>
                      <span className="font-bold text-foreground">
                        {pair[0]?.label}
                      </span>
                      {" vs "}
                      <span className="font-bold text-foreground">
                        {pair[1]?.label}
                      </span>
                    </>
                  ) : picked.length === 1 ? (
                    "Choose one more to compare against."
                  ) : (
                    "Choose two to compare."
                  )}
                </p>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={!ready}
                  className="flex-none cursor-pointer bg-cta px-5 py-2.5 text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Compare
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
