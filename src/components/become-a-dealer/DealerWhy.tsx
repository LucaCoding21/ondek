"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DealerCommitments from "@/components/become-a-dealer/DealerCommitments";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DealerWhy() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the rest of the site.
        gsap.from(".dw-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".dw-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The two paragraphs sit far down a tall column, so each carries its
        // own trigger rather than firing with the heading.
        gsap.utils.toArray<HTMLElement>(".dw-copy").forEach((el) => {
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        // The photo — a large card with longer travel
        gsap.from(".why-shot", {
          y: 70,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dw-shots",
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 pb-28 lg:pb-40">
        {/* Slide composition: heading pinned top-left, the copy dropped to the
            foot of the column, and the image pair bottom-right. The empty
            middle of the left column is the point — nothing goes in it. */}
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)] lg:gap-16 xl:gap-24">
          <div className="flex flex-col lg:min-h-[34rem]">
            {/* Each line in its own overflow mask, rising out on scroll */}
            <h2 className="dw-heading max-w-lg font-bold uppercase leading-[1.05] tracking-[-0.01em] text-[clamp(1.9rem,3.6vw,3.25rem)]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="dw-heading-line block">Why partner</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="dw-heading-line block">with us</span>
              </span>
            </h2>

            <p className="dw-copy mt-16 lg:mt-auto lg:pt-24 max-w-xl text-lg text-foreground/80 leading-relaxed">
              Fresh, exciting patterns that generate profits for our dealers:
              an attractive, long lasting, low maintenance waterproofing
              solution designed for today&apos;s educated consumer.
            </p>

            {/* Sat at the reference's caption size and was unreadable — kept
                subordinate to the paragraph above it, but on a rule and at a
                size that can actually be read */}
            <p className="dw-copy mt-10 lg:mt-14 max-w-lg border-t border-foreground/20 pt-6 text-sm text-foreground/60 leading-relaxed">
              More than 3 million square feet of membrane has gone down to date,
              every foot of it under a 15 Year Waterproofing / 5 Year Appearance
              warranty.
            </p>
          </div>

          {/* Single bottom-aligned shot filling the right column */}
          <div className="dw-shots lg:mt-auto">
            <div className="why-shot relative h-72 sm:h-96 lg:h-[30rem] overflow-hidden">
              <Image
                src="/images/grey-deck-lake-view.jpg"
                alt="Grey vinyl deck with glass railing overlooking a lake"
                fill
                sizes="(min-width: 1024px) 46rem, 95vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <DealerCommitments />
      </div>
    </section>
  );
}
