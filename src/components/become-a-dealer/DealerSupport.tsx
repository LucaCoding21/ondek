"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Copy drawn from the old site: the Dealer Sales Kit and sell sheets (home
 * slide 2), "pre and post sales support ... comprehensive product sales
 * training" (dealers page), and the closing line verbatim from the home
 * page's dealer column. No schedule, cost, certification, or response time
 * is promised because OnDek publishes none.
 *
 * Full-bleed looping video with the copy set straight onto it, small block into
 * the top-right corner and the larger one bottom-left. The two gradients are
 * what make that legible over a bright sky and a shadowed foreground; without
 * them the top block sits on blue and disappears.
 */
export default function DealerSupport() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline line rises out of its mask — the same signature move as
        // the rest of the site.
        gsap.from(".dsu-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".dsu-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".dsu-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dsu-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The closing statement and its link sit a screen further down, so
        // they arrive on their own trigger — copy first, link just behind.
        gsap.from(".dsu-close > *", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".dsu-close",
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
      <div className="relative overflow-hidden">
        {/* Silent 10s loop cut from the OnDek promo reel; the audio track is
            stripped from the file itself, so muted here is belt-and-braces
            for autoplay policy */}
        <video
          src="/videos/dealer-support.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-label="OnDek installers at work, looping silently"
          className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
        />

        <div className="absolute inset-0 bg-black/35" />
        {/* Light gradients top and bottom — just enough to seat the copy on
            the footage without dimming the frame */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {/* lg height tracks the video's 16:9 frame, so it shows uncropped;
            below lg the copy needs more height than the ratio gives, so svh
            keeps ruling there */}
        <div className="relative z-10 flex min-h-[85svh] lg:min-h-[56.25vw] flex-col justify-between gap-24 px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 text-white">
          {/* Everything introductory in the top-left corner, the statement and
              the way out of the section in the bottom-right */}
          <div className="max-w-2xl">
            {/* One thought, one mask — the line rises out of it on scroll */}
            <h2 className="dsu-heading font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,4.5vw,3.5rem)] sm:whitespace-nowrap">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="dsu-heading-line block">
                  Training and support
                </span>
              </span>
            </h2>

            <p className="dsu-sub mt-6 max-w-md text-base leading-relaxed text-white">
              High-impact sell sheets and a comprehensive Dealer Sales Kit
              help our dealers increase sales, backed by product sales
              training and pre and post sales support.
            </p>
          </div>

          <div className="dsu-close max-w-2xl sm:self-end">
            <p className="text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.4] tracking-[-0.01em] text-balance">
              We support our dealer network with the best waterproof vinyl
              decking products, marketing tools, and customer service in the
              industry.
            </p>

            <Link
              href="/resources/documents"
              className="mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-cta hover:decoration-2"
            >
              See the documents dealers work from
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
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
    </section>
  );
}
