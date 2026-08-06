"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The four-badge strip pinned to the hero's bottom edge (handoff spec).
// Heights are deliberate per-badge — they optically balance.
const BADGES = [
  {
    src: "/images/badges/20yr-ltd-warr.svg",
    alt: "20 Year Limited Warranty",
    width: 362,
    height: 89,
    className: "h-10 w-auto tablet:h-12",
  },
  {
    src: "/images/badges/eco.svg",
    alt: "Eco-friendly",
    width: 143,
    height: 89,
    className: "h-14 w-auto tablet:h-16",
  },
  {
    src: "/images/badges/made-in-canada.svg",
    alt: "Made in Canada",
    width: 283,
    height: 89,
    className: "h-[58px] w-auto tablet:h-[66px]",
  },
  {
    src: "/images/badges/est-2004.svg",
    alt: "Established 2004",
    width: 76,
    height: 94,
    className: "h-[46px] w-auto tablet:h-[54px]",
  },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Entrances are CSS-only per the handoff spec (hero-rise-* / hero-fade-*
  // in globals.css); GSAP only runs the scroll scrub: the image grows a
  // touch while the copy leads the scroll slightly — depth separation, no
  // pinning. Lives behind the media gate because GSAP writes inline styles
  // the global reduced-motion CSS rule can't stop.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          })
          .to(".hero-img-wrap", { scale: 1.1, ease: "none" }, 0)
          .to(".hero-copy", { yPercent: -14, ease: "none" }, 0);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      data-hero
      className="relative h-dvh min-h-[600px] bg-background"
    >
      {/* Full-bleed media, clipped so the scroll-scrub scale never spills */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-img-wrap absolute inset-0">
          {/* TEMP: video stand-in for the hero photo, just to preview.
              Restore the Image below when done evaluating. */}
          <video
            src="/videos/hero-temp-2.mp4"
            poster="/videos/hero-temp-2-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-img absolute inset-0 h-full w-full object-cover"
          />
          {/* <Image
            src="/images/hero-deck-backyard.jpg"
            alt="Waterproof vinyl deck surface on a raised backyard deck"
            fill
            preload
            className="hero-img object-cover"
            sizes="100vw"
          /> */}
        </div>
        {/* Reference scrim stack, one-for-one. Bottom: full-height, black/50
            at the bottom edge gone by the midpoint — keeps the badge strip
            and its 1px border legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Left wash behind the headline and paragraph */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        {/* Top: fixed 128px strip so the white nav text stays legible */}
        <div className="absolute inset-x-0 top-0 z-[5] h-32 bg-gradient-to-b from-black/45 to-transparent" />
      </div>

      {/* Content block (handoff spec): bottom-aligned below desktop,
          vertically centered from 1025px up. Top padding clears the fixed
          nav; bottom padding reserves room for the badge strip. */}
      <div className="hero-copy relative z-10 flex h-full flex-col justify-end px-4 pb-44 pt-20 text-left tablet:px-20 desktop:justify-center desktop:px-32 desktop:pb-32">
        {/* Each headline line rises out of its own overflow mask. The em
            paddings give descenders room at this tight leading. */}
        <div className="overflow-hidden pb-[0.25em] font-heading text-[clamp(3rem,7.5vw,7rem)] font-medium leading-[0.92] tracking-[-0.025em] text-offwhite">
          <h1 className="hero-rise-1">Waterproof decking,</h1>
        </div>
        <div className="mb-6 overflow-hidden font-heading text-[clamp(3rem,7.5vw,7rem)] font-medium leading-[0.92] tracking-[-0.025em] text-offwhite tablet:mb-8">
          <h1 className="hero-rise-2 pb-[0.18em]">built to last</h1>
        </div>

        <p className="hero-fade-sub mb-9 max-w-[512px] font-body text-lg font-light leading-[1.625] text-offwhite/80 tablet:mb-10">
          Premium vinyl membranes in modern patterns. Low maintenance, slip
          resistant, and backed by our{" "}
          <span className="font-normal text-accent">
            15 / 5 Year Limited Warranty
          </span>
          .
        </p>

        {/* items-start so the microcopy under the secondary button doesn't
            push the buttons out of line */}
        <div className="hero-fade-cta flex flex-row items-start gap-3 whitespace-nowrap">
          <Link
            href={CTA_LINKS.quote.href}
            className="bg-accent px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.06em] text-ink transition-colors duration-[250ms] ease-[ease] hover:bg-accent-hover desktop:px-10 desktop:py-3.5"
          >
            {CTA_LINKS.quote.label}
          </Link>
          <div>
            <Link
              href={CTA_LINKS.designKit.href}
              className="block border border-white/35 px-6 py-4 text-center font-body text-sm font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-[250ms] ease-[ease] hover:border-gold hover:text-gold desktop:px-10 desktop:py-3.5"
            >
              {CTA_LINKS.designKit.label}
            </Link>
            <p className="mt-2 text-center text-sm text-white/70">
              Real Samples, Free Shipping
            </p>
          </div>
        </div>
      </div>

      {/* Badge strip — pinned to the hero's bottom edge, spread across the
          width on mobile/tablet, tucked bottom-right on desktop. The 1px
          offwhite top border runs the full page width. */}
      <div className="hero-fade-up absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-6 border-t border-offwhite/10 px-4 pt-5 pb-6 tablet:gap-16 tablet:px-20 tablet:pb-8 desktop:justify-end desktop:px-32">
        {BADGES.map((badge) => (
          <div key={badge.src} className="flex items-center">
            <Image
              src={badge.src}
              alt={badge.alt}
              width={badge.width}
              height={badge.height}
              className={badge.className}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
