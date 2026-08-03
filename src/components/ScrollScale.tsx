"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollScaleProps = {
  children: React.ReactNode;
  className?: string;
  /** Scale at the edges of the scroll range; peaks at 1 mid-section */
  from?: number;
};

/**
 * Scrubs a subtle grow/shrink as the element crosses the viewport: smallest on
 * the way in, full size when centred, smallest again on the way out.
 */
export default function ScrollScale({
  children,
  className,
  from = 0.94,
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Skip on touch/narrow screens and for reduced-motion users — the copy
      // sits in normal flow there and scaling it just reads as jitter.
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            })
            .fromTo(
              ref.current,
              { scale: from },
              { scale: 1, ease: "none", duration: 1 }
            )
            .to(ref.current, { scale: from, ease: "none", duration: 1 });
        }
      );
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
