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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-frame", { opacity: 0, scale: 0.98, duration: 1 }).from(
        ".hero-line",
        { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 },
        "-=0.5",
      );

      // The drawing sketches itself in behind the copy. Dashing is applied
      // here rather than in the markup so reduced-motion — which never enters
      // this branch — gets the finished drawing instead of an empty box.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<SVGPathElement>(
          ".blueprint-line",
          ref.current,
        );
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        tl.to(
          lines,
          { strokeDashoffset: 0, duration: 1.6, stagger: 0.14, ease: "none" },
          "-=0.6",
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
            corner cut, which is 52px under 640px and 104px above. */}
        <div className="hero-frame notch-frame-br-lg relative flex min-h-[calc(100dvh-var(--gutter)*2)] flex-col overflow-hidden bg-foreground text-white px-8 sm:px-14 lg:px-24 pt-36 sm:pt-44 lg:pt-56 pb-16 sm:pb-28">
          {/* Lifted above the drawing: it is absolutely positioned, so without
              a stacking context of its own the copy would paint underneath it.
              At this size the drawing reaches up behind the title, which is
              where it should read as an underlay rather than a collision. */}
          <div className="relative z-10">
            <p className="hero-line text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/45">
              Dealer program · Ultra system
            </p>

            <h1 className="hero-line mt-8 lg:mt-10 font-bold leading-[0.86] tracking-[-0.04em] text-[clamp(3.75rem,10vw,9.5rem)]">
              Become
              <br />a dealer
            </h1>

            <p className="hero-line mt-9 max-w-xl text-lg text-white/60 leading-relaxed">
              Every OnDek deck goes down through a dealer. If you build decks,
              roofs, or renovations, the Ultra system gives you a waterproof
              surface you can warranty for fifteen years.
            </p>

            <div className="hero-line mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
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
