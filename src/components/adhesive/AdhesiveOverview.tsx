"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Straight from the OD 1010 product page — do not embellish */
const SPECS = [
  { label: "Formulation", value: "Solvent-based contact adhesive" },
  {
    label: "Application temperature",
    value: "Above 10°C (50°F), best above 15°C",
  },
  { label: "Applied with", value: "Brush, roller, or spray, on both surfaces" },
  { label: "Open time", value: "60 minutes" },
  { label: "Coverage", value: "775 sq ft per pail" },
  { label: "Finished bond range", value: "-29°C to 49°C (-20°F to 120°F)" },
  { label: "Remains liquid to", value: "-5°C (23°F)" },
  { label: "Storage range", value: "10°C to 32°C (50°F to 90°F)" },
  { label: "Shelf life", value: "12 months" },
  { label: "Pail size", value: "18.9 L (5 US gal), 35 lb" },
  { label: "Hazard class", value: "3, Packing Group II" },
];

export default function AdhesiveOverview() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the site's signature move
        gsap.from(".ao-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".ao-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".ao-copy", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ao-copy",
            start: "top 85%",
            once: true,
          },
        });

        // The glance label and the spec table arrive as one block, table a
        // beat behind its label
        gsap.from(".ao-glance", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".ao-glance",
            start: "top 85%",
            once: true,
          },
        });

        // The tween rides the reserving box, never the artwork itself — the
        // image carries its own scale class that an inline transform would
        // clobber
        gsap.from(".ao-img", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ao-img",
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-2 lg:pt-4 pb-20 lg:pb-28">
        <SectionLabel>Overview</SectionLabel>

        {/* Uncapped: the columns run gutter to gutter, which is what puts
            the pail as far right as the page allows */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-44 items-start">
          {/* The spec table rides inside this column rather than under the
              whole grid: the pail art overflows its own box, so anything
              set full-width beneath the grid lands under the artwork */}
          <div>
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="ao-heading lg:ml-12 text-4xl sm:text-5xl font-bold leading-tight max-w-md">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ao-heading-line block">Aggressive tack,</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ao-heading-line block">rapid cure</span>
              </span>
            </h2>
            <p className="ao-copy mt-6 lg:ml-12 text-foreground/60 leading-relaxed max-w-2xl">
              OD 1010 excels on exterior-grade plywood, pressure-treated
              lumber, dry cured concrete, and metal flashings. It grabs at
              low temperatures, cures rapidly into permanent adhesion, and
              the finished bond holds from -29&deg;C to 49&deg;C.
            </p>

            <h3 className="ao-glance mt-16 lg:ml-40 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground/50">
              OD 1010 at a glance
            </h3>
            <dl className="ao-glance mt-4 lg:ml-40 max-w-xl">
              {SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="grid gap-x-8 gap-y-0.5 border-b border-foreground/10 py-3 sm:grid-cols-[13rem_1fr]"
                >
                  <dt className="text-sm font-medium text-foreground/60">{spec.label}</dt>
                  <dd className="text-sm text-right text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The 4:3 box only reserves layout space; the taller pail art
              overflows it and is cropped by the section's bottom edge —
              which is also why it stays last, so the overflow on the
              stacked layout has nothing below it to spill over. */}
          <div className="ao-img relative aspect-[4/3] lg:mt-20 lg:mr-32 lg:justify-self-end lg:w-full lg:max-w-[34rem]">
            <Image
              src="/images/od1010-pail-sketch.png"
              alt="Line drawing of a five gallon OD 1010 adhesive pail"
              width={1122}
              height={1402}
              className="w-full h-auto scale-[1.25] origin-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
