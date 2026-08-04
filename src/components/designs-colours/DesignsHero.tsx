"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function DesignsHero() {
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
        tl.from(".dsh-frame", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0)
          .from(
            ".dsh-headline-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            0.3,
          )
          .from(".dsh-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.7);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      {/* Same framed-photo fold as the homepage, at sub-page height */}
      <div className="p-[var(--gutter)]">
        <div className="dsh-frame relative h-[calc(100dvh-var(--gutter)*2)] min-h-[560px] notch-frame-br-lg overflow-hidden">
          <div className="relative h-full">
            <Image
              src="/images/hero-deck-backyard.jpg"
              alt="Waterproof vinyl deck surface in Speckled Stone Tan"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="relative z-10 flex h-full items-end">
              <div className="w-full px-14 sm:px-28 lg:px-44 pb-24 lg:pb-32">
                {/* One thought, one line, one mask. The pb/-mb pair leaves
                    descenders ("Designs" has a g) room inside the mask. */}
                <h1 className="text-6xl sm:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-[-0.02em] text-balance text-white max-w-4xl">
                  <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                    <span className="dsh-headline-line block">
                      Designs &amp; colours
                    </span>
                  </span>
                </h1>
                <p className="dsh-sub mt-6 text-xl sm:text-2xl text-white/85 leading-relaxed max-w-2xl">
                  A vinyl membrane option for any deck surface, with 12+
                  designs in greys, silvers, tans, and browns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
