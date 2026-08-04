"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The steps run as a ruled table — number, what it is, what it does — with the
// actions sitting under the last rule. Same language as the comparison table
// above it, which is what makes the two read as one page.
const STEPS = [
  {
    n: "01",
    title: "One sheet over the whole deck",
    body: "68 mil membrane in 72-inch rolls, laid as a single surface.",
  },
  {
    n: "02",
    title: "Seams fused, not lapped",
    body: "Ultra Seam welding turns two rolls into one. No overlap to work loose.",
  },
  {
    n: "03",
    title: "Edges and penetrations sealed",
    body: "The membrane carries up walls and wraps the deck edge.",
  },
  {
    n: "04",
    title: "Water leaves at the perimeter",
    body: "Rain and snowmelt shed to the edge, never onto the joists.",
  },
];

/** Number, name, description — shared by the header row and every step */
const ROW =
  "grid grid-cols-[3rem_minmax(0,1fr)] gap-x-6 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-x-10";

export default function SystemSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the rest of the site.
        gsap.from(".sys-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".sys-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".sys-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".sys-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The photograph is the big arrival — a longer travel than the copy
        gsap.from(".sys-photo", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".sys-photo",
            start: "top 85%",
            once: true,
          },
        });

        // Header rule first, the four steps in order, actions last
        gsap.from([".sys-table-head", ".dry-step", ".sys-actions"], {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".sys-table",
            start: "top 82%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-24 lg:py-32">
        <SectionLabel>The system</SectionLabel>

        <div className="mt-10 max-w-4xl">
          {/* Split where the thought breaks, each line in its own mask. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h2 className="sys-heading mt-6 text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="sys-heading-line block">How the system</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="sys-heading-line block">keeps it dry</span>
            </span>
          </h2>
          <p className="sys-sub mt-6 max-w-xl text-lg text-foreground/60 leading-relaxed">
            Four things have to be true for a deck to stay dry. The membrane
            does all four at once.
          </p>
        </div>

        <div className="sys-photo relative mx-auto mt-14 h-64 max-w-[96rem] sm:h-80 lg:mt-16 lg:h-[32rem]">
          <Image
            src="/images/ultra-hero-deck.webp"
            alt="Vinyl membrane wrapping a finished deck edge over cedar framing"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 96rem, 100vw"
          />
        </div>

        {/* Capped and pushed right, against the left-set heading above it */}
        <div className="sys-table mt-24 max-w-4xl lg:ml-auto lg:mt-32">
          <div
            className={`sys-table-head ${ROW} pb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground/40`}
          >
            <span>Step</span>
            <span>What it is</span>
            <span className="hidden lg:block">What it does</span>
          </div>

          {STEPS.map(({ n, title, body }) => (
            <div
              key={n}
              className={`dry-step ${ROW} items-baseline border-t border-foreground/20 py-6 lg:py-7`}
            >
              <span className="text-sm font-bold tracking-[0.08em] text-foreground/40">
                {n}
              </span>
              <h3 className="text-base font-bold leading-snug lg:text-lg">
                {title}
              </h3>
              <p className="col-start-2 mt-2 text-foreground/60 leading-relaxed lg:col-start-3 lg:mt-0">
                {body}
              </p>
            </div>
          ))}

          {/* Actions sit under the closing rule, aligned right */}
          <div className="sys-actions flex flex-wrap items-center justify-end gap-x-8 gap-y-4 border-t border-foreground/20 pt-8">
            <Link
              href="/vinyl-decking/the-ultra-system"
              className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
            >
              See the full system, layer by layer
            </Link>
            <Link
              href={CTA_LINKS.quote.href}
              className="group inline-flex items-center gap-2.5 bg-cta px-7 py-3.5 font-bold text-foreground hover:brightness-95 transition-[filter]"
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
          </div>
        </div>
      </div>
    </section>
  );
}
