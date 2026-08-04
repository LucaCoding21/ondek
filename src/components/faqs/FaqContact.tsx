"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FaqContact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the panel static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading rises out of its mask, copy follows, and the two actions
        // arrive together as one pair.
        gsap.from(".fc-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".fc-panel",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".fc-copy", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".fc-panel",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".fc-cta", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: ".fc-panel",
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
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-24 lg:py-32">
        {/* The same dark panel that closes the adhesive and warranty pages */}
        <div className="fc-panel bg-foreground p-8 sm:p-12 lg:p-16 text-white">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="fc-heading-line block">
                    Still have questions?
                  </span>
                </span>
              </h2>
              <p className="fc-copy mt-5 text-sm text-white/70 leading-relaxed max-w-md">
                Tell us about the deck: the substrate, the size, and what sits
                underneath it, and we&apos;ll come back with a straight answer
                and a dealer in your area. The technical documents are all here
                too, if you would rather read first.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 lg:justify-end">
              <Link
                href={CTA_LINKS.quote.href}
                className="fc-cta inline-block px-7 py-3.5 font-bold btn-wipe-light text-foreground "
              >
                {CTA_LINKS.quote.label}
              </Link>
              <Link
                href="/resources/documents"
                className="fc-cta text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
              >
                Browse documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
