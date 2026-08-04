"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHOTOS = [
  "/images/community/homeowner-1.jpg",
  "/images/community/homeowner-2.jpg",
  "/images/community/homeowner-3.jpg",
];

/**
 * The "Trusted in 200+ homes" row: three faces popping in one after another,
 * each landing knocking the text sideways before it springs back. Self
 * contained — drop it next to any ask and it runs its own scroll trigger.
 */
export default function CommunityProof({
  dark = false,
  className = "",
}: {
  /** On dark panels the text lightens and the avatar rings match the panel */
  dark?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the row static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });

        // Text is present from the start (quiet fade) so the photo pops
        // have something to knock into.
        tl.from(".cp-text", {
          opacity: 0,
          y: 8,
          duration: 0.6,
          ease: "power2.out",
        });

        // Photos pop 1 → 2 → 3 with an overshoot, and each landing kicks
        // the text sideways; the elastic return is the recoil.
        PHOTOS.forEach((_, i) => {
          const popAt = 0.2 + i * 0.35;
          tl.from(
            `.cp-avatar-${i}`,
            { scale: 0, duration: 0.8, ease: "back.out(2.2)" },
            popAt,
          )
            .to(
              ".cp-text",
              { x: 5, duration: 0.12, ease: "power2.out" },
              popAt + 0.2,
            )
            .to(
              ".cp-text",
              { x: 0, duration: 0.7, ease: "elastic.out(1.1, 0.4)" },
              ">",
            );
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 text-lg font-medium ${
        dark ? "text-white/60" : "text-foreground/60"
      } ${className}`}
    >
      <span className="flex -space-x-2.5" aria-hidden>
        {PHOTOS.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={32}
            height={32}
            className={`cp-avatar-${i} size-8 rounded-full object-cover ring-2 ${
              dark ? "ring-foreground" : "ring-background"
            }`}
          />
        ))}
      </span>
      <span className="cp-text">Trusted in 200+ homes</span>
    </div>
  );
}
