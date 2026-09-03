"use client";

import SiteImage from "@/components/SiteImage";
import { STOCK_LAYOUTS } from "@/config/visualizer";

/** The three stock deck scenes, a thumbnail row under the stage */
export default function LayoutSwitcher({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {STOCK_LAYOUTS.map((layout) => {
        const selected = layout.id === selectedId;
        return (
          <button
            key={layout.id}
            type="button"
            onClick={() => onSelect(layout.id)}
            aria-pressed={selected}
            className={`group w-28 flex-none cursor-pointer border text-left transition-colors duration-200 tablet:w-36 ${
              selected
                ? "border-cta"
                : "border-foreground/15 hover:border-foreground/40"
            }`}
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden">
              <SiteImage
                src={layout.photoPath}
                alt={layout.name}
                fill
                sizes="140px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span
              className={`block truncate px-2 py-2 text-[11px] font-bold leading-tight tablet:text-xs ${
                selected ? "" : "text-foreground/70"
              }`}
            >
              {layout.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
