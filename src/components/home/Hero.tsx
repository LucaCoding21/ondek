"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-frame", { opacity: 0, scale: 0.98, duration: 1 })
        .from(
          ".hero-line",
          { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 },
          "-=0.5",
        )
        .from(
          ".hero-cta",
          { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4",
        );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      {/* White gutter frames the photo; the fold still totals 100dvh */}
      <div className="p-[var(--gutter)]">
        <div className="hero-frame relative h-[calc(100dvh-var(--gutter)*2)] min-h-[560px] notch-frame overflow-hidden">
          <div className="relative h-full">
            <Image
              src="/images/hero-deck-backyard.jpg"
              alt="Waterproof vinyl deck surface on a raised backyard deck"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            {/* Top scrim so the transparent nav's white links stay legible */}
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            {/* No flat dim — the rest of the darkening sits behind the copy */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Bottom scrim so the headline and CTAs hold against a bright deck */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />

            {/* Copy anchored to the bottom: headline left, support copy and CTAs right */}
            <div className="relative z-10 flex h-full items-end">
              <div className="w-full px-6 sm:px-12 lg:px-16 pb-12 lg:pb-16">
                <div className="grid gap-10 lg:grid-cols-[5fr_4fr] lg:gap-12 lg:items-end">
                  {/* "Waterproof decking," has to hold together on one line.
                      It measures 9.84em in Ubuntu Bold (~9.46em after the
                      tracking), and from lg up it only gets 5/9 of the row,
                      so the type is sized off that column rather than off the
                      viewport — text-8xl needed ~900px of a ~600px column and
                      was what split "Waterproof" onto its own line. Below lg
                      the headline has the full width and wraps on its own. */}
                  <h1 className="hero-line text-6xl sm:text-7xl lg:whitespace-nowrap lg:text-[clamp(2.75rem,calc(5.4vw-0.7rem),6rem)] font-bold leading-[1.02] tracking-[-0.02em] text-white">
                    Waterproof decking,{" "}
                    <span className="lg:block">built to last.</span>
                  </h1>

                  <div className="text-white lg:pb-1 lg:ml-auto lg:max-w-lg">
                    <p className="hero-line text-lg text-white/85 leading-relaxed">
                      Premium vinyl deck membranes manufactured for lasting
                      performance. Every roll is engineered, tested, and backed
                      by our industry-leading waterproof warranty.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href="/become-a-dealer"
                        className="hero-cta px-7 py-3.5 font-bold bg-cta text-foreground hover:brightness-95 transition-[filter]"
                      >
                        Become a dealer
                      </Link>
                      <Link
                        href={CTA_LINKS.quote.href}
                        className="hero-cta px-7 py-3.5 font-bold bg-white text-foreground hover:bg-white/90 transition-colors"
                      >
                        {CTA_LINKS.quote.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
