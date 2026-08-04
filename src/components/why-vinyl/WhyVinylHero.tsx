"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(useGSAP);

export default function WhyVinylHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the hero static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Page-top hero, so this runs on load rather than on scroll: the
        // photo fades in while the headline lines rise out of their masks,
        // then the copy and the CTA pair follow through.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".wv-frame", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0)
          .from(
            ".wv-heading-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            0.3,
          )
          .from(".wv-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.7)
          // The pair rises together — no stagger between the two
          .from(".wv-cta", { y: 24, opacity: 0, duration: 0.7 }, 0.85);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      {/* Full-bleed photo — no gutter frame here, unlike the other sub-page
          heroes. The headline sits in the band below rather than over the
          photo, so the image only has to carry the nav. */}
      {/* overflow-hidden so the tab's lower edge is cut off by the photo
          rather than floating on the band below it */}
      <div className="wv-frame relative h-[54vh] min-h-[400px] overflow-hidden lg:h-[64vh]">
        <Image
          src="/images/grey-deck-farmhouse-wide.jpg"
          alt="Grey waterproof vinyl decking membrane on a modern farmhouse deck with black posts"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        {/* Only scrim needed: the nav's white links over a bright sky */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />

        {/* The band below pushing up into the photo, cut to the logo's ramp
            profile — two offset slabs, white in front and CTA yellow behind,
            the same pairing as the mark itself */}
        {/* Widths and the offset are the mark's own, scaled off the tab height:
            the white ramp is 2.55×H, the yellow 3.05×H, and the yellow starts
            1.84×H along — 147/244/204px at 80px tall */}
        <div
          aria-hidden
          // Sunk slightly past the photo's bottom edge into the band below
          className="absolute -bottom-5 left-0 h-[58px] w-[284px] sm:-bottom-7 sm:h-[80px] sm:w-[391px]"
        >
          {/* Back to the mark's own pairing: white slab, CTA yellow behind and
              to the right, with the logo's gap between the two ramps kept */}
          <span className="logo-ramp absolute bottom-0 left-[107px] h-full w-[177px] bg-cta sm:left-[147px] sm:w-[244px]" />
          <span className="logo-ramp absolute bottom-0 left-0 h-full w-[148px] bg-background sm:w-[204px]" />
        </div>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          {/* Split where the thought breaks, each line in its own mask. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h1 className="max-w-3xl text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="wv-heading-line block">
                Decking that&apos;s
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="wv-heading-line block">
                actually waterproof
              </span>
            </span>
          </h1>

          <div className="lg:pt-3">
            <p className="wv-sub max-w-xl text-lg text-foreground/70 leading-relaxed">
              Vinyl decking is a waterproof PVC membrane that goes down over
              your deck as one sealed surface instead of boards with gaps.
              Slip resistant, splinter free, and low maintenance.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={CTA_LINKS.quote.href}
                className="wv-cta group inline-flex items-center gap-2.5 btn-wipe px-7 py-3.5 font-bold text-foreground "
              >
                {CTA_LINKS.quote.label}
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                >
                  <path
                    d="M2.5 8h11m0 0L9.5 4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href={CTA_LINKS.designKit.href}
                className="wv-cta text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
              >
                {CTA_LINKS.designKit.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
