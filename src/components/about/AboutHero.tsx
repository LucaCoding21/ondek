"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AboutHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-frame", { opacity: 0, duration: 1 }).from(
        ".hero-line",
        { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 },
        "-=0.5",
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      {/* Full bleed, no gutter frame: the story section below opens with its
          own framed video, and two inset rectangles stacked read as borders */}
      <div className="hero-frame relative h-dvh min-h-[520px] overflow-hidden">
        <Image
          src="/images/hero-deck.jpg"
          alt="Finished OnDek vinyl deck off the back of a house"
          fill
          preload
          className="object-cover object-[55%_50%]"
          sizes="100vw"
        />

        {/* Three scrims, each doing one job: the nav, the headline over a
            bright sky, and the copy over a pale deck */}
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col px-6 sm:px-10 lg:px-14 xl:px-20 pt-32 lg:pt-44 pb-16 lg:pb-24 text-white">
          <h1 className="hero-line max-w-[12ch] font-bold leading-[0.94] tracking-[-0.035em] text-[clamp(3rem,8vw,7.5rem)]">
            Vinyl Deck Manufacturer
          </h1>

          <div className="mt-auto grid gap-10 lg:grid-cols-2">
            {/* Spacer only where there are two columns to space */}
            <div className="hidden lg:block" />
            <div className="hero-line lg:max-w-xl lg:justify-self-end">
              <p className="text-sm font-bold tracking-[0.02em] text-white/90">
                About us
              </p>
              <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
                OnDek Vinyl Worx builds waterproof vinyl deck membranes out of
                Aldergrove, British Columbia, and supplies them to builders,
                dealers, and homeowners across North America.
              </p>
              <Link
                href="/company/contact"
                className="group mt-7 inline-flex items-center gap-3 text-sm font-bold text-white"
              >
                <span className="underline underline-offset-[6px] decoration-1 decoration-white/50 group-hover:decoration-white transition-colors">
                  Get in touch
                </span>
                <svg
                  className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 12L12 4M12 4H6M12 4V10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
