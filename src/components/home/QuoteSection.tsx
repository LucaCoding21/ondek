"use client";

import { useRef } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";
import CommunityProof from "@/components/CommunityProof";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function QuoteSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the hero and Design kit, kept consistent on purpose.
        gsap.from(".qs-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".qs-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Copy first, button just behind it — one composed arrival, on its
        // own trigger since it sits at the bottom of a tall card on lg.
        gsap.from(".qs-cta > *", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".qs-cta",
            start: "top 85%",
            once: true,
          },
        });

        // The photo is the biggest thing in the frame, so it gets the
        // deepest rise. The tween sits on the wrapper, which carries no
        // transforms of its own.
        gsap.from(".qs-image", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".qs-image",
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
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <div className="notch-frame bg-foreground text-white p-6 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div className="@container flex flex-col justify-between lg:min-h-[520px]">
              {/* Sized off the column, not the viewport: "Ready for a deck"
                  measures 7.35em in Ubuntu Bold at this tracking, so 12.5cqw
                  is the ceiling that still holds two lines at any width —
                  set below it here by choice. */}
              {/* Split where the thought breaks, each line in its own mask.
                  The pb/-mb pair leaves descenders room inside the mask. */}
              <h2 className="qs-heading lg:mt-10 text-4xl sm:text-[clamp(3rem,11cqw,6rem)] font-bold leading-[1.02] tracking-tight">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="qs-heading-line block">
                    Ready for a deck
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="qs-heading-line block">that lasts?</span>
                </span>
              </h2>

              <div className="qs-cta mt-14 max-w-md">
                <p className="text-lg leading-relaxed text-white/70">
                  Tell us about your project and we&apos;ll connect you with
                  an authorized OnDek dealer in your area.
                </p>
                <Link
                  href={CTA_LINKS.quote.href}
                  className="mt-6 inline-block btn-wipe-light px-6 py-3 font-bold text-foreground "
                >
                  {CTA_LINKS.quote.label}
                </Link>

                <CommunityProof dark className="mt-8" />
              </div>
            </div>

            {/* Same chamfer as the frame around it, so the image echoes the
                container's bottom-right cut instead of squaring it off. */}
            <div className="qs-image notch-frame-br relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <Image
                src="/images/grey-deck-mountain-view.jpg"
                alt="Covered grey vinyl deck with glass railing looking out over the mountains"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
