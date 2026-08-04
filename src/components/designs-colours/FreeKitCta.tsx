"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FreeKitCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // One composed arrival: the big photo frame rises first, then the
        // heading lines climb out of their masks, then the offer card's copy
        // and CTA follow through.
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top 78%",
            once: true,
          },
        });

        tl.from(".fk-frame", { y: 70, opacity: 0, duration: 0.9 }, 0)
          .from(
            ".fk-heading-line",
            { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.14 },
            0.25,
          )
          .from(
            ".fk-follow",
            { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 },
            0.45,
          );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <div className="fk-frame relative overflow-hidden rounded-3xl min-h-[560px] lg:min-h-[620px]">
          <Image
            src="/images/hero-deck-backyard.jpg"
            alt="Waterproof vinyl deck overlooking a backyard"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          {/* The offer card */}
          <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-8 sm:bottom-8 sm:max-w-md bg-background p-7 sm:p-10">
            <p className="fk-follow text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground/50">
              Free design kit
            </p>
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="fk-heading-line block">See every colour</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="fk-heading-line block">
                  in your own light.
                </span>
              </span>
            </h2>
            <p className="fk-follow mt-4 text-foreground/70 leading-relaxed">
              Photos only get you so far. Order real vinyl samples of the
              designs you&apos;re considering and match them against your
              home before you decide.
            </p>
            <div className="fk-follow">
              <Link
                href={CTA_LINKS.designKit.href}
                className="mt-7 inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
              >
                Order your free kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
