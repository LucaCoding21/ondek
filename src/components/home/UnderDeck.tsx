"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "@/components/SiteImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import StatCounter from "@/components/animations/StatCounter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Placed as a staircase on lg — 01/02 across the top, 03/04 stepped one column
// right and one row down — so the four read in order rather than as a block.
const STATS = [
  {
    title: "Outdoor space",
    label: "Usable outdoor space when the underside stays dry",
    value: "2×",
    target: null,
    place: "lg:col-start-1 lg:row-start-1",
    art: "/images/under-deck-living.webp",
    // Mirrored so the deck opens back toward the card
    artClass: "left-1/4 top-[42%] w-[122%] -scale-x-100",
  },
  {
    title: "Waterproof",
    label: "Waterproof membrane, not water-resistant",
    value: "100%",
    target: 100,
    place: "lg:col-start-2 lg:row-start-1",
    art: null,
    artClass: null,
  },
  {
    title: "Year warranty",
    label: "15 year waterproofing, 5 year appearance",
    value: "15/5",
    target: null,
    place: "lg:col-start-2 lg:row-start-2",
    art: null,
    artClass: null,
  },
  {
    title: "Installed",
    label: "Square feet of membrane installed",
    value: "3M",
    target: null,
    place: "lg:col-start-3 lg:row-start-2",
    art: "/images/deck-edge-detail.webp",
    artClass: "left-[32%] top-[52%] w-full",
  },
];

export default function UnderDeck() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the hero and Design kit, kept consistent on purpose.
        gsap.from(".ud-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".ud-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Copy then link, following the heading through.
        gsap.from(".ud-copy > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".ud-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The tweens sit on the cards, never the art inside — the drawings
        // carry their own class transforms (-translate-y-1/2, -scale-x-100).
        // Each StatCounter self-observes, so the count-ups stay untouched.
        gsap.from(".underdeck-stat", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".ud-stats",
            start: "top 82%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-foreground text-white">
      {/* Runs wider than UltraSystem above it (100rem) by request — the cap is
          still here so the headline and copy keep sane line lengths on very
          large displays rather than running full-bleed. */}
      <div className="mx-auto w-full max-w-[110rem] px-5 md:px-8 lg:px-12 xl:px-16 py-28 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="lg:pt-2">
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="ud-heading max-w-xl text-4xl sm:text-5xl font-bold leading-[1.05]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ud-heading-line block">Extend your outdoor</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ud-heading-line block">
                  living space
                </span>
              </span>
            </h2>
            <div className="ud-copy">
              <p className="mt-6 max-w-sm text-sm text-white/60 leading-relaxed">
                The membrane keeps the space beneath a second-story deck dry
                all year, turning underused space into a protected outdoor
                living area.
              </p>
              <Link
                href="/why-vinyl#under-deck"
                className="mt-6 inline-block text-sm font-bold border-b-2 border-cta pb-0.5 hover:border-white transition-colors"
              >
                See under-deck living ideas
              </Link>
            </div>
          </div>

          <div
            // Dropped below the headline's line rather than aligned to it —
            // the offset is on the stats alone so the copy column stays put
            className="ud-stats grid gap-4 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:grid-rows-2"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`underdeck-stat relative flex min-h-44 flex-col justify-between gap-8 overflow-hidden bg-background p-6 text-foreground sm:aspect-square ${stat.place}`}
              >
                {stat.art && (
                  // Sits in the empty middle band, offset right so its right
                  // edge lands past the card's, which overflow-hidden clips.
                  // The two drawings differ in shape, so anything specific to
                  // one of them rides along in artClass.
                  <Image
                    src={stat.art}
                    alt=""
                    width={900}
                    height={522}
                    className={`pointer-events-none absolute max-w-none -translate-y-1/2 opacity-90 ${
                      stat.artClass ?? ""
                    }`}
                  />
                )}

                <span className="relative text-4xl font-bold leading-none">
                  {stat.target === null ? (
                    stat.value
                  ) : (
                    <StatCounter
                      target={stat.target}
                      finalText={stat.value}
                      delay={200 + i * 120}
                    />
                  )}
                </span>

                <span className="relative">
                  <span className="block text-sm font-bold">{stat.title}</span>
                  <span className="mt-1.5 block text-xs text-foreground/60 leading-snug">
                    {stat.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
