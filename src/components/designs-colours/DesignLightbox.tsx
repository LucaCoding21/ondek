"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { DESIGN_TAG_LABELS, type Design } from "@/lib/designs";

/**
 * Full-screen swatch viewer. Same conventions as the Ultra system's project
 * lightbox: backdrop and Esc close, arrows step, the page behind holds still.
 */
export default function DesignLightbox({
  designs,
  openAt,
  onChange,
  onClose,
}: {
  designs: Design[];
  /** Index into `designs`, or null while closed */
  openAt: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = openAt !== null;

  const step = useCallback(
    (delta: number) => {
      if (openAt === null) return;
      onChange((openAt + delta + designs.length) % designs.length);
    },
    [openAt, designs.length, onChange],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, step, onClose]);

  if (openAt === null) return null;
  const design = designs[openAt];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${design.name} vinyl pattern`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Stop the backdrop handler from firing for the controls and the
          swatch itself — only the surrounding black should close */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          step(-1);
        }}
        aria-label="Previous design"
        className="absolute left-2 sm:left-5 z-10 flex size-11 items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <svg
          className="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          step(1);
        }}
        aria-label="Next design"
        className="absolute right-2 sm:right-5 z-10 flex size-11 items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <svg
          className="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-5xl flex-col justify-center"
      >
        <div className="relative min-h-0 flex-1">
          <Image
            key={design.swatch}
            src={design.swatch}
            alt={`${design.name} vinyl decking pattern`}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-white">
          <h3 className="text-xl font-bold">{design.name}</h3>
          {design.tag && (
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cta">
              {DESIGN_TAG_LABELS[design.tag]}
            </span>
          )}
          {design.blurb && (
            <p className="text-sm text-white/60 leading-relaxed">
              {design.blurb}
            </p>
          )}
          <span className="ml-auto font-mono text-xs text-white/40">
            {openAt + 1} / {designs.length}
          </span>
        </div>
      </div>
    </div>
  );
}
