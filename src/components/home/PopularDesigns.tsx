"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DESIGN_TAG_LABELS, FEATURED_DESIGNS } from "@/lib/designs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COUNT = FEATURED_DESIGNS.length;

const mod = (n: number, m: number) => ((n % m) + m) % m;

// Five copies of the set. Two jobs: there are always cards spilling off both
// edges whichever design is centred, and stepping past either end of the home
// copy lands on a real card instead of a wall.
//
// Five rather than three because a slide interrupted by another click never
// fires transitionend, so the snap-back is deferred. Clicking faster than the
// animation used to walk the position clean off the end of a three-copy
// track, at which point no slot matched and the whole row went centre-less.
const COPIES = 5;
const HOME = Math.floor(COPIES / 2) * COUNT; // first slot of the middle copy
const TRACK = Array.from(
  { length: COPIES * COUNT },
  (_, i) => FEATURED_DESIGNS[mod(i, COUNT)],
);
const TRACK_CENTER = (TRACK.length - 1) / 2;

// Every card is the same portrait shape; distance from centre only changes how
// much of its slot it fills. Slot width stays fixed so the slide stays a
// single uniform pitch.
// Applied as a scale, not a width. Same result on screen, but width would
// force a layout pass on every frame of the slide for all twelve cards;
// transform and opacity are the only two properties the compositor can
// animate on its own.
const SCALES = [1, 0.76, 0.56];

// Vertical offset per distance, in card widths. Driven by distance rather
// than slot parity: parity was alternating up/down by roughly the amount the
// centred boxes already differ in height, which cancelled out and left the
// outer cards sharing a top edge with the card beside them.
const Y_OFFSETS = [0, -0.02, 0.07];

// Slots are a uniform width so the slide stays one clean pitch, which leaves
// the small outer cards floating in the middle of their slot — a gap far
// wider than the one beside the centre card. Each step past the first
// neighbour is pulled back towards the centre by this fraction of a card,
// which evens the spacing out without touching the slide maths.
const PULL_PER_STEP = 0.19;

const EXPO_OUT = "cubic-bezier(0.16,1,0.3,1)";

