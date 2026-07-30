"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Selector for children to stagger; omit to animate the wrapper itself */
  stagger?: string;
  delay?: number;
  y?: number;
};

export default function Reveal({
  children,
  className,
  stagger,
  delay = 0,
  y = 40,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = stagger
        ? ref.current!.querySelectorAll(stagger)
        : ref.current;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
