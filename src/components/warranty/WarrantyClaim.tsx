"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * PLACEHOLDER PROCESS — confirm with OnDek before this page goes live.
 *
 * The published warranty page states the outcome ("OnDek Vinyl Worx will
 * repair or replace the affected area") but no claim procedure: no forms, no
 * notice period, no registration. Step 03 below is the source's own wording;
 * steps 01 and 02 describe an ordinary dealer-first path and are NOT quoted
 * from any OnDek document. They make no promise about timelines or eligibility
 * on purpose — swap them for the real procedure once it is supplied.
 */
const STEPS = [
  {
    title: "Start with your dealer",
    text: "Your OnDek dealer installed the deck and holds the details of the job, so they are the fastest place to begin.",
    // Storefront — the dealer
    icon: (
      <>
        <path d="M4 9.5V20h16V9.5" />
        <path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" />
      </>
    ),
  },
  {
    title: "Send the details",
    text: "Photos of the affected area, the address, and roughly when the deck went down are enough for us to take a look.",
    // Photo
    icon: (
      <>
        <path d="M3 8h3.5L8 5.5h8L17.5 8H21v11H3V8Z" />
        <circle cx="12" cy="13" r="3.25" />
      </>
    ),
  },
  {
    title: "Repair or replace",
    text: "If waterproofing performance is compromised due to a manufacturer's defect, OnDek Vinyl Worx will repair or replace the affected area.",
    // Shield
    icon: (
      <>
        <path d="M12 3 20 6v6.5c0 4-3.4 7.2-8 8.5-4.6-1.3-8-4.5-8-8.5V6l8-3Z" />
        <path d="m9 12 2.25 2.25L15.5 10" />
      </>
    ),
  },
];

export default function WarrantyClaim() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the site's signature move
        gsap.from(".claim-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".claim-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".claim-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".claim-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The three step cards rise in order, 01 through 03
        gsap.from(".claim-card", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".claim-grid",
            start: "top 80%",
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
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-12 lg:pt-16 pb-28 lg:pb-40">
        <SectionLabel>Making a claim</SectionLabel>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20 lg:items-end">
          {/* Split where the thought breaks, each line in its own mask. The
              pb/-mb pair leaves the descender of the g room inside the mask. */}
          <h2 className="claim-heading max-w-2xl font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.75rem)]">
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="claim-heading-line block">How to register</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="claim-heading-line block">a claim</span>
            </span>
          </h2>
          <p className="claim-sub max-w-md text-foreground/60 leading-relaxed lg:pb-2">
            Three steps, and none of them involve paperwork you don&apos;t
            already have. The warranty document holds the complete terms.
          </p>
        </div>

        <div className="claim-grid mt-14 lg:mt-20 grid gap-4 lg:gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="claim-card flex flex-col border border-foreground bg-background p-8 lg:p-10"
            >
              <span className="block font-bold leading-none tracking-[-0.02em] tabular-nums text-[clamp(1.75rem,3vw,2.5rem)] text-cta">
                {String(i + 1).padStart(2, "0")}
              </span>

              <svg
                className="mt-8 size-9 text-foreground/85"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {step.icon}
              </svg>

              <h3 className="mt-auto pt-10 text-lg font-bold leading-snug">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
