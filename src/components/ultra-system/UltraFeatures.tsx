"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Point = { title: string; text: string };
type Column = { title: string; items: string[] };

const SEAM_POINTS: Point[] = [
  {
    title: "Clean selvage edge",
    text: "No fleece remnants, so nothing contaminates the seam.",
  },
  {
    title: "Fleece stops short of the weld",
    text: "The backing stops short of the edge of the vinyl.",
  },
  {
    title: "PVC-to-PVC weld",
    text: "The seam welds true vinyl to vinyl, watertight.",
  },
];

const SEAM_TYPICAL: Column = {
  title: "Typical seam",
  items: [
    "Higher risk of seam contamination",
    "Fleece remnants can compromise seam integrity",
    "Less confidence in long-term waterproof performance",
  ],
};

const SEAM_ULTRA: Column = {
  title: "Ultra Seam",
  items: [
    "Clean selvage edge keeps fleece out of the weld",
    "Pure vinyl-to-vinyl weld",
    "Proved stronger than the membrane itself in independent testing",
  ],
};

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

const EDGE_TYPICAL: Column = {
  title: "Typical edge clip",
  items: [
    "May rely on screws for attachment",
    "Pulling and detachment can occur in hot and cold weather",
    "Clips can fall off after seasonal expansion and contraction",
  ],
};

const EDGE_ULTRA: Column = {
  title: "Ultra Edge",
  items: [
    "Positive, screw-free mechanical connection",
    "Ultra Clip snaps onto Ultra Flashing for a lasting fit",
    "Designed for hot and cold weather to reduce pulling and detachment",
  ],
};

// The same test video the old site runs on its Ultra Seam page and home page.
const SEAM_TEST_SRC =
  "https://player.vimeo.com/video/522076250?title=0&byline=0&portrait=0&dnt=1";

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="mt-[0.4em] size-4 shrink-0 stroke-current stroke-[1.5]"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" fill="none" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="mt-[0.4em] size-4 shrink-0 stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5L13 4.5" fill="none" />
    </svg>
  );
}

function FeatureBlock({
  label,
  headingLines,
  standfirst,
  points,
  typical,
  ultra,
  surface = false,
  children,
}: {
  label: string;
  headingLines: string[];
  standfirst: string;
  points: Point[];
  typical: Column;
  ultra: Column;
  /** Alternates the section background against its neighbours */
  surface?: boolean;
  children?: React.ReactNode;
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

        // The plate lands as one piece, then the Ultra column's checks tick
        // in one after another — the payoff beat of the section.
        gsap.from(".uf-plate", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".uf-plate",
            start: "top 80%",
            once: true,
          },
        });

        gsap.from(".uf-check", {
          x: 16,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.35,
          scrollTrigger: {
            trigger: ".uf-plate",
            start: "top 80%",
            once: true,
          },
        });

        gsap.from(".uf-video", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".uf-video",
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
    <section
      ref={ref}
      className={`${surface ? "bg-surface" : "bg-background"} overflow-hidden`}
    >
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <SectionLabel>{label}</SectionLabel>

        {/* Heading left, standfirst set against it on the right — the same
            editorial pairing as the benefits section */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-end">
          {/* Each line in its own mask; the pb/-mb pair leaves descenders
              room inside the mask. */}
          <h2 className="uf-heading max-w-3xl font-bold leading-[1.12] text-[clamp(2.25rem,4.5vw,3.5rem)]">
            {headingLines.map((line) => (
              <span
                key={line}
                className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"
              >
                <span className="uf-heading-line block">{line}</span>
              </span>
            ))}
          </h2>
          <p className="uf-standfirst max-w-md text-sm text-foreground/60 leading-relaxed lg:pb-2">
            {standfirst}
          </p>
        </div>

        {/* The three "what makes it different" points as editorial columns,
            each hanging off its own hairline */}
        <div className="uf-points mt-14 lg:mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {points.map((point, i) => (
            <div
              key={point.title}
              className="uf-point border-l border-foreground/15 pl-5 lg:pl-6"
            >
              <span className="text-xs font-bold text-foreground/50">
                0{i + 1}.
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>

        {/* The showpiece: the old site's comparison table as a split plate.
            Them on the dark neutral, us on the brand gold — the two halves
            butt together with no seam, chamfered as one piece. */}
        <div className="uf-plate notch-frame mt-14 lg:mt-20 grid md:grid-cols-2">
          <div className="bg-[#26282a] p-8 sm:p-10 lg:p-12">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-white/50">
              {typical.title}
            </h3>
            <ul className="mt-8 space-y-5">
              {typical.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3.5 text-white/65 leading-relaxed"
                >
                  <span className="text-white/40">
                    <CrossIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-cta p-8 sm:p-10 lg:p-12">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em]">
              {ultra.title}
            </h3>
            <ul className="mt-8 space-y-5">
              {ultra.items.map((item) => (
                <li
                  key={item}
                  className="uf-check flex gap-3.5 font-medium leading-relaxed"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

export default function UltraFeatures() {
  return (
    <>
      <FeatureBlock
        label="Ultra Seam"
        headingLines={["Welded vinyl", "to vinyl"]}
        standfirst="Seam technology engineered for stronger welds and long-term waterproof performance."
        points={SEAM_POINTS}
        typical={SEAM_TYPICAL}
        ultra={SEAM_ULTRA}
      >
        {/* The payoff: the strongest verified claim on the site, then the
            footage that backs it up */}
        <div className="uf-video mt-20 lg:mt-28">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
                The seam strength test
              </p>
              <h3 className="mt-4 max-w-2xl font-bold leading-[1.12] text-[clamp(1.75rem,3.2vw,2.75rem)]">
                Stronger than the membrane itself
              </h3>
            </div>
            <p className="max-w-md text-sm text-foreground/60 leading-relaxed lg:pb-1.5">
              Watch the PVC-to-PVC welded seam tested for strength against the
              competition.
            </p>
          </div>
          <div className="notch-frame mt-10 aspect-video w-full max-w-5xl overflow-hidden bg-black">
            <iframe
              src={SEAM_TEST_SRC}
              title="The OnDek Ultra Seam strength test"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </FeatureBlock>

      <FeatureBlock
        label="Ultra Edge"
        headingLines={["A screw-free", "snap fit"]}
        standfirst="Precision edge detailing that improves durability, appearance, and long-term membrane performance."
        points={EDGE_POINTS}
        typical={EDGE_TYPICAL}
        ultra={EDGE_ULTRA}
        surface
      />
    </>
  );
}
