"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import EdgeBlueprint from "@/components/ultra-system/EdgeBlueprint";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function UltraIntro() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks, the copy follows through.
        // The blueprint is left alone — it draws itself on scroll and needs
        // to start against a fully visible column.
        gsap.from(".ui-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".ui-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".ui-copy", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".ui-heading",
            start: "top 78%",
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
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:py-24">
        <p className="text-sm font-bold">The system</p>
        <div className="mt-5 border-b border-foreground/10" />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="ui-heading text-3xl sm:text-4xl font-bold leading-tight max-w-lg">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ui-heading-line block">
                  What makes it Ultra?
                </span>
              </span>
            </h2>
            <p className="ui-copy mt-6 text-foreground/70 leading-relaxed max-w-md">
              The membrane is adhered to the substrate with our specially
              formulated contact adhesive. Where runs meet, Ultra Seam welds
              them PVC to PVC into one single continuous waterproofing
              membrane, and Ultra Edge locks down the perimeter with no
              screws.
            </p>
          </div>

          {/* Edge-profile blueprint, oversized so the section edge crops it
              like the technical-drawing reference. Same viewBox as the PNG
              it replaces, so the crop lands where it always did. */}
          <div className="relative">
            <EdgeBlueprint className="w-full h-auto scale-[1.3] lg:scale-[1.45] origin-top text-foreground/35" />
          </div>
        </div>
      </div>
    </section>
  );
}
