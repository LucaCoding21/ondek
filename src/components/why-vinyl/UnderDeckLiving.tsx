"use client";

import Image from "@/components/SiteImage";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Markers on the drawing, boxes in a row underneath in the same left-to-right
// order — 01 left, 02 middle, 03 right. No leader lines and nothing laid over
// the artwork: the badge is the link, so it is the same size and colour in
// both places and big enough to read as a pair.
const ANNOTATIONS = [
  {
    n: "01",
    label: "Covered storage",
    title: "The garage gets its floor back",
    body: "Bikes, tools, and off-season furniture go under the deck instead of inside. Dry, out of the way, and off the driveway.",
    marker: { left: "37%", top: "78%" },
    box: "lg:absolute lg:left-0 lg:top-[64%] lg:w-[21rem]",
  },
  {
    n: "02",
    label: "Patio",
    title: "Seating that survives the forecast",
    body: "Shade in July, shelter in November. A dry ceiling turns the space under the deck into the one outdoor room that's usable in any weather.",
    marker: { left: "50%", top: "48%" },
    box: "lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[94%] lg:w-[21rem]",
  },
  {
    n: "03",
    label: "Outdoor kitchen",
    title: "Appliances that can live outside",
    body: "Cabinetry, counters, and a grill stay out of the rain, so the cooking moves outdoors without moving anything back in at the end of the day.",
    marker: { left: "71%", top: "71%" },
    box: "lg:absolute lg:right-0 lg:top-[60%] lg:w-[21rem]",
  },
];

export default function UnderDeckLiving() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the rest of the site.
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

        gsap.from(".ud-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ud-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The drawing arrives whole (markers ride along inside it), then the
        // badges pop their opacity in reading order once it has settled.
        // The markers and the cards carry their own translate classes, so the
        // tweens on them touch opacity only — never transform.
        gsap.from(".ud-art", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ud-art",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".ud-marker", {
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.5,
          scrollTrigger: {
            trigger: ".ud-art",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".annotation", {
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".ud-art",
            start: "top 70%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="under-deck" className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-24 lg:pt-32 pb-24 lg:pb-32">
        <SectionLabel>Under-deck living space</SectionLabel>

        <div className="mt-10 max-w-4xl">
          {/* Split where the thought breaks, each line in its own mask. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h2 className="ud-heading mt-6 text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="ud-heading-line block">Extend your outdoor</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="ud-heading-line block">
                living space
              </span>
            </span>
          </h2>
          <p className="ud-sub mt-6 max-w-xl text-lg text-foreground/60 leading-relaxed">
            The membrane keeps the space beneath a second-story deck dry all
            year. Turn it into a patio, outdoor kitchen, or covered storage
            instead of wasted space.
          </p>
        </div>

        {/* Wrapper runs wider than the drawing so the cards spread past its
            edges instead of crowding the line work */}
        <div className="relative mx-auto mt-12 max-w-[96rem] lg:mt-16 lg:mb-40">
          <div className="ud-art relative mx-auto max-w-6xl">
            <Image
              src="/images/under-deck-concept-v2.webp"
              alt="Line drawing of a deck with a furnished, dry living space underneath"
              width={1400}
              height={1092}
              className="w-full h-auto"
              sizes="(min-width: 1024px) 72rem, 100vw"
            />

            {ANNOTATIONS.map(({ n, label, marker }) => (
              <span
                key={n}
                style={{ left: marker.left, top: marker.top }}
                className="ud-marker absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cta text-xs font-bold text-foreground sm:size-12 sm:text-sm"
              >
                {n}
                <span className="sr-only">{` ${label}`}</span>
              </span>
            ))}
          </div>

          {/* Placed against the drawing from lg — 01 low left, 03 low right,
              02 dropped below the middle. They sit over the drawing's empty
              margins rather than its line work. Stacked below it until then. */}
          <div className="mt-10 grid items-start gap-6 sm:grid-cols-3 lg:mt-0 lg:block">
            {ANNOTATIONS.map(({ n, label, title, body, box }) => (
              <div
                key={n}
                className={`annotation border border-gold bg-background p-6 lg:p-7 ${box}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold">{n}</span>
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground/60">
                    {label}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug text-balance">
                  {title}
                </h3>
                <p className="mt-3 text-foreground/75 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
