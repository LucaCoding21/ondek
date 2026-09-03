"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SiteImage from "@/components/SiteImage";
import { STOCK_LAYOUTS } from "@/config/visualizer";
import UploadBox from "./UploadBox";

const TILE = "w-28 flex-none tablet:w-36";

function Tile({
  selected,
  label,
  onClick,
  children,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group ${TILE} cursor-pointer border text-left transition-colors duration-200 ${
        selected ? "border-cta" : "border-foreground/15 hover:border-foreground/40"
      }`}
    >
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {children}
      </span>
      <span
        className={`block truncate px-2 py-2 text-[11px] font-bold leading-tight tablet:text-xs ${
          selected ? "" : "text-foreground/70"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * The scene row under the stage: the three stock decks, then every photo
 * the visitor has uploaded, then the upload box. Picking a box is what
 * switches between our decks and theirs, so there are no mode tabs.
 *
 * Once the row is wider than the space, a pair of < > boxes page it; they
 * only appear when there is somewhere to go.
 */
export default function LayoutSwitcher({
  selectedId,
  onSelect,
  photos,
  selectedPhotoHash,
  onSelectPhoto,
  onFile,
}: {
  /** The stock scene on stage, or null when one of the visitor's photos is */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Uploaded photos, oldest first */
  photos: { hash: string; url: string }[];
  selectedPhotoHash: string | null;
  onSelectPhoto: (hash: string) => void;
  onFile: (file: File) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [pager, setPager] = useState({
    overflow: false,
    atStart: true,
    atEnd: true,
  });

  // Overflow and the ends are measured, never assumed: the observer fires
  // once on observe, and re-observing when the tile count changes picks up
  // the new scrollWidth. Only real changes reach setState.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const measure = () => {
      const overflow = strip.scrollWidth > strip.clientWidth + 1;
      const atStart = strip.scrollLeft <= 1;
      const atEnd =
        strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
      setPager((current) =>
        current.overflow === overflow &&
        current.atStart === atStart &&
        current.atEnd === atEnd
          ? current
          : { overflow, atStart, atEnd },
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    strip.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      strip.removeEventListener("scroll", measure);
    };
  }, [photos.length]);

  // Whatever is selected is always fully in view: a tile half off the
  // edge scrolls in (a fresh upload is selected, so it comes in too)
  useEffect(() => {
    const strip = stripRef.current;
    const tile = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!strip || !tile) return;
    const left = tile.offsetLeft;
    const right = left + tile.offsetWidth;
    if (left < strip.scrollLeft) {
      strip.scrollTo({ left, behavior: "smooth" });
    } else if (right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: right - strip.clientWidth, behavior: "smooth" });
    }
  }, [selectedId, selectedPhotoHash, photos.length]);

  // One tile per tap, landing on that tile's left edge: forward goes to
  // the first tile starting past the current edge, back to the last one
  // starting before it
  const page = (direction: -1 | 1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const starts = [...strip.children].map(
      (tile) => (tile as HTMLElement).offsetLeft,
    );
    const current = strip.scrollLeft;
    const target =
      direction === 1
        ? starts.find((start) => start > current + 1)
        : [...starts].reverse().find((start) => start < current - 1);
    if (target !== undefined) {
      strip.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* `relative` so the tiles' offsetLeft is measured from the strip,
          which the scroll-into-view maths above relies on. No scroll-snap:
          it would re-align the strip after that scroll and cut the
          selected tile off again. */}
      <div
        ref={stripRef}
        className="relative flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {STOCK_LAYOUTS.map((layout) => (
          <Tile
            key={layout.id}
            selected={layout.id === selectedId}
            label={layout.name}
            onClick={() => onSelect(layout.id)}
          >
            <SiteImage
              src={layout.photoPath}
              alt={layout.name}
              fill
              sizes="140px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Tile>
        ))}

        {photos.map((photo, index) => (
          <Tile
            key={photo.hash}
            selected={selectedId === null && photo.hash === selectedPhotoHash}
            label={photos.length > 1 ? `Your deck ${index + 1}` : "Your deck"}
            onClick={() => onSelectPhoto(photo.hash)}
          >
            {/* A blob: URL, outside the optimizer's reach */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt="Your deck"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Tile>
        ))}

        <UploadBox
          className={TILE}
          label={photos.length > 0 ? "Upload another" : "Upload your photo"}
          onFile={onFile}
        />
      </div>

      {pager.overflow && (
        <div className="mt-3 flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={pager.atStart}
            aria-label="Previous decks"
            className="flex size-9 cursor-pointer items-center justify-center border border-foreground/20 transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={pager.atEnd}
            aria-label="Next decks"
            className="flex size-9 cursor-pointer items-center justify-center border border-foreground/20 transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
