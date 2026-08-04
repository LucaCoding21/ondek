"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ScrollScale from "@/components/ScrollScale";
import DesignKitVideo from "@/components/home/DesignKitVideo";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DesignKit() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the hero and Popular designs, kept consistent on purpose.
        gsap.from(".dk-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".dk-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Copy first, button just behind it — one composed arrival for the
        // block, triggered by its own position since it sits a screen below
        // the heading on lg.
        gsap.from(".dk-cta > *", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".dk-cta",
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
    <section ref={ref} className="bg-[#26282a] text-white overflow-hidden">
      {/* At least one screen tall on lg, and taller if the spacing asks for it.
          The video is sized off the viewport rather than off whatever height is
          left over, so padding and margins here never eat into it. The top
          padding keeps the title clear of the fixed navbar. */}
      <div className="px-4 sm:px-6 lg:px-10 pt-20 pb-36 lg:py-0 lg:min-h-svh lg:pt-20 lg:pb-32 lg:flex lg:flex-col lg:justify-center">
        <div className="mt-6 lg:mt-16 lg:pl-8 xl:pl-14">
          {/* One line, never wrapped: the vw-based clamp keeps the ~11.8em
              line inside the viewport down to 320px, capping at 6xl. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h2 className="dk-heading whitespace-nowrap text-[clamp(1.6rem,7.5vw,3.75rem)] font-bold leading-[1.08]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="dk-heading-line block">Get your free sample kit</span>
            </span>
          </h2>
        </div>

        {/* Sized off the viewport, not off whatever height is left over, so the
            spacing around it never eats into it — aspect-video then derives the
            width. The min() caps the height by the width available on tall,
            narrow windows, where 62svh would otherwise be wider than the
            column and get squashed out of ratio. */}
        {/* 0.82: it enters at roughly the size it used to hold and grows into
            the full frame as it centres, so the scroll does the work rather
            than the video just sitting there large. */}
        <ScrollScale from={0.82} className="mt-6 lg:mt-4 flex justify-center items-center">
          <div className="aspect-video w-full max-w-7xl lg:h-[min(62svh,calc((100vw_-_6rem)*9/16))] lg:w-auto lg:max-w-full">
            <DesignKitVideo />
          </div>
        </ScrollScale>

        <div className="dk-cta mt-10 lg:mt-12 lg:text-right lg:pr-6 xl:pr-12">
          <p className="max-w-md lg:ml-auto text-lg text-white/80 leading-relaxed">
            We give you real samples of every vinyl style and colour we
            offer, shipped free to your door and sent out immediately.
          </p>
          <Link
            href={CTA_LINKS.designKit.href}
            className="mt-5 inline-block px-7 py-3.5 font-bold text-foreground bg-cta hover:brightness-95 transition-[filter]"
          >
            Order your free kit
          </Link>
        </div>
      </div>
    </section>
  );
}
