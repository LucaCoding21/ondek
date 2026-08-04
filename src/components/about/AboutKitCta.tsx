"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutKitCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // One arrival: the photo card rises, then the offer box's heading
        // climbs out of its mask while the copy and button settle in behind.
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top 78%",
            once: true,
          },
        });

        tl.from(".akc-card", { y: 70, opacity: 0, duration: 0.9 }, 0)
          .from(
            ".akc-heading-line",
            { yPercent: 115, duration: 1, ease: "power4.out" },
            0.25,
          )
          .from(
            ".akc-item",
            { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 },
            0.35,
          );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  // Same offer card as the designs page, different photo and framing: this one
  // closes a story about how the membrane is made, so the ask is to go feel it
  return (
    <section ref={ref} className="bg-background">
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <div className="akc-card relative overflow-hidden rounded-3xl min-h-[560px] lg:min-h-[620px]">
            <Image
              src="/images/projects/hillside-deck-autumn.webp"
              alt="OnDek vinyl deck on a hillside home surrounded by autumn trees"
              fill
              className="object-cover object-[50%_45%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-8 sm:bottom-8 sm:max-w-md bg-background p-7 sm:p-10">
              <p className="akc-item text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground/50">
                Free design kit
              </p>
              {/* Single thought, single mask. The pb/-mb pair leaves the
                  descenders room inside the mask. */}
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="akc-heading-line block">
                    Judge it the way we do.
                  </span>
                </span>
              </h2>
              <p className="akc-item mt-4 text-foreground/70 leading-relaxed">
                Everything on this page comes down to how the membrane feels in
                your hand. Order a free kit and we&apos;ll send real samples of
                the designs you&apos;re considering, no charge and no visit
                required.
              </p>
              <Link
                href={CTA_LINKS.designKit.href}
                className="akc-item mt-7 inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
              >
                Order your free kit
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
