"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import { CTA_LINKS } from "@/lib/nav";
import SeamFeature from "./SeamFeature";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Point = { title: string; text: string };

const EDGE_POINTS: Point[] = [
  {
    title: "Positive, screw-free connection",
    text: "A secure mechanical connection, no screws needed.",
  },
  {
    title: "Snap-fit Ultra Clip and Ultra Flashing",
    text: "The Ultra Clip snaps onto the Ultra Flashing for a clean, lasting fit.",
  },
  {
    title: "Clean, professional finish",
    text: "A tidy edge that holds its look season after season.",
  },
];

function FeatureBlock({
  label,
  headingLines,
  standfirst,
  points,
  surface = false,
}: {
  label: string;
  headingLines: string[];
  standfirst: string;
  points: Point[];
  /** Alternates the section background against its neighbours */
  surface?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks, the standfirst just behind —
        // the same arrival as every other section on the page.
        gsap.from(".uf-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".uf-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".uf-standfirst", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".uf-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The three columns walk in left to right
        gsap.from(".uf-point", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".uf-points",
            start: "top 82%",
            once: true,
          },
        });

        // No opacity here on purpose. This tween's from-state applies on mount
        // and only clears when the trigger fires; if it never does, an opacity
        // of 0 leaves the picture invisible with nothing in the markup to
        // explain it. Moving on y alone fails visible instead of blank.
        gsap.from(".uf-shot", {
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".uf-points",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".uf-cta", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".uf-cta", start: "top 90%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className={`${surface ? "bg-surface" : "bg-background"} overflow-hidden`}
    >
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <SectionLabel>{label}</SectionLabel>

        {/* Held to the right of the section, against the seam block above,
            which runs left. Text stays left-aligned inside it; only the block
            moves. Each line in its own mask; the pb/-mb pair leaves descenders
            room inside the mask. */}
        {/* Picture on the left, and everything else in the right column: the
            heading sits directly on top of the points it introduces rather
            than across the whole section above them. */}
        <div className="uf-points mt-12 lg:mt-16 grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 lg:items-start">
          <div className="uf-shot relative aspect-[5/4] w-full overflow-hidden">
            <Image
              src="/images/ultra-edge-clip-detail.webp"
              alt="Close-up of the Ultra Clip snapped onto the Ultra Flashing at the edge of a deck, with the membrane and underlayment wrapping over the joist"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            {/* Each line in its own mask; the pb/-mb pair leaves descenders
                room inside the mask. */}
            <h2 className="uf-heading font-bold leading-[1.12] text-[clamp(2rem,3.4vw,2.75rem)]">
              {headingLines.map((line) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"
                >
                  <span className="uf-heading-line block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="uf-standfirst mt-4 text-sm text-foreground/60 leading-relaxed">
              {standfirst}
            </p>

            <div className="mt-10 lg:mt-12">
              {points.map((point, i) => (
                <div
                  key={point.title}
                  className="uf-point grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-t border-foreground/15 py-6 first:border-t-0 first:pt-0 sm:gap-8 lg:py-7 lg:first:pt-0"
                >
                  {/* Nudged down to sit on the title's first line, not above */}
                  <span className="pt-1.5 text-xs font-bold text-foreground/50">
                    0{i + 1}.
                  </span>
                  <div>
                    <h3 className="text-lg font-bold leading-snug">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sits in the column under the last point, aligned to its right
                edge. No rule of its own: the points carry the hairlines, this
                just follows them. */}
            <div className="uf-cta mt-10 lg:mt-12 sm:text-right">
              <p className="text-lg font-bold leading-snug">
                Want the Ultra system on your deck?
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 sm:justify-end">
                <Link
                  href={CTA_LINKS.quote.href}
                  className="inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
                >
                  {CTA_LINKS.quote.label}
                </Link>
                <Link
                  href={CTA_LINKS.designKit.href}
                  className="inline-block px-7 py-3.5 font-bold ring-1 ring-foreground/25 hover:bg-foreground/5 transition-colors"
                >
                  {CTA_LINKS.designKit.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UltraFeatures() {
  return (
    <>
      <SeamFeature />

      <FeatureBlock
        label="Ultra Edge"
        headingLines={["A screw-free snap fit"]}
        standfirst="Precision edge detailing that improves durability, appearance, and long-term membrane performance."
        points={EDGE_POINTS}
        surface
      />
    </>
  );
}
