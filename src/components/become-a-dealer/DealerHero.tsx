"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  EDGE_BLUEPRINT_LINES,
  EDGE_BLUEPRINT_VIEWBOX,
} from "@/lib/edgeBlueprint";

gsap.registerPlugin(useGSAP);

/**
 * Presentation-slide composition: one dark slab, the type block weighted into
 * the top-left corner and a thin technical drawing answering it bottom-right,
 * with hairline rules and small caps holding the two ends together.
 *
 * Carries [data-hero] so the navbar goes to its white-logo treatment over the
 * dark panel, and keeps the notched bottom-right corner the other sub-page
 * heroes use. The corner cut removes a 164×104 triangle, so nothing in the
 * bottom block may sit closer than that to the corner — hence the deep pb.
 */
export default function DealerHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — everything lives behind this media gate. Reduced-motion
      // users get the hero fully visible and still, with the drawing
      // finished rather than an empty box (the dashing is applied here, not
      // in the markup, and this branch never runs for them).
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load: the frame settles in while the headline lines rise out of
        // their masks; eyebrow, copy, and CTAs follow through.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-frame", { opacity: 0, scale: 0.98, duration: 0.6 })
          .from(
            ".dh-headline-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            "-=0.5",
          )
          .from(
            ".hero-line",
            { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 },
            "-=0.8",
          );

        // The drawing sketches itself in behind the copy, starting as soon
        // as the frame has begun to settle rather than waiting out the text
        const lines = gsap.utils.toArray<SVGPathElement>(
          ".blueprint-line",
          ref.current,
        );
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        tl.to(
          lines,
          { strokeDashoffset: 0, duration: 1.6, stagger: 0.14, ease: "none" },
          0.2,
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      <div className="p-[var(--gutter)]">
        {/* One viewport tall, inside the gutter frame. min-h rather than a
            fixed h so a short screen grows it instead of clipping. pt-28 is
            the minimum that clears the fixed navbar; pb has to clear the
            corner cut, which is 52px under 640px and 104px above. At lg the
            top padding tracks viewport height rather than sitting fixed, so
            the CTA row stays above the fold on short laptop screens. */}
        <div className="hero-frame notch-frame-br-lg relative flex min-h-[calc(100dvh-var(--gutter)*2)] flex-col overflow-hidden bg-foreground text-white px-8 sm:px-14 lg:px-24 pt-36 sm:pt-44 lg:pt-[clamp(7.5rem,18vh,14rem)] pb-16 sm:pb-28">
          {/* Lifted above the drawing: it is absolutely positioned, so without
              a stacking context of its own the copy would paint underneath it.
              At this size the drawing reaches up behind the title, which is
              where it should read as an underlay rather than a collision. */}
          <div className="relative z-10">
            {/* Each line in its own overflow mask, rising out on load. The
                pb/-mb pair leaves room inside the mask at this tight leading
                without adding visual space between the lines. */}
            {/* min() caps the width-driven size by viewport height too, so a
                wide-but-short laptop doesn't get a headline tall enough to
                push the CTAs below the fold */}
            <h1 className="font-bold leading-[0.86] tracking-[-0.04em] text-[clamp(3.75rem,min(10vw,14vh),9.5rem)]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="dh-headline-line block">Become</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="dh-headline-line block">a dealer</span>
              </span>
            </h1>

            <p className="hero-line mt-9 max-w-xl text-lg text-white/60 leading-relaxed">
              Our success is built on the strength of our dealers. Joining the
              OnDek network means joining a select team of deck professionals
              in strategic locations throughout North America.
            </p>

            <div className="hero-line mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="#apply"
                className="group inline-flex items-center gap-3 bg-white px-7 py-3.5 font-bold text-foreground transition-colors hover:bg-white/85"
              >
                Apply to become a dealer
                <svg
                  className="size-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 3v10m0 0 4-4m-4 4-4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/company/contact"
                className="group inline-flex items-center gap-3 px-2 py-3.5 font-bold text-white/80 transition-colors hover:text-white"
              >
                Talk to us first
                <svg
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

          {/* The counterweight in the bottom-right corner, out of flow: stacked
              under the copy it added most of the frame's height, and the
              reference has the two in opposite quadrants anyway. lg only,
              since below that the CTA row is wide enough to run into it.
              Deliberately hung past the bottom edge: the frame clips it, and
              the crop is the point. It runs up behind the title too, which is
              why the copy above carries its own stacking context. */}
          <div className="absolute -bottom-28 right-2 hidden w-[min(85%,64rem)] flex-col items-end lg:flex">
            <svg
              viewBox={EDGE_BLUEPRINT_VIEWBOX}
              role="img"
              aria-label="Line drawing of the Ultra membrane wrapping a deck edge"
              fill="none"
              className="w-full text-white/35"
            >
              {EDGE_BLUEPRINT_LINES.map((d) => (
                <path
                  key={d}
                  className="blueprint-line"
                  d={d}
                  // Normalised so one dashoffset tween drives every path — a
                  // long edge and a short hook finish together
                  pathLength={1}
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
