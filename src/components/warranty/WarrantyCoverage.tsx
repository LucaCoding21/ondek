"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WARRANTY_PDF =
  "https://ondekvinylworx.com/wp-content/uploads/2020/02/ONDEK-VINYL-WORX-WARRANTY-20feb2020.pdf";

/**
 * Straight from the warranty page — do not embellish. The first two entries
 * are the published terms. The third states the limits those same sentences
 * imply — natural aging sits outside the appearance clause, and the
 * waterproofing clause is written around a manufacturer's defect — and points
 * at the PDF rather than listing exclusions OnDek has not published.
 */
const ENTRIES = [
  {
    title: "15 year waterproofing",
    text: "Protects the home owner and builder from our product failing to provide waterproofing performance. If it is compromised during this time due to a manufacturer's defect, OnDek Vinyl Worx will repair or replace the affected area.",
    // Droplet over a shield
    icon: (
      <>
        <path d="M12 3 19.5 6v6c0 3.8-3.2 6.9-7.5 8.2C7.7 18.9 4.5 15.8 4.5 12V6L12 3Z" />
        <path d="M12 8.5c1.6 1.8 2.5 3 2.5 4.1a2.5 2.5 0 0 1-5 0c0-1.1.9-2.3 2.5-4.1Z" />
      </>
    ),
  },
  {
    title: "5 year appearance",
    text: "Covers excessive fading or discolouration over and above what would be considered natural aging, so the colour you chose stays the colour on the deck.",
    // Sun over a surface line
    icon: (
      <>
        <circle cx="12" cy="10" r="3.5" />
        <path d="M12 3v1.5M12 15.5V17M5.5 10H4M20 10h-1.5M7.4 5.4 6.3 4.3M17.7 4.3l-1.1 1.1M7.4 14.6l-1.1 1.1M17.7 15.7l-1.1-1.1" />
        <path d="M3.5 20.5h17" />
      </>
    ),
  },
  {
    title: "Where the coverage stops",
    text: "Natural aging is not a defect: fading and discolouration within what would be considered normal are outside the appearance warranty, and the waterproofing warranty is written around a manufacturer's defect. See the warranty document for the complete terms.",
    // Circle with a rule through it
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8 12h8" />
      </>
    ),
  },
];

export default function WarrantyCoverage() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the site's signature move
        gsap.from(".cov-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".cov-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Copy first, download link just behind it
        gsap.from(".cov-copy", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".cov-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The photo sits at the foot of the left column, so it rides its own
        // trigger
        gsap.from(".cov-img", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cov-img",
            start: "top 85%",
            once: true,
          },
        });

        // The three entries settle in down the ruled column
        gsap.from(".cov-entry", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".cov-entries",
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
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-14 lg:pt-20 pb-32 lg:pb-48">
        <SectionLabel>Coverage</SectionLabel>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,8fr)_minmax(0,6fr)] lg:gap-12 xl:gap-16 lg:items-stretch">
          <div className="flex flex-col">
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="cov-heading max-w-2xl font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(2.25rem,3.6vw,3.5rem)]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="cov-heading-line block">What the</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="cov-heading-line block">
                  warranty covers
                </span>
              </span>
            </h2>

            <p className="cov-copy mt-8 max-w-2xl text-foreground/60 leading-relaxed">
              OnDek Vinyl Worx is pleased to offer our customers a 15 Year
              Waterproofing / 5 Year Appearance warranty. More than 3 million
              square feet of membrane has gone down under it to date.
            </p>

            {/* The tween rides this wrapper, not the link — the link carries
                a transition-all of its own that would fight the entrance */}
            <div className="cov-copy">
              <a
                href={WARRANTY_PDF}
                target="_blank"
                rel="noopener"
                className="mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
              >
                Download the 15 / 5 year warranty
                <svg
                  className="size-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13h11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">, PDF, opens in a new tab</span>
              </a>
            </div>

            {/* What the terms are written about. mt-auto drops it into the
                bottom-left corner, level with the last entry. */}
            <div className="cov-img relative mt-16 aspect-[16/10] w-full overflow-hidden sm:max-w-lg lg:mt-auto lg:max-w-[34rem]">
              <Image
                src="/images/hero-deck.jpg"
                alt="Finished OnDek vinyl deck off the back of a house"
                fill
                preload
                sizes="(min-width: 1024px) 34rem, (min-width: 640px) 32rem, 100vw"
                className="object-cover object-[50%_65%]"
              />
            </div>
          </div>

          {/* A ruled line divides the entries. The first one carries none —
              nothing sits above it to divide it from. */}
          <div className="cov-entries flex flex-col gap-16 lg:gap-24 lg:max-w-[46rem]">
            {ENTRIES.map((entry, i) => (
              <div key={entry.title} className="cov-entry">
                {i > 0 && <div className="border-t border-foreground/20" />}

                <svg
                  className="mt-10 size-8 text-foreground/80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {entry.icon}
                </svg>

                <h3 className="mt-9 text-xl font-bold leading-snug">
                  {entry.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base text-foreground/60 leading-relaxed">
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
