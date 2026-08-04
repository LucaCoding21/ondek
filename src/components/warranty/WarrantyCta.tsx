"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WarrantyCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the panel static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The panel lands first; the heading then rises out of its masks
        // with copy and the CTA pair following through.
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".wcta-panel",
              start: "top 85%",
              once: true,
            },
          })
          .from(".wcta-panel", { y: 36, opacity: 0, duration: 0.9 }, 0)
          .from(
            ".wcta-heading-line",
            { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.14 },
            0.15,
          )
          .from(".wcta-copy", { y: 24, opacity: 0, duration: 0.8 }, 0.35)
          // Both routes rise as one gesture — the pair shares a wrapper, so
          // there is no stagger between them
          .from(".wcta-actions", { y: 24, opacity: 0, duration: 0.7 }, 0.5);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pb-24 lg:pb-32">
        {/* Same dark panel that closes the adhesive page — the warranty comes
            with the system, so the ask is the same one */}
        <div className="wcta-panel bg-foreground p-8 sm:p-12 lg:p-16 text-white">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              {/* Split where the thought breaks, each line in its own mask.
                  The pb/-mb pair leaves the descender of the y room inside
                  the mask. */}
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="wcta-heading-line block">Peace of mind,</span>
                </span>
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="wcta-heading-line block">
                    in writing
                  </span>
                </span>
              </h2>
              <p className="wcta-copy mt-5 text-sm text-white/70 leading-relaxed max-w-md">
                Waterproofing and appearance are covered by the same document,
                and every OnDek deck goes down through a dealer. Tell us about
                your project and we will connect you with one in your area.
              </p>
            </div>

            <div className="wcta-actions flex flex-wrap items-center gap-6 lg:justify-end">
              <Link
                href={CTA_LINKS.quote.href}
                className="inline-block px-7 py-3.5 font-bold btn-wipe-light text-foreground "
              >
                {CTA_LINKS.quote.label}
              </Link>
              <Link
                href="/resources/documents"
                className="text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
              >
                See all documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
