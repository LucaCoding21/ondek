"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DOCUMENT_COUNT } from "@/lib/documents";

gsap.registerPlugin(useGSAP);

export default function DocsHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the hero fully visible and still.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load: the photo fades in while the headline rises out of its mask,
        // then the standfirst follows through.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".dh-frame", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0)
          .from(
            ".dh-heading-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            0.3,
          )
          .from(".dh-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.7);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  // Same construction as the blog hero: full bleed photo, title and standfirst
  // on the floor of the frame. data-hero keeps the nav transparent over it.
  return (
    <section
      ref={ref}
      data-hero
      className="relative h-dvh min-h-[600px] overflow-hidden"
    >
      {/* Photo and scrims share one frame so they fade in as a single layer */}
      <div className="dh-frame absolute inset-0">
        <Image
          src="/images/projects/grey-deck-black-railing.webp"
          alt="Grey OnDek vinyl deck with a black railing looking into forest"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-5 md:px-8 lg:px-12 xl:px-16 pt-32 lg:pt-40 pb-14 lg:pb-20 text-white">
        <div className="mt-auto">
          {/* The line lives inside an overflow-hidden mask and rises out of
              it on load. The pb/-mb pair gives descenders room inside the
              mask at this tight leading. */}
          <h1 className="font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.5rem,6vw,6.5rem)] lg:whitespace-nowrap">
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="dh-heading-line block">The whole library</span>
            </span>
          </h1>

          <p className="dh-sub mt-7 max-w-2xl text-lg text-white/75 leading-relaxed text-balance">
            {DOCUMENT_COUNT} documents and guides: drawings for every condition
            on a deck, product and safety data for everything that goes down
            with the membrane, the warranty, and the care routine.
          </p>
        </div>
      </div>
    </section>
  );
}
