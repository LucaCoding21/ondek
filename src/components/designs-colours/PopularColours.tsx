"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FEATURED_DESIGNS } from "@/lib/designs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const POPULAR = FEATURED_DESIGNS.slice(0, 3);

export default function PopularColours() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading rises out of its mask, the sub-copy follows just behind
        gsap.from(".pc-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".pc-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".pc-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".pc-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The three cards arrive as a row, triggered by their own position —
        // they sit a long way below the heading on lg
        gsap.from(".popular-row", {
          y: 70,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".pc-cards",
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
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        {/* One thought, one line, one mask. The pb/-mb pair leaves
            descenders ("Popular" has a p) room inside the mask. */}
        <h2 className="pc-heading font-bold leading-[1.1] text-[clamp(2.25rem,3.4vw,3rem)]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="pc-heading-line block">Our most popular styles</span>
          </span>
        </h2>
        <p className="pc-sub mt-5 max-w-xl text-foreground/70 leading-relaxed">
          The colours homeowners have chosen most this season. Order any of
          them as a free sample and see them against your home in real light.
        </p>

        {/* Cards offset to the right — the empty left column is the breathing
            room the rest of the page uses between sections */}
        <div className="lg:ml-auto lg:w-[88%] xl:w-[84%]">
          <div className="pc-cards pt-16 md:pt-24 lg:pt-32">
            {/* One column per design rather than a full-bleed row each — the
                copy is a name and a sentence, which never filled a row's width */}
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {POPULAR.map((design) => (
                <li key={design.slug} className="popular-row">
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden"
                    style={{ backgroundColor: design.tone }}
                  >
                    <Image
                      src={design.scene ?? design.swatch}
                      alt={`${design.name} vinyl decking`}
                      fill
                      sizes="(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-xl leading-tight">
                    {design.name}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                    {design.blurb}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
