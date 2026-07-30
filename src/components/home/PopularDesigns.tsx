"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DESIGN_TAG_LABELS, FEATURED_DESIGNS } from "@/lib/designs";

// TODO: geo-gate this section (show region-specific designs)
export default function PopularDesigns() {
  const [active, setActive] = useState(0);
  // Showroom metaphor: the customer looks at the deck while holding a sample
  // chip. Clicking the chip swaps roles — pattern goes full-frame, deck
  // shrinks into the chip.
  const [closeUp, setCloseUp] = useState(false);

  const activeDesign = FEATURED_DESIGNS[active];

  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal>
          <h2 className="font-bold leading-[1.1] text-[clamp(2.25rem,3.4vw,3rem)]">
            Popular designs
          </h2>
        </Reveal>

        <Reveal className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 lg:gap-16 2xl:gap-24 items-stretch">
          {/* Showroom image — scene and pattern layers all stay mounted so
              every swap (colour or zoom) is an instant crossfade. The whole
              photo toggles between deck scene and full-frame pattern. */}
          <button
            type="button"
            onClick={() => setCloseUp((v) => !v)}
            aria-pressed={closeUp}
            aria-label={
              closeUp
                ? `${activeDesign.name} — back to deck view`
                : `${activeDesign.name} — see the pattern up close`
            }
            className="relative block w-full aspect-[4/3] lg:aspect-[3/2] 2xl:aspect-[16/9] overflow-hidden cursor-pointer"
            style={{ backgroundColor: activeDesign.tone }}
          >
            {FEATURED_DESIGNS.map((design, i) => (
              <Image
                key={`scene-${design.slug}`}
                src={design.scene ?? design.swatch}
                alt={i === active && !closeUp ? `${design.name} vinyl decking` : ""}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={`object-cover transition-opacity duration-500 ${
                  i === active && !closeUp ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {FEATURED_DESIGNS.map((design, i) => (
              <Image
                key={`pattern-${design.slug}`}
                src={design.swatch}
                alt={i === active && closeUp ? `${design.name} pattern close-up` : ""}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={`object-cover transition-opacity duration-500 ${
                  i === active && closeUp ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            <span className="absolute top-4 left-4 bg-background/90 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              {activeDesign.name}
              {closeUp && " — Pattern"}
            </span>

            <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/90 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              {closeUp ? "View deck" : "View pattern"}
              <svg
                className="size-2.5 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 6V2h4M14 10v4h-4M2 2l5 5M14 14L9 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>

          {/* Colour menu */}
          <div className="flex flex-col">
            <ul className="flex-1 flex flex-col justify-center">
              {FEATURED_DESIGNS.map((design, i) => (
                <li key={design.slug} className="border-b border-foreground/10">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={`group flex w-full items-center gap-4 md:gap-5 py-4 md:py-5 2xl:py-7 px-4 -mx-4 text-left transition-colors duration-300 ${
                      i === active ? "bg-surface" : "hover:bg-surface/50"
                    }`}
                  >
                    {/* Swatch thumb — all four colours stay visible at a glance */}
                    <span
                      className={`relative size-14 md:size-16 2xl:size-20 shrink-0 overflow-hidden transition-opacity duration-300 ${
                        i === active ? "" : "opacity-60 group-hover:opacity-90"
                      }`}
                      style={{ backgroundColor: design.tone }}
                    >
                      <Image
                        src={design.swatch}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span
                          className={`font-bold text-xl md:text-2xl 2xl:text-3xl leading-tight transition-colors duration-300 ${
                            i === active
                              ? "text-foreground"
                              : "text-foreground/40 group-hover:text-foreground/70"
                          }`}
                        >
                          {design.name}
                        </span>
                        {design.tag && (
                          <span
                            className={`flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${
                              design.tag === "sold-out"
                                ? "text-foreground/40"
                                : "text-foreground/70"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                design.tag === "sold-out"
                                  ? "bg-foreground/30"
                                  : "bg-cta"
                              }`}
                            />
                            {DESIGN_TAG_LABELS[design.tag]}
                          </span>
                        )}
                      </span>

                      {/* Blurb unfolds on the active row */}
                      {design.blurb && (
                        <span
                          className="grid transition-[grid-template-rows] duration-300 ease-out"
                          style={{
                            gridTemplateRows: i === active ? "1fr" : "0fr",
                          }}
                        >
                          <span className="block overflow-hidden">
                            <span
                              className={`block pt-1 text-sm 2xl:text-base text-foreground/60 transition-opacity duration-300 ${
                                i === active ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              {design.blurb}
                            </span>
                          </span>
                        </span>
                      )}
                    </span>

                    <svg
                      className={`size-4 shrink-0 text-cta transition-all duration-300 ${
                        i === active
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2"
                      }`}
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M4 12L12 4M12 4H6M12 4V10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-10 lg:mt-0 lg:pt-8">
              <Link
                href="/vinyl-decking/designs-colours"
                className="inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                View all designs & colours
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
