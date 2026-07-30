"use client";

import { useEffect, useRef, useState } from "react";
import MilestoneCounter from "@/components/animations/MilestoneCounter";

type Props = {
  target: number;
  finalText: string;
  delay?: number;
};

/** Self-observing count-up: starts its MilestoneCounter when scrolled into view. */
export default function StatCounter({ target, finalText, delay = 200 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
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

  return (
    <span ref={ref}>
      <span className="sr-only">{finalText}</span>
      <span aria-hidden className="text-right">
        <MilestoneCounter
          target={target}
          finalText={finalText}
          start={inView}
          delay={delay}
        />
      </span>
    </span>
  );
}
