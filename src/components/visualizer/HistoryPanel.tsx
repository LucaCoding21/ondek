"use client";

import { useEffect, useState } from "react";
import { useScrollLock } from "./useScrollLock";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getVinyl } from "@/config/vinyls";
import {
  getRender,
  listHistory,
  type HistoryEntry,
} from "@/lib/visualizer/clientCache";

type ResolvedEntry = HistoryEntry & {
  vinylName: string;
  thumbUrl: string;
};

function whenLabel(at: number) {
  if (!at) return "Earlier";
  const days = Math.floor((Date.now() - at) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/**
 * "My designs" — every render the visitor has made, newest first, like a
 * chat history. Click one and that photo + vinyl comes straight back from
 * the cache, no re-render, no API call.
 */
export default function HistoryPanel({
  open,
  onClose,
  onPick,
  currentKey,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (entry: HistoryEntry) => void;
  /** `${hash}:${sku}` of what's on the stage, to mark it in the list */
  currentKey: string | null;
}) {
  const [entries, setEntries] = useState<ResolvedEntry[] | null>(null);

  // The page holds still while this overlay is up
  useScrollLock(open);

  // Resolve blobs fresh on every open — cheap, and never stale
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      const resolved: ResolvedEntry[] = [];
      for (const entry of await listHistory()) {
        const vinyl = getVinyl(entry.sku);
        const blob = await getRender(entry.hash, entry.sku);
        if (!vinyl || !blob) continue;
        const thumbUrl = URL.createObjectURL(blob);
        urls.push(thumbUrl);
        resolved.push({ ...entry, vinylName: vinyl.name, thumbUrl });
      }
      if (!cancelled) setEntries(resolved);
    })();
    return () => {
      cancelled = true;
      for (const url of urls) URL.revokeObjectURL(url);
      setEntries(null);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-ink/45"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="My designs"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-foreground/10 bg-background"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">
                  My designs
                </p>
                <p className="mt-1 text-sm text-foreground/50">
                  Everything you&apos;ve rendered, saved on this device.
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

            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {entries === null ? (
                <p className="text-sm text-foreground/45">Loading…</p>
              ) : entries.length === 0 ? (
                <p className="text-sm leading-relaxed text-foreground/55">
                  Nothing here yet. Upload a photo of your deck and pick a
                  vinyl, and every look you try lands in this list.
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-3">
                  {entries.map((entry) => {
                    const key = `${entry.hash}:${entry.sku}`;
                    const isCurrent = currentKey === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => onPick(entry)}
                          className={`group block w-full cursor-pointer border text-left transition-colors duration-200 ${
                            isCurrent
                              ? "border-cta"
                              : "border-foreground/15 hover:border-foreground/40"
                          }`}
                        >
                          <span className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-100">
                            {/* Cache blobs live outside the optimizer */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={entry.thumbUrl}
                              alt={`Your deck in ${entry.vinylName}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </span>
                          <span className="block px-2.5 py-2">
                            <span className="block truncate text-xs font-bold leading-tight">
                              {entry.vinylName}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-foreground/45">
                              {isCurrent
                                ? "On the stage now"
                                : whenLabel(entry.at)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
