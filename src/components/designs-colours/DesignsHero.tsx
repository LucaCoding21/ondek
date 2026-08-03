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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-frame", { opacity: 0, scale: 0.98, duration: 1 }).from(
        ".hero-line",
        { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 },
        "-=0.5",
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      {/* Same framed-photo fold as the homepage, at sub-page height */}
      <div className="p-[var(--gutter)]">
        <div className="hero-frame relative h-[calc(100dvh-var(--gutter)*2)] min-h-[560px] notch-frame-br-lg overflow-hidden">
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
                <h1 className="hero-line text-6xl sm:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-[-0.02em] text-balance text-white max-w-4xl">
                  Designs &amp; colours
                </h1>
                <p className="hero-line mt-6 text-xl sm:text-2xl text-white/85 leading-relaxed max-w-2xl">
                  From warm tans to cool greys, every OnDek pattern is printed
                  into the vinyl itself, so the colour you pick is the colour
                  that stays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
