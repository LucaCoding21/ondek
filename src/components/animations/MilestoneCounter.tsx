"use client";

import { useEffect, useState } from "react";

type Props = {
  target: number;
  finalText: string;
  duration?: number;
  delay?: number;
  start: boolean;
};

const EXPO_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function MilestoneCounter({
  target,
  finalText,
  duration = 2200,
  delay = 200,
  start,
}: Props) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      setDone(true);
      return;
    }

    let raf = 0;
    const startTime = performance.now() + delay;

    const tick = (now: number) => {
      if (now < startTime) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart — fast start, slow landing
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, delay]);

  // Both ghosts render invisibly in the same grid cell so the wrapper width
  // settles to whichever string is widest — anchors the layout so the visible
  // content swap (count → final text) doesn't shift width.
  const peakNumber = target.toLocaleString("en-US");

  return (
    <span className="inline-grid align-baseline">
      <span
        aria-hidden
        className="invisible whitespace-nowrap"
        style={{ gridArea: "1 / 1" }}
      >
        {peakNumber}
      </span>
      <span
        aria-hidden
        className="invisible whitespace-nowrap"
        style={{ gridArea: "1 / 1" }}
      >
        {finalText}
      </span>
      <span
        aria-hidden
        className="whitespace-nowrap"
        style={{ gridArea: "1 / 1" }}
      >
        <span
          className="inline-block"
          style={{
            opacity: done ? 1 : 0,
            transform: done ? "translateY(0)" : "translateY(6px)",
            transition: `opacity 0.45s ${EXPO_OUT}, transform 0.45s ${EXPO_OUT}`,
          }}
        >
          {done ? finalText : ""}
        </span>
        {!done && (
          <span className="inline-block">
            {count.toLocaleString("en-US")}
          </span>
        )}
      </span>
    </span>
  );
}
