"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The feature list from the OD 1010 product page. The page's last two bullets
 * — "cures rapidly, forming permanent adhesion" and "bonding resists -29°C to
 * 49°C" — are carried as one item, so four cells cover the sheet.
 *
 * Icons are drawn here rather than pulled from a set: the site has no icon
 * dependency, and these four are one-path line marks in the same weight as
 * the arrow in the trust bar.
 */
const FEATURES = [
  {
    title: "Membrane compatible",
    text: "Compatible with all polyester backed membranes, fleece and fabric-back alike.",
    // Membrane laid over a substrate — two layers, one bond line
    icon: (
      <>
        <path d="M12 3 21 8l-9 5-9-5 9-5Z" />
        <path d="M3 13.5 12 18.5 21 13.5" />
      </>
    ),
  },
  {
    title: "Tack in the cold",
    text: "Aggressive initial tack at low temperatures, and it stays liquid down to -5°C (23°F).",
    // Snowflake
    icon: (
      <>
        <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5 4.2 16.5" />
        <path d="m9.8 4.7 2.2 2.2 2.2-2.2M9.8 19.3l2.2-2.2 2.2 2.2" />
      </>
    ),
  },
  {
    title: "Multiple surfaces",
    text: "Outstanding performance across substrates, on horizontal and vertical surfaces alike.",
    // A horizontal plane with a vertical one rising off it
    icon: (
      <>
        <path d="m3 16 9-4.5 9 4.5-9 4.5L3 16Z" />
        <path d="M12 11V3M8.5 5.5 12 3l3.5 2.5" />
      </>
    ),
  },
  {
    title: "Rapid, permanent cure",
    text: "Cures rapidly into permanent adhesion that resists -29°C to 49°C (-20°F to 120°F).",
    // Bolt, for the speed of the cure
    icon: <path d="M13 3 5.5 13.5H11l-1 7.5 8-10.5h-5.5L13 3Z" />,
  },
];

export default function AdhesiveFeatures() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — everything lives behind this media gate. Skipped, the
      // frame sits at its start position (already a valid crop) and the
      // panel content is static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".parallax-frame",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Headline lines rise out of their masks — the site's signature move
        gsap.from(".af-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".af-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".af-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".af-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The four cells settle in reading order across the quartered panel
        gsap.from(".feature-cell", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".af-grid",
            start: "top 80%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    // The overview above is a white section built out of a spec table, so this
    // one lifts off it entirely: a photograph running the full width with the
    // features carried on a solid panel floating over it.
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-surface text-foreground"
    >
      {/* Overhangs the section by 15% top and bottom so the 16% of drift can
          never pull an edge of the photo into frame */}
      <div className="parallax-frame absolute inset-x-0 -top-[15%] h-[130%]">
        <Image
          src="/images/hero-deck-backyard.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Settles the photo down so the panel edge reads as an edge rather than
          competing with foliage and sky */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-32">
        <div className="bg-background px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20">
          <SectionLabel rule={false}>Features</SectionLabel>

          {/* Heading rail on the left, the four features quartered by
              hairlines on the right */}
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 xl:gap-20 lg:items-start">
            <div>
              {/* Short and hyphen-free on purpose: "fabric-back" broke across
                  the line at its own hyphen. The fleece and fabric-back detail
                  is carried by the first feature cell instead. */}
              {/* Split where the thought breaks, each line in its own mask.
                  The pb/-mb pair leaves descenders room inside the mask. */}
              <h2 className="af-heading font-bold leading-[1.05] tracking-[-0.01em] text-[clamp(2.25rem,3.4vw,3.25rem)]">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="af-heading-line block">Formulated for</span>
                </span>
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="af-heading-line block">
                    backed membranes.
                  </span>
                </span>
              </h2>

              <p className="af-sub mt-6 max-w-md text-foreground/60 leading-relaxed">
                An aggressive, solvent-based contact adhesive suitable for
                horizontal and vertical surfaces.
              </p>
            </div>

            {/* Two by two, divided by rules rather than boxed — the cells share
                edges so the four read as one panel */}
            <div className="af-grid grid border-t border-foreground/15 sm:grid-cols-2">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`feature-cell flex flex-col border-b border-foreground/15 py-12 sm:min-h-[19rem] sm:py-14 lg:min-h-[22rem] lg:py-16 ${
                    i % 2 === 0
                      ? "sm:border-r sm:border-foreground/15 sm:pr-10 lg:pr-14"
                      : "sm:pl-10 lg:pl-14"
                  }`}
                >
                  <svg
                    className="size-8 text-foreground/85"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {feature.icon}
                  </svg>
                  {/* mt-auto drops the copy to the foot of the cell, so the
                      extra height opens up under the icon rather than below
                      the text */}
                  <h3 className="mt-auto pt-10 text-sm font-bold uppercase tracking-[0.14em]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-foreground/60 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
