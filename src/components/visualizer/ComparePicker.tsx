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
  /** Section heading this card sits under */
  group?: string;
  /** Colour card: the vinyl to show on the current photo when picked */
  sku?: string;
  /** Already generated — comparing it is instant and free */
  rendered?: boolean;
  /** Object URL created just for this picker — revoked on close unless picked */
  ephemeral?: boolean;
};

/**
 * The compare flow: one Compare button, then this picker. Everything
 * comparable is a card — the original photo, past renders, stock combos.
 * The design on stage comes pre-selected as side A, so one tap usually
 * finishes the job; the second selection launches the slider immediately.
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
    let loaded: CompareItem[] = [];
    loadItems().then((resolved) => {
      loaded = resolved;
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
      for (const item of loaded) {
        if (item.ephemeral) URL.revokeObjectURL(item.src);
      }
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
    if (picked.length === 0) {
      setPicked([item.id]);
      return;
    }
    // Second pick completes the pair — straight to the slider
    const first = items?.find((candidate) => candidate.id === picked[0]);
    if (!first) return;
    // A picked URL leaves with onCompare — clearing the flag on the shared
    // item object stops the close-time cleanup from revoking it
    for (const chosen of [first, item]) {
      chosen.ephemeral = false;
    }
    onCompare(first, item);
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
            className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain bg-background p-6 tablet:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">
                  Compare
                </p>
                <h2 className="mt-3 text-xl font-bold tablet:text-2xl">
                  Pick two looks.
                </h2>
                <p className="mt-2 text-sm text-foreground/55">
                  They go side by side on a slider. A colour you have not
                  tried yet renders first.
                  {picked.length === 1 && " One picked, one to go."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-m-2 cursor-pointer p-2 text-foreground/50 transition-colors hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">
              {items === null ? (
                <p className="text-sm text-foreground/45">Loading…</p>
              ) : items.length < 2 ? (
                <p className="text-sm leading-relaxed text-foreground/55">
                  Nothing to compare yet. Try a couple of colours first and
                  they&apos;ll show up here.
                </p>
              ) : (
                [...new Set(items.map((item) => item.group ?? ""))].map(
                  (group) => (
                    <div key={group || "main"} className="mb-6 last:mb-0">
                      {group && (
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground/45">
                          {group}
                        </p>
                      )}
                      <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-3">
                        {items
                          .filter((item) => (item.group ?? "") === group)
                          .map((item) => {
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
                              <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-cta text-[11px] font-bold text-foreground">
                                A
                              </span>
                            )}
                            {item.rendered && pickIndex < 0 && (
                              <span
                                title="Already rendered, instant"
                                className="absolute bottom-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-cta"
                              >
                                <Check size={12} strokeWidth={3} aria-hidden />
                                <span className="sr-only">
                                  Already rendered
                                </span>
                              </span>
                            )}
                          </span>
                          <span className="block px-2.5 py-2">
                            <span className="block truncate text-xs font-bold leading-tight">
                              {item.label}
                            </span>
                            {item.sublabel && (
                              <span className="mt-0.5 block text-[11px] text-foreground/45">
                                {item.sublabel}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                          })}
                      </ul>
                    </div>
                  ),
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
