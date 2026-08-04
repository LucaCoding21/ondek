"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function UltraHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the hero fully visible and still.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load: the frame fades in while the headline rises out of its mask,
        // then the sub-copy follows through — same arrival as the homepage.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".ush-frame", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0)
          .from(
            ".ush-headline-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            0.3,
          )
          .from(".ush-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.7);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      <div className="p-[var(--gutter)]">
        <div className="ush-frame relative h-[calc(100dvh-var(--gutter)*2)] min-h-[560px] notch-frame-br-lg overflow-hidden">
          <div className="relative h-full">
            <Image
              src="/images/ultra-hero-deck.webp"
              alt="Textured vinyl deck surface wrapping a finished edge over cedar framing"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            {/* Heavier than the other heroes on purpose — this photo is a
                pale beige deck surface right where the copy sits */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

            <div className="relative z-10 flex h-full items-end">
              <div className="w-full px-14 sm:px-28 lg:px-44 pb-24 lg:pb-32">
                {/* One thought, one line, one mask. The pb/-mb pair leaves
                    descenders ("system" has a y) room inside the mask. */}
                <h1 className="text-6xl sm:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-[-0.02em] text-balance text-white max-w-4xl">
                  <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                    <span className="ush-headline-line block">
                      The Ultra system
                    </span>
                  </span>
                </h1>
                <p className="ush-sub mt-6 text-xl sm:text-2xl text-white/85 leading-relaxed max-w-2xl">
                  Ultra Seam welded seams and the screw-free Ultra Edge,
                  engineered for long-term waterproof performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
