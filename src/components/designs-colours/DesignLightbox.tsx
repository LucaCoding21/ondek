"use client";

import Image from "@/components/SiteImage";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DESIGN_TAG_LABELS, type Design } from "@/lib/designs";

/**
 * One swatch in the viewer. The active one and its two neighbours stay
 * mounted, so by the time an arrow is pressed the next image is already
 * loaded and the step animation never waits on the network. The wrapper's
 * visibility is driven by GSAP in the parent; the inner fade only covers
 * the not-yet-loaded case. `placeholder="empty"` skips SiteImage's blur
 * tile — it fills the whole frame, not the photo's contained shape, which
 * is what used to flash on every step.
 */
function LightboxImage({ design }: { design: Design }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={design.swatch}
      alt={`${design.name} vinyl decking pattern`}
      fill
      sizes="100vw"
      placeholder="empty"
      onLoad={() => setLoaded(true)}
      className={`object-contain transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

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

  /** Swatch wrappers by slug, for the step animation */
  const tileEls = useRef<Record<string, HTMLDivElement | null>>({});
  const captionRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (openAt === null) return;
      onChange((openAt + delta + designs.length) % designs.length);
    },
    [openAt, designs.length, onChange],
  );

  // The step transition: a plain crossfade — the outgoing swatch fades under
  // the incoming one, the caption fades with it. Neighbours are already
  // mounted and loaded, so this never races the network.
  useEffect(() => {
    if (openAt === null) {
      prevIndexRef.current = null;
      return;
    }

    const prev = prevIndexRef.current;
    prevIndexRef.current = openAt;

    const activeSlug = designs[openAt].slug;
    const outgoingSlug =
      prev !== null && prev !== openAt ? designs[prev].slug : null;
    const incoming = tileEls.current[activeSlug];
    if (!incoming) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    for (const [slug, el] of Object.entries(tileEls.current)) {
      if (!el || slug === activeSlug) continue;
      if (slug === outgoingSlug && !reduce) {
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.set(el, { autoAlpha: 0, overwrite: "auto" });
      }
    }

    gsap.fromTo(
      incoming,
      { autoAlpha: reduce ? 1 : 0 },
      {
        autoAlpha: 1,
        duration: reduce ? 0 : 0.45,
        ease: "power2.inOut",
        overwrite: "auto",
      },
    );

    if (captionRef.current && !reduce) {
      gsap.fromTo(
        captionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.inOut", overwrite: "auto" },
      );
    }
  }, [openAt, designs]);

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

  // Active swatch plus its neighbours, deduped for tiny lists. Keyed by
  // slug below, so a neighbour that becomes active keeps its loaded state.
  const mounted = [
    ...new Set([
      openAt,
      (openAt + 1) % designs.length,
      (openAt - 1 + designs.length) % designs.length,
    ]),
  ];

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
        {/* Wrappers start invisible; the effect above fades the active one
            in over the outgoing one. */}
        <div className="relative min-h-0 flex-1">
          {mounted.map((i) => (
            <div
              key={designs[i].slug}
              ref={(el) => {
                tileEls.current[designs[i].slug] = el;
              }}
              className="absolute inset-0 opacity-0"
            >
              <LightboxImage design={designs[i]} />
            </div>
          ))}
        </div>

        <div
          ref={captionRef}
          className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-white"
        >
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
