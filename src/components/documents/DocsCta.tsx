"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DocsCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the panel static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks, copy follows, and the two
        // actions arrive together as one pair.
        gsap.from(".dc-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".dc-panel",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".dc-copy", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".dc-panel",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".dc-cta", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: ".dc-panel",
            start: "top 78%",
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
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pb-24 lg:pb-32">
        {/* The same dark panel that closes the adhesive and warranty pages */}
        <div className="dc-panel bg-foreground p-8 sm:p-12 lg:p-16 text-white">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="dc-heading-line block">Can&apos;t find what</span>
                </span>
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="dc-heading-line block">
                    you&apos;re looking for?
                  </span>
                </span>
              </h2>
              <p className="dc-copy mt-5 text-sm text-white/70 leading-relaxed max-w-md">
                Tell us about your project and our team will point you to the
                right drawings and documents for it.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 lg:justify-end">
              <Link
                href={CTA_LINKS.quote.href}
                className="dc-cta inline-block px-7 py-3.5 font-bold btn-wipe-light text-foreground "
              >
                Contact us
              </Link>
              <Link
                href="/resources/faqs"
                className="dc-cta text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
              >
                Read the FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
