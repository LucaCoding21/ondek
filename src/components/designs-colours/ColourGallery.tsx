"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { DESIGNS, DESIGN_TAG_LABELS } from "@/lib/designs";
import SectionLabel from "@/components/SectionLabel";

/** Treated as "at the end" a few pixels early — sub-pixel widths mean
 *  scrollLeft rarely lands exactly on the maximum */
const EDGE = 8;

export default function ColourGallery() {
  const scroller = useRef<HTMLUListElement>(null);

  /** 1-based position of the leftmost card in view */
  const [index, setIndex] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // Past ~2300px the cards stop overflowing, and controls for a strip that
  // doesn't move would be a lie
  const [canScroll, setCanScroll] = useState(false);

  function measure(el: HTMLUListElement | null) {
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > EDGE);
    setAtStart(el.scrollLeft <= EDGE);
    setAtEnd(el.scrollLeft >= max - EDGE);

    // Stride from the first two cards rather than a hardcoded width plus gap —
    // both change at every breakpoint, and offsetLeft already accounts for the
    // gap and the staggered top margin
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const stride =
      first && second
        ? second.offsetLeft - first.offsetLeft
        : (first?.clientWidth ?? 1);

    setIndex(
      Math.min(Math.round(el.scrollLeft / Math.max(stride, 1)) + 1, DESIGNS.length),
    );
  }

  function step(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;

    // Roughly a screen of cards, so a click always lands on a fresh set
    el.scrollBy({
      left: el.clientWidth * 0.8 * direction,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    // The one dark stop on an otherwise white page, so the colours are read
    // against a neutral rather than against each other
    <section id="gallery" className="bg-foreground text-white">
      <div className="pt-24 lg:pt-32 pb-24 lg:pb-32">
        <SectionLabel onDark className="w-full px-5 md:px-8 lg:px-12 xl:px-16">
          All designs
        </SectionLabel>

        <Reveal className="w-full px-5 md:px-8 lg:px-12 xl:px-16">
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16 lg:items-end">
            <div>
              <h2 className="font-bold leading-[1.05] tracking-[-0.01em] text-[clamp(2.25rem,4vw,3.75rem)]">
                Every colour we print,{" "}
                <span className="lg:block">in one place.</span>
              </h2>

              {/* Deliberately short: DesignsIntro sits directly above this and
                  already covers how the colour is printed, and FreeKitCta below
                  already carries the samples ask */}
              <p className="mt-6 max-w-md text-white/60 leading-relaxed">
                {DESIGNS.length} designs, set against a dark neutral so each
                colour reads on its own.
              </p>
            </div>

            {/* The cut-off card at the right edge was the only thing saying
                the row moves, and it reads as a crop rather than an
                invitation. Buttons say it outright; the counter says how far
                through the row you are. Hard right, on the section gutter. */}
            {canScroll && (
              <div className="flex items-center gap-6 lg:justify-end">
                <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      disabled={atStart}
                      aria-label="Previous designs"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-foreground disabled:cursor-default disabled:border-white/10 disabled:bg-transparent disabled:text-white/25"
                    >
                      <svg
                        className="size-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M10 3 5 8l5 5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => step(1)}
                      disabled={atEnd}
                      aria-label="Next designs"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-foreground disabled:cursor-default disabled:border-white/10 disabled:bg-transparent disabled:text-white/25"
                    >
                      <svg
                        className="size-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="m6 3 5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                </div>

                {/* Counter dropped from the design, kept for screen readers:
                    it is the only thing that says the position changed */}
                <p aria-live="polite" className="sr-only">
                  Design {index} of {DESIGNS.length}
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* A strip rather than a grid: the cards keep the section's gutter on
            the left and run past the right edge, so the cut-off card is what
            says there is more to scroll. Card widths are in vw so the row
            stays wider than the screen — it only stops overflowing past
            ~2300px, where the max-w cap takes over and five cards fit. */}
        <Reveal stagger=".design-card" className="mt-14 lg:mt-20">
          {/* Focusable because the scrollbar is hidden — without it the strip
              is unreachable by keyboard. Measured through the ref callback
              rather than an effect, so the controls are correct on first
              paint without a setState-on-mount. */}
          <ul
            ref={(node) => {
              scroller.current = node;
              measure(node);
            }}
            onScroll={(event) => measure(event.currentTarget)}
            tabIndex={0}
            aria-label="All designs"
            className="flex snap-x gap-4 md:gap-6 overflow-x-auto px-5 md:px-8 lg:px-12 xl:px-16 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {DESIGNS.map((design, i) => (
              <li
                key={design.slug}
                id={design.slug}
                // Anchor target for the spec table in DesignsIntro — jumping
                // here scrolls the strip to the card as well as the page
                className={`design-card group scroll-mt-32 w-[72vw] max-w-[26rem] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[26vw] ${
                  // Stepped down on every other card so the row reads as a
                  // staggered strip rather than a grid row
                  i % 2 === 1 ? "lg:mt-20" : ""
                }`}
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden"
                  style={{ backgroundColor: design.tone }}
                >
                  <Image
                    src={design.swatch}
                    alt={`${design.name} vinyl decking pattern`}
                    fill
                    sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 72vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {design.tag && (
                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] ${
                        // Yellow is for the colours you can order today
                        design.tag === "sold-out" ||
                        design.tag === "coming-soon"
                          ? "bg-background text-foreground"
                          : "bg-cta text-foreground"
                      }`}
                    >
                      {/* The yellow badge carries the emphasis — only sold-out needs a dot */}
                      {design.tag === "sold-out" && (
                        <span className="size-1.5 rounded-full bg-foreground/30" />
                      )}
                      {DESIGN_TAG_LABELS[design.tag]}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-bold leading-tight">
                  {design.name}
                </h3>
                {design.blurb && (
                  <p className="mt-1.5 text-sm text-white/55 leading-relaxed">
                    {design.blurb}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
