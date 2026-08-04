"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BENEFITS = [
  {
    number: "01",
    title: "Fully waterproof",
    text: "A true waterproof membrane, not a water-resistant coating.",
    icon: (
      <path
        d="M12 4c2.9 3.4 4.7 5.9 4.7 8.2a4.7 4.7 0 1 1-9.4 0C7.3 9.9 9.1 7.4 12 4Z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: "02",
    title: "Heat-welded seams",
    text: "Runs are welded PVC to PVC into one single continuous waterproofing membrane.",
    icon: (
      <>
        <path d="M4 15h16" strokeLinecap="round" />
        <path d="M8 15c0-4 2-7 4-7s4 3 4 7" strokeLinecap="round" />
        <path d="M12 4v2" strokeLinecap="round" />
      </>
    ),
  },
  {
    number: "03",
    title: "Certified and code-listed",
    text: "Tested to ASTM and CGSB standards, with Class A and Class C fire ratings.",
    icon: (
      <>
        <path
          d="M12 3l7 3v5c0 4.4-2.9 8-7 10-4.1-2-7-5.6-7-10V6l7-3Z"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    number: "04",
    title: "15 / 5 year warranty",
    text: "15 year waterproofing and 5 year appearance coverage, in writing.",
    icon: (
      <>
        <path d="M6 3h9l4 4v14H6V3Z" strokeLinejoin="round" />
        <path d="M15 3v4h4" strokeLinejoin="round" />
        <path d="M9 13h6M9 16h6" strokeLinecap="round" />
      </>
    ),
  },
];

export default function UltraBenefits() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks, the standfirst just behind
        gsap.from(".ub-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".ub-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".ub-standfirst", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".ub-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The card plate arrives as one piece. No per-card stagger:
        // transparent cards would expose the divider backdrop as grey bands
        // mid-animation.
        gsap.from(".ub-plate", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ub-plate",
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
    <section ref={ref} className="bg-surface">
      <div className="pt-28 lg:pt-40 pb-28 lg:pb-40">
        {/* Gutters match the heading and the card row below, so the rule stops
            where they do rather than running wider than the section */}
        <SectionLabel className="px-5 md:px-8 lg:px-12 xl:px-16">
          Why the Ultra system
        </SectionLabel>

        {/* Heading left, the standfirst set against it on the right */}
        <div className="mt-10 grid gap-8 px-5 md:px-8 lg:mx-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 xl:mx-16 lg:items-end">
          {/* Wide enough for two lines, balanced so neither ends up a runt */}
          {/* Split where the thought breaks, each line in its own mask. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h2 className="ub-heading max-w-3xl font-bold leading-[1.15] text-[clamp(2.25rem,4.5vw,3.5rem)]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="ub-heading-line block">
                Benefits and certifications
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="ub-heading-line block">
                built into every roll
              </span>
            </span>
          </h2>
          <p className="ub-standfirst max-w-md text-sm text-foreground/60 leading-relaxed lg:pb-2">
            Every roll is produced to the same exacting standards, verified
            through quarterly third-party audits by QAI Laboratories.
          </p>
        </div>

        {/* Card row inset to the page gutters; the px gaps read as hairline
            borders. No per-card stagger: transparent cards would expose the
            divider backdrop as grey bands mid-animation */}
        {/* Same chamfer as the hero frame, cutting the top-left and
            bottom-right corners of the whole row. A border cannot follow a
            clipped edge, so the outline is a clipped plate one pixel larger
            than the clipped grid sitting on it: the pixel that shows through
            is the stroke, diagonals included. */}
        <div className="ub-plate notch-frame mt-14 md:mt-20 mx-5 md:mx-8 lg:mx-12 xl:mx-16 bg-foreground/15 p-px">
          <div className="notch-frame grid gap-px bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.number}
              className="benefit-card group flex min-h-[21rem] lg:min-h-[22rem] flex-col bg-surface p-6 transition-colors duration-300 hover:bg-cta"
            >
              <span className="text-xs font-bold text-foreground/50 transition-colors duration-300 group-hover:text-foreground/70">
                {benefit.number}.
              </span>

              <div className="flex flex-1 items-center justify-center py-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden
                  className="size-16 lg:size-20 text-foreground/50 transition-colors duration-300 group-hover:text-foreground"
                >
                  {benefit.icon}
                </svg>
              </div>

              <h3 className="text-xl font-bold leading-tight">
                {benefit.title}
              </h3>
              <p className="mt-2.5 text-sm text-foreground/60 leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                {benefit.text}
              </p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