// TODO: geo-gate this section (show region-specific designs)
export default function PopularDesigns() {
  // Position in TRACK, not in FEATURED_DESIGNS — it's allowed to step one
  // place outside the middle copy and gets snapped back after the slide.
  const [pos, setPos] = useState(HOME);
  // Showroom metaphor: the customer looks at the deck, then leans in to the
  // sample chip. Clicking the centred card swaps the scene for the pattern.
  const [closeUp, setCloseUp] = useState(false);
  // Which slot the pointer is over, not what the cursor should say. Storing
  // the label directly left it stale: after a step the row moves under a
  // stationary pointer, so the card changes role without any mouse event to
  // announce it, and the circle kept reading "Next" over the centre card.
  const [hovered, setHovered] = useState<number | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Entrance: the heading rises out of its mask, then the cards fan open
  // from the centre outward, then the details bar and controls settle in.
  // One sequence, once, on first scroll into view. The tweens touch the
  // card BUTTONS, never the inner spans — those carry the carousel's own
  // per-frame transforms and must stay untouched.
  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            once: true,
          },
        });

        tl.from(
          ".pd-heading-line",
          { yPercent: 115, duration: 1, ease: "power4.out" },
          0,
        )
          .from(".pd-sub", { y: 24, opacity: 0, duration: 0.8 }, 0.2)
          .from(
            ".design-card",
            {
              y: 70,
              opacity: 0,
              duration: 0.9,
              // Fans open from the centred slot outward
              stagger: { each: 0.07, from: HOME },
            },
            0.25,
          )
          .from(".pd-bar", { y: 24, opacity: 0, duration: 0.7 }, 0.8)
          .from(
            ".pd-controls > *",
            { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 },
            0.95,
          )
          .from(".pd-more", { opacity: 0, duration: 0.5 }, 1.1);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const active = mod(pos, COUNT);
  const activeDesign = FEATURED_DESIGNS[active];

  const roleOf = (slot: number) =>
    slot === pos
      ? { label: closeUp ? "View deck" : "View pattern", accent: false }
      : { label: slot < pos ? "Prev" : "Next", accent: true };

  const cursor = hovered === null ? null : roleOf(hovered);

  const step = (delta: number) => {
    setPos((p) => p + delta);
    // A different deck always opens on its scene, never mid-zoom
    setCloseUp(false);
  };

  /** Dots jump by the shortest way round rather than rewinding the track. */
  const select = (i: number) => {
    const half = Math.floor(COUNT / 2);
    step(mod(i - active + half, COUNT) - half);
  };

  // The track repeats every COUNT cards, so shifting the position by whole
  // copies is invisible — as long as the transition is off for that one
  // frame. This is what keeps the loop seamless in both directions.
  const normalize = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    if (pos >= HOME && pos < HOME + COUNT) return;

    const el = trackRef.current;
    if (!el) return;

    // Loop rather than a single ±COUNT: an interrupted run of clicks can
    // leave the position more than one copy out, and one subtraction would
    // land it still outside — and then never fire another transitionend.
    let next = pos;
    while (next < HOME) next += COUNT;
    while (next >= HOME + COUNT) next -= COUNT;
    const shift = next - pos;

    // flushSync, not requestAnimationFrame. React is free to defer a normal
    // update, and if the new transform landed after the transition had been
    // handed back, the snap animated — the row visibly slid a whole copy
    // backwards. This pins the order: kill the transitions, apply the jump
    // synchronously, force the style recalc, then restore.
    //
    // The data attribute silences EVERY transition inside the row, not just
    // the track's own slide. Zeroing only the track was the seam glitch:
    // the row jumped a copy instantly while each card's inner span still
    // animated to the scale/opacity its new distance demands — so landing
    // across the seam made the centre card visibly grow out of a flank
    // card's size instead of arriving there.
    el.setAttribute("data-snapping", "");
    flushSync(() => {
      setPos(next);
      // The row jumps a whole copy under a stationary pointer, so the slot
      // being hovered has to move with it or the cursor label goes wrong.
      setHovered((h) => (h === null ? null : h + shift));
    });
    void el.offsetWidth;
    el.removeAttribute("data-snapping");
  };

  // Written straight to the node, never through state — the circle has to be
  // at the pointer on the same frame it becomes visible, or it reads as
  // sliding in from wherever it was last (the origin, on a first hover).
  const trackCursor = (e: React.MouseEvent) => {
    const el = cursorRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  };

  /** Position first, then reveal — order matters on the first hover. */
  const showCursor = (e: React.MouseEvent, slot: number) => {
    trackCursor(e);
    setHovered(slot);
  };

  return (
    <section ref={sectionRef} className="bg-background overflow-clip">
      <style>{`
        @keyframes design-caption-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        .design-caption { animation: design-caption-in 0.5s ${EXPO_OUT} both; }

        /* The follow cursor is a pointing-device affordance. On touch and on
           keyboard the native cursor has to stay put. */
        @media (hover: hover) and (pointer: fine) {
          .design-card { cursor: none; }
        }
        @media not all and (hover: hover) and (pointer: fine) {
          .design-cursor { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .design-caption { animation: none; }
        }

        /* One-frame kill switch for the seam snap — set on the track while
           the copy-jump is applied so nothing inside animates the jump. */
        [data-snapping], [data-snapping] * { transition-duration: 0s !important; }
      `}</style>

      {/* Follows the pointer across the carousel and names the click */}
      <div
        ref={cursorRef}
        aria-hidden
        // Only opacity and scale transition — never transform, which carries
        // the pointer position and must land instantly.
        className={`design-cursor pointer-events-none fixed left-0 top-0 z-40 flex size-[5.5rem] items-center justify-center rounded-full px-3 text-center text-[0.62rem] font-bold uppercase leading-tight tracking-[0.12em] text-foreground transition-[opacity,scale,background-color] duration-150 ease-out will-change-transform ${
          cursor?.accent ? "bg-cta" : "bg-white"
        } ${cursor ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {cursor?.label}
      </div>

      <div className="pt-24 pb-20 lg:pt-32 lg:pb-28">
        <h2 className="px-5 text-center font-bold leading-[1.1] tracking-[-0.02em] text-balance text-[clamp(2.25rem,3.4vw,3rem)]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="pd-heading-line block">Our best-sellers</span>
          </span>
        </h2>
        <p className="pd-sub mx-auto mt-5 max-w-3xl px-5 text-center text-base md:text-lg leading-relaxed text-foreground/60 text-balance">
          Our most popular vinyl membrane styles, chosen for durability, colour
          consistency, and proven performance in real-world installs.
        </p>

        {/* Arrow keys work anywhere inside, so the cards and the dots below
            share one keyboard model. */}
        <div
          onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              step(e.key === "ArrowRight" ? 1 : -1);
            }}
          >
            {/* Viewport — cards spill past both edges and get clipped, so the
                flanks only ever peek in. */}
            <div
              // overflow-clip, not overflow-hidden. `hidden` still makes this
              // a scroll container, and clicking a card that hangs off the
              // edge made the browser scroll it into view — the row lurched a
              // second time, right after the slide, looking like the
              // transition ran twice. `clip` never scrolls.
              className="relative mt-14 lg:mt-20 overflow-clip"
              onMouseEnter={trackCursor}
              onMouseMove={trackCursor}
              onMouseLeave={() => setHovered(null)}
              style={
                {
                  "--card": "clamp(18rem, 34vw, 32rem)",
                  "--gap": "clamp(0.25rem, 0.6vw, 0.6rem)",
                  // Row height is the centre card's full portrait height, so
                  // nothing reflows as the smaller flanks slide through.
                  "--h": "calc(var(--card) * 4 / 3)",
                } as React.CSSProperties
              }
            >
              <div
                ref={trackRef}
                onTransitionEnd={normalize}
                className="flex items-center justify-center gap-[var(--gap)] transition-transform duration-700"
                style={{
                  transitionTimingFunction: EXPO_OUT,
                  transform: `translateX(calc(${TRACK_CENTER - pos} * (var(--card) + var(--gap))))`,
                }}
              >
                {TRACK.map((design, i) => {
                  const isActive = i === pos;
                  const before = i < pos;
                  const distance = Math.abs(i - pos);
                  // Name the thing the click will show. A bare "View" read as
                  // a link to a page, which this isn't — it swaps the centre
                  // card between the deck scene and the pattern.
                  return (
                    <button
                      // Duplicated designs need a key unique to their position
                      key={`${design.slug}-${i}`}
                      type="button"
                      // A flank card steps one place towards it — it doesn't
                      // jump to that particular copy.
                      onClick={() =>
                        isActive ? setCloseUp((v) => !v) : step(before ? -1 : 1)
                      }
                      // Focus by hand with preventScroll. The default focus a
                      // click brings scrolls the card into view, and these
                      // cards are taller than the viewport and hang off both
                      // edges — so the page jumped on every click. Focus
                      // still lands, so arrow keys keep working after one.
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.currentTarget.focus({ preventScroll: true });
                      }}
                      onMouseEnter={(e) => showCursor(e, i)}
                      // The outer copies are scenery; only the live card and
                      // its immediate neighbours announce themselves.
                      aria-hidden={distance > 1 ? true : undefined}
                      tabIndex={distance > 1 ? -1 : undefined}
                      aria-pressed={isActive ? closeUp : undefined}
                      aria-label={
                        isActive
                          ? closeUp
                            ? `${design.name}, back to the deck view`
                            : `${design.name}, see the pattern up close`
                          : before
                            ? "Previous design"
                            : "Next design"
                      }
                      className="design-card relative flex h-[var(--h)] w-[var(--card)] shrink-0 cursor-pointer items-center justify-center outline-none"
                    >
                      {/* Fixed portrait shape at every size; distance only
                          scales it down. Translate before scale, so the pull
                          and drop stay in unscaled units. */}
                      <span
                        className={`relative block w-full overflow-hidden transition-[transform,opacity] duration-700 will-change-transform ${
                          isActive ? "opacity-100" : "opacity-55"
                        }`}
                        style={{
                          aspectRatio: "3 / 4",
                          transform: `translateX(calc(var(--card) * ${(
                            Math.max(0, distance - 1) *
                            PULL_PER_STEP *
                            (before ? 1 : -1)
                          ).toFixed(3)})) translateY(calc(var(--card) * ${
                            Y_OFFSETS[Math.min(distance, Y_OFFSETS.length - 1)]
                          })) scale(${
                            SCALES[Math.min(distance, SCALES.length - 1)]
                          })`,
                          transitionTimingFunction: EXPO_OUT,
                          backgroundColor: design.tone,
                        }}
                      >
                        <Image
                          src={design.scene ?? design.swatch}
                          alt={
                            isActive && !closeUp
                              ? `${design.name} vinyl decking`
                              : ""
                          }
                          fill
                          sizes="(min-width: 1024px) 34vw, 80vw"
                          // Never lazy. The snap-back swaps the row onto a
                          // different set of DOM slots, and any slot whose
                          // image hadn't loaded yet flashed empty — which is
                          // what made a step look like a reload. It costs
                          // nothing: all COPIES copies share the same handful
                          // of URLs, so the browser serves them from cache.
                          loading="eager"
                          // The two layers drift in opposite directions as
                          // they cross, so the swap reads as a move in rather
                          // than a straight dissolve.
                          className={`object-cover transition-[opacity,scale] duration-500 ease-out ${
                            isActive && closeUp
                              ? "opacity-0 scale-105"
                              : "opacity-100 scale-100"
                          }`}
                        />
                        {/* The pattern layer stays mounted on the centre card
                            and its neighbours, so zooming is an instant
                            crossfade rather than a fetch. Loading it for all
                            twelve track slots would not be. */}
                        {distance <= 1 && (
                          <Image
                            src={design.swatch}
                            alt={
                              isActive && closeUp
                                ? `${design.name} pattern close-up`
                                : ""
                            }
                            fill
                            sizes="(min-width: 1024px) 34vw, 80vw"
                            loading="eager"
                            className={`object-cover transition-[opacity,scale] duration-500 ease-out ${
                              isActive && closeUp
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95"
                            }`}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Details bar, sitting on the bottom of the centred image.
                  It lives outside the card buttons rather than inside them —
                  a link nested in a button is invalid and unreachable by
                  keyboard. */}
              <div
                className="pd-bar pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-2 pb-2.5"
                aria-live="polite"
              >
                <div
                  key={activeDesign.slug}
                  className="design-caption w-[min(100%,calc(var(--card)*0.95))]"
                >
                  {/* Rides above the bar, clear of it, rather than squeezing
                      into the name row */}
                  {activeDesign.tag && (
                    <span
                      className={`mb-2 inline-block px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] ${
                        activeDesign.tag === "sold-out"
                          ? "bg-foreground/75 text-background"
                          : "bg-cta text-foreground"
                      }`}
                    >
                      {DESIGN_TAG_LABELS[activeDesign.tag]}
                    </span>
                  )}

                  <Link
                    href="/vinyl-decking/designs-colours"
                    // Stop the follow cursor sitting stale over the bar
                    onMouseEnter={() => setHovered(null)}
                    className="group pointer-events-auto flex w-full items-center gap-4 bg-background/95 p-3.5 backdrop-blur-sm transition-colors hover:bg-background"
                  >
                    {/* Pattern chip — the design itself, not the deck scene */}
                    <span
                      className="relative size-14 shrink-0 overflow-hidden"
                      style={{ backgroundColor: activeDesign.tone }}
                    >
                      <Image
                        src={activeDesign.swatch}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>

                    {/* The tag lives on the photo now, so this is just name
                      over description — no third thing competing for the row */}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-bold leading-tight">
                        {activeDesign.name}
                      </span>
                      {activeDesign.blurb && (
                        <span className="mt-1 line-clamp-2 block text-[0.8rem] leading-snug text-foreground/60">
                          {activeDesign.blurb}
                        </span>
                      )}
                    </span>

                    {/* Divider, then the arrow hard against the right edge */}
                    <span className="h-10 w-px shrink-0 bg-foreground/10" />
                    <span className="shrink-0 pr-0.5 text-foreground/50 transition-colors group-hover:text-foreground">
                      <svg
                        className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M4 12L12 4M12 4H6M12 4V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Prev / dots / next — the track loops, so neither end runs out */}
            <div className="pd-controls mt-10 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous design"
                className="p-2 text-foreground/50 transition-colors hover:text-foreground outline-none"
              >
                <svg
                  className="size-6 rotate-180"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 3.5L10.5 8L6 12.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2.5">
                {FEATURED_DESIGNS.map((design, i) => (
                  <button
                    key={design.slug}
                    type="button"
                    onClick={() => select(i)}
                    aria-label={`Show ${design.name}`}
                    aria-current={i === active}
                    className={`h-1.5 transition-all duration-500 outline-none ${
                      i === active
                        ? "w-8 bg-cta"
                        : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next design"
                className="p-2 text-foreground/50 transition-colors hover:text-foreground outline-none"
              >
                <svg
                  className="size-6"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 3.5L10.5 8L6 12.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="pd-more mt-10 text-center">
              <Link
                href="/vinyl-decking/designs-colours"
                className="inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                View all designs & colours
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
