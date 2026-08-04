"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MilestoneCounter from "@/components/animations/MilestoneCounter";
import CommunityProof from "@/components/CommunityProof";
import { CTA_LINKS } from "@/lib/nav";

const EXPO_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

// All marks flattened to a single grey (#8a8a8a) so the row reads as one
// texture. Intrinsic sizes are the real trimmed ratios — they reserve space
// so the track doesn't reflow as logos decode.
const PARTNERS = [
  { name: "ASTM International", src: "/images/partners/astm.png", w: 131, h: 120 },
  { name: "CGSB", src: "/images/partners/cgsb.png", w: 340, h: 120 },
  { name: "ICC", src: "/images/partners/icc.png", w: 116, h: 120 },
  { name: "PRI", src: "/images/partners/pri.png", w: 227, h: 120 },
  { name: "QAI Laboratories", src: "/images/partners/qai.png", w: 120, h: 120 },
  { name: "Innovative", src: "/images/partners/innovative.svg", w: 473, h: 160 },
  { name: "rpi consultants", src: "/images/partners/rpi-consultants.svg", w: 1219, h: 419 },
];

// Triple the set so there's enough content for a seamless infinite loop.
// The -33.333% translate is a function of copy count, not logo count.
const TRACK = [...PARTNERS, ...PARTNERS, ...PARTNERS];

const BLURB =
  "We supply waterproof vinyl membranes that protect decks, balconies, and roof decks across North America. Every membrane meets and exceeds national building codes, independently tested and certified.";

export default function TrustBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maskLine = (duration: number) => ({
    transform: inView ? "translateY(0%)" : "translateY(100%)",
    transition: `transform ${duration}s ${EXPO_OUT} 0.2s`,
  });

  return (
    <section
      ref={sectionRef}
      className="bg-background overflow-hidden"
      aria-label="Trusted by industry leaders"
    >
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee 80s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Band A — trust bar */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-12 lg:px-20 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: headline */}
          <div ref={headingRef}>
            <h2 className="sr-only">3 million square feet installed.</h2>
            <div className="overflow-hidden pb-[0.2em]">
              <div
                aria-hidden
                className="font-bold leading-[1.1] tabular-nums text-[clamp(2.25rem,3.4vw,3rem)]"
                style={maskLine(1.8)}
              >
                <MilestoneCounter
                  target={3_000_000}
                  finalText="3 Million +"
                  start={inView}
                />
              </div>
            </div>
            <div className="overflow-hidden pb-[0.2em]">
              <div
                aria-hidden
                className="font-bold leading-[1.1] text-[clamp(2.25rem,3.4vw,3rem)]"
                style={maskLine(2.2)}
              >
                Square Feet Installed.
              </div>
            </div>
            <CommunityProof className="mt-4" />
          </div>

          {/* Right: description + CTAs */}
          <div>
            {/* Mobile: one block fade. Toggled in CSS, not JS, so SSR matches. */}
            <p
              className="md:hidden text-[#2a2a2a] text-base leading-relaxed mb-8"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.8s ${EXPO_OUT} 0.6s, transform 0.8s ${EXPO_OUT} 0.6s`,
              }}
            >
              {BLURB}
            </p>

            {/* Desktop: word-by-word */}
            <p
              aria-label={BLURB}
              className="hidden md:block text-[#2a2a2a] text-base leading-relaxed mb-8"
            >
              {BLURB.split(" ").map((word, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="inline-block mr-[0.3em]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.6s ${EXPO_OUT} ${0.6 + i * 0.06}s, transform 0.6s ${EXPO_OUT} ${0.6 + i * 0.06}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/vinyl-decking/designs-colours"
                className="inline-flex min-h-11 items-center justify-center px-10 py-3.5 text-sm font-bold uppercase tracking-[0.06em] btn-wipe "
              >
                Explore Products
              </Link>
              <Link
                href={CTA_LINKS.designKit.href}
                className="group inline-flex items-center gap-2 font-bold hover:text-foreground/60 transition-colors"
              >
                Get a free design kit
                <svg
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
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
      </div>

      {/* Divider — the label straddles the rule like a fieldset legend */}
      <div className="relative border-t border-[#e8e3db]">
        <span className="absolute left-6 md:left-10 lg:left-16 -translate-y-1/2 bg-background px-3 text-[0.65rem] uppercase tracking-[0.2em] text-[#a89d8e]">
          Trusted By
        </span>
      </div>

      {/* Band C — infinite logo marquee */}
      <div className="py-12 md:py-16">
        <div className="relative overflow-hidden">
          <div
            className="marquee-track flex items-center whitespace-nowrap w-max"
            aria-hidden
          >
            {TRACK.map((partner, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={partner.src}
                alt=""
                width={partner.w}
                height={partner.h}
                // First set is in the initial viewport — don't lazy-load it
                loading={i < PARTNERS.length ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="mx-10 md:mx-14 inline-block h-10 md:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 select-none"
              />
            ))}
          </div>
        </div>
        {/* One accessible pass over the names, since the track repeats 3× */}
        <p className="sr-only">
          Trusted by {PARTNERS.map((p) => p.name).join(", ")}.
        </p>
      </div>
    </section>
  );
}
