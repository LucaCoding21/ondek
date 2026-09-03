"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { Vinyl } from "@/config/vinyls";

/**
 * The vinyl lineup: horizontal scroll on mobile, wrapping grid from
 * tablet up. Tapping a swatch shows that vinyl on the stage (rendering it
 * first in Custom Mode). The strip stays live while a render is in
 * flight — swatches being rendered or queued carry a small spinner, and
 * ones already rendered on this photo carry a check: tapping those is
 * instant.
 */
export default function SwatchStrip({
  vinyls,
  selectedSku,
  onSelect,
  disabled = false,
  pendingSkus = [],
  renderedSkus = [],
}: {
  vinyls: Vinyl[];
  selectedSku: string;
  onSelect: (sku: string) => void;
  disabled?: boolean;
  /** Skus rendering or queued right now — marked with a spinner */
  pendingSkus?: string[];
  /** Skus with a finished render on the current photo — marked done */
  renderedSkus?: string[];
}) {
  return (
    <div
      className={`-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 tablet:mx-0 tablet:grid tablet:grid-cols-3 tablet:overflow-visible tablet:px-0 tablet:pb-0 ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {vinyls.map((vinyl) => {
        const selected = vinyl.sku === selectedSku;
        return (
          <button
            key={vinyl.sku}
            type="button"
            onClick={() => onSelect(vinyl.sku)}
            aria-pressed={selected}
            className={`group block w-24 flex-none cursor-pointer snap-start border text-left transition-colors duration-200 tablet:w-auto ${
              selected
                ? "border-cta"
                : "border-foreground/15 hover:border-foreground/40"
            }`}
          >
            <span
              className="relative block aspect-square w-full overflow-hidden"
              style={{ backgroundColor: vinyl.tone }}
            >
              <Image
                src={vinyl.swatchPath}
                alt={`${vinyl.name} vinyl swatch`}
                fill
                sizes="(max-width: 768px) 96px, 140px"
                className="object-cover"
              />
              {pendingSkus.includes(vinyl.sku) ? (
                <>
                  <span
                    aria-hidden
                    className="absolute right-1.5 top-1.5 size-4 animate-spin rounded-full border-2 border-white border-t-transparent drop-shadow"
                  />
                  <span className="sr-only">Rendering</span>
                </>
              ) : null}
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-2 text-[11px] font-bold leading-tight tablet:text-xs ${
                selected ? "" : "text-foreground/70"
              }`}
            >
              {/* Rendered on this photo: a yellow check leading the name,
                  off the swatch so it never reads as a selection */}
              {renderedSkus.includes(vinyl.sku) && (
                <>
                  <Check
                    size={13}
                    strokeWidth={3.5}
                    aria-hidden
                    className="flex-none text-cta"
                  />
                  <span className="sr-only">Rendered on your deck</span>
                </>
              )}
              <span className="min-w-0 truncate">{vinyl.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
