"use client";

import Image from "@/components/SiteImage";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A comparison has to be comparable: all three materials stay on screen
// together, and the criteria run as rows so you read across, not scroll back.
// No cards — hairline rules and whitespace do the separating, and vinyl is
// marked by a CTA keyline and full-strength type rather than a coloured box.
// Vinyl leads: the answer first, then what it's being measured against.
const MATERIALS = [
  {
    key: "vinyl",
    name: "Vinyl",
    eyebrow: "OnDek membrane",
    src: "/images/materials/vinyl.webp",
    alt: "One continuous sheet of vinyl membrane, unbroken across the whole surface",
    winner: true,
  },
  {
    key: "wood",
    name: "Wood",
    eyebrow: "Cedar / pressure-treated",
    src: "/images/materials/wood.webp",
    alt: "Three wood deck boards laid side by side with gaps between them",
    winner: false,
  },
  {
    key: "composite",
    name: "Composite",
    eyebrow: "Capped composite",
    src: "/images/materials/composite.webp",
    alt: "Three hollow-core composite deck boards laid side by side with gaps between them",
    winner: false,
  },
] as const;

type Key = (typeof MATERIALS)[number]["key"];

const CRITERIA: { label: string; values: Record<Key, string> }[] = [
  // The structural difference comes first: every row under it follows from
  // whether the deck is separate boards or one sheet.
  {
    label: "The surface itself",
    values: {
      wood: "Separate boards",
      composite: "Separate boards",
      vinyl: "One continuous sheet",
    },
  },
  {
    label: "Where the water goes",
    values: {
      wood: "Between the boards",
      composite: "Between the boards",
      vinyl: "Sheds to the edge",
    },
  },
  {
    label: "Upkeep",
    values: {
      wood: "Reseal every 1 to 3 years",
      composite: "Wash occasionally",
      vinyl: "Soap and water",
    },
  },
  {
    label: "The space below",
    values: {
      wood: "Takes the runoff",
      composite: "Takes the runoff",
      vinyl: "Stays dry",
    },
  },
  {
    label: "Surface warranty",
    values: {
      wood: "None",
      composite: "Varies by brand",
      vinyl: "15 years waterproof",
    },
  },
];

/** Label column, then the three materials. Rows use lg:contents so every
    cell joins this same grid and the criteria line up across columns. */
const ROW =
  "lg:grid lg:grid-cols-[minmax(0,0.7fr)_repeat(3,minmax(0,1fr))] lg:gap-10";

export default function MaterialComparison() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the rest of the site.
        gsap.from(".mc-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".mc-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".mc-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".mc-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The three material columns arrive left to right, then the criteria
        // rows settle in beneath them in reading order.
        gsap.from(".mc-col", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".mc-table",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".mc-row", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".mc-rows",
            start: "top 88%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-14 lg:pt-20 pb-36 lg:pb-52">
        {/* Title hard right, table bottom left — the two blocks sit on a
            diagonal. Right-aligned from lg so both edges land on the page
            gutter; left-aligned copy in a right-pushed block leaves a ragged
            edge that reads as a mistake rather than a choice. */}
        <div className="lg:text-right lg:mr-[3%] xl:mr-[5%]">
          {/* Split where the thought breaks, each line in its own mask. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h2 className="mc-heading max-w-4xl lg:ml-auto text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="mc-heading-line block">Vinyl, wood,</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="mc-heading-line block">and composite</span>
            </span>
          </h2>
          <p className="mc-sub mt-6 max-w-xl lg:ml-auto text-lg text-foreground/60 leading-relaxed">
            Wood and composite decks drain between the boards. A vinyl
            membrane stops water at the surface, before it reaches the
            structure below.
          </p>
        </div>

        {/* Centred under the right-hand title block */}
        <div className="mc-table mt-14 lg:mt-20 max-w-[92rem] lg:mx-auto">
          {/* Header: the drawing and the name, kept near the size the art was
              drawn for rather than blown up to fill a column */}
          <div className={`grid grid-cols-3 gap-5 sm:gap-8 ${ROW}`}>
            <div className="hidden lg:block" aria-hidden />
            {MATERIALS.map(({ key, name, eyebrow, src, alt, winner }) => (
              <div
                key={key}
                className={`mc-col pt-5 ${
                  winner
                    ? "border-t-4 border-cta"
                    : "border-t border-foreground/20"
                }`}
              >
                {/* Line art on white — the losers are dimmed rather than
                    recoloured, since these are images now, not currentColor */}
                <Image
                  src={src}
                  alt={alt}
                  width={900}
                  height={600}
                  sizes="(min-width: 1024px) 260px, 33vw"
                  className={`w-full h-auto max-w-[260px] ${
                    winner ? "" : "opacity-60"
                  }`}
                />
                <p
                  className={`mt-5 text-2xl sm:text-3xl font-bold tracking-[-0.01em] ${
                    winner ? "" : "text-foreground/70"
                  }`}
                >
                  {name}
                </p>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.12em] text-foreground/40">
                  {eyebrow}
                </p>
              </div>
            ))}
          </div>

          {/* Criteria as rows — read across the three, not down one */}
          {/* Plain divs, not dl/dt/dd — the value cells use lg:contents to join
              the header's grid, and display:contents can drop dd semantics.
              Each value carries its material name for screen readers, since
              sighted users get that mapping from column position alone. */}
          <div className="mc-rows mt-10 lg:mt-12">
            {CRITERIA.map(({ label, values }) => (
              <div
                key={label}
                className={`mc-row border-t border-foreground/10 py-6 lg:py-7 ${ROW} lg:items-baseline`}
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground/40">
                  {label}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-5 sm:gap-8 lg:mt-0 lg:contents">
                  {MATERIALS.map(({ key, name, winner }) => (
                    <p
                      key={key}
                      className={`text-base sm:text-lg leading-snug ${
                        winner ? "font-bold" : "text-foreground/55"
                      }`}
                    >
                      {/* Visible on mobile, where the column headings have
                          scrolled away; screen-reader-only once the desktop
                          grid puts each value under its material */}
                      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground/40 lg:sr-only">
                        {name}
                      </span>
                      {values[key]}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
