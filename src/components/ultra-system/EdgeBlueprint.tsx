"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

import {
  EDGE_BLUEPRINT_LINES,
  EDGE_BLUEPRINT_VIEWBOX,
} from "@/lib/edgeBlueprint";

/**
 * The edge-profile blueprint, redrawn as paths so it can trace itself on
 * scroll. The path data lives in @/lib/edgeBlueprint because the dealer hero
 * draws the same profile on load; the viewBox matches the bitmap it replaces,
 * so this section's existing crop still frames it the same way.
 */

export default function EdgeBlueprint({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // No dash attributes in the markup: the paths render whole, and the
      // dashing is applied here in useLayoutEffect before the first paint.
      // Anyone without JS — or with reduced motion, which never enters this
      // branch — gets the finished drawing rather than an empty box.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scoped by hand: useGSAP's scope covers selector strings passed to
        // gsap methods, but toArray is a plain utility and would otherwise
        // query the whole document
        const lines = gsap.utils.toArray<SVGPathElement>(
          ".blueprint-line",
          ref.current,
        );
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });

        gsap.to(lines, {
          strokeDashoffset: 0,
          ease: "none",
          // Each stroke takes far longer than the gap between starts, so
          // several are always in flight at once. With a stagger wider than
          // the duration every line completed before the next began, which
          // reads as lines switching on rather than as one hand drawing.
          duration: 1.2,
          stagger: 0.22,
          scrollTrigger: {
            trigger: ref.current,
            // Starts level with where Reveal has finished fading the column
            // in, so the trace is never running against an invisible wrapper
            start: "top 85%",
            // A fixed run of scroll rather than a point on the element: the
            // svg is scaled 1.45× from its top and the section clips the
            // overflow, so its measured "bottom" sits well below anything
            // still on screen. Just over one screen of scroll is slow enough
            // to watch, and short enough that the drawing is still in frame
            // when the last line lands.
            end: "+=110%",
            scrub: 1,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox={EDGE_BLUEPRINT_VIEWBOX}
      role="img"
      aria-label="Line drawing of the Ultra membrane wrapping a deck edge"
      className={className}
      fill="none"
    >
      {EDGE_BLUEPRINT_LINES.map((d) => (
        <path
          key={d}
          className="blueprint-line"
          d={d}
          // Normalises every path to a length of 1, so one dashoffset tween
          // drives them all — a long edge and a short hook finish together
          // instead of the short ones snapping in and waiting.
          pathLength={1}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
