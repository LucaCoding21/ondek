"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * OnDek's own dealer copy, supplied verbatim. Do not paraphrase or extend it:
 * these are commitments the company is making, not descriptions of the
 * product.
 *
 * "Home show support" was part of the same copy but arrived as a bare heading
 * with no body. It is left out rather than shown as a row that opens onto
 * nothing; add it back once OnDek supplies the sentence.
 */
const COMMITMENTS = [
  {
    title: "Experience true customer service",
    text: "At OnDek Vinyl Worx Inc., we believe it’s a privilege to participate in your business. We are committed to building a lasting partnership with our customers by providing competitive pricing for the best quality products, customer service and training in the industry.",
    image: "/images/certified-installers-training.jpg",
    alt: "Two newly certified OnDek installers holding their certificates of completion in the training shop",
  },
  {
    title: "Valuing a dealer’s investment",
    text: "We value a company’s investment in our business, and in return, we are committed to supporting our dealer network with the best decking products, marketing tools and customer service available.",
    image: "/images/certified-installers-training.jpg",
    alt: "Two newly certified OnDek installers holding their certificates of completion in the training shop",
  },
  {
    title: "Sales support",
    text: "We provide pre and post sales support to our dealers with industry leading product expertise, responsiveness, comprehensive product sales training and market support.",
    image: "/images/certified-installers-training.jpg",
    alt: "Two newly certified OnDek installers holding their certificates of completion in the training shop",
  },
  {
    title: "Promotional materials",
    text: "We offer creative marketing and promotional support, and we work closely with our dealers to help them identify opportunities in their local markets to build their business and achieve their performance targets.",
    image: "/images/certified-installers-training.jpg",
    alt: "Two newly certified OnDek installers holding their certificates of completion in the training shop",
  },
];

/** Number gutter, so an open panel lines up under the title and not the number */
const INDENT = "pl-12 lg:pl-16";

export default function DealerCommitments() {
  // First row open on arrival, the way the reference shows it. One at a time:
  // clicking the open row closes it.
  const [open, setOpen] = useState<number | null>(0);
  // Which photo is showing. Tracked apart from `open` so closing a row leaves
  // the picture where it was rather than snapping the panel back to the first.
  const [shown, setShown] = useState(0);

  const toggle = (i: number) => {
    setOpen(open === i ? null : i);
    setShown(i);
  };

  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the block static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the rest of the site.
        gsap.from(".dc-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".dc-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The photo frame arrives whole; the cross-fading images inside it
        // carry their own state-driven opacity, so the tween stays on the
        // frame and never touches them.
        gsap.from(".dc-photo", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dc-photo",
            start: "top 85%",
            once: true,
          },
        });

        // The rows settle in one after another
        gsap.from(".commitment-row", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".dc-list",
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
    <div ref={ref} className="mt-28 lg:mt-40">
      {/* Pulled out of the columns and set into the top-right corner, so the
          block opens on the statement rather than on the list */}
      <div className="flex lg:justify-end">
        {/* Each line in its own overflow mask, rising out on scroll */}
        <h3 className="dc-heading font-bold uppercase leading-[1.02] tracking-[-0.02em] text-[clamp(2rem,4.8vw,4.25rem)] lg:text-right">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="dc-heading-line block">Our commitment</span>
          </span>
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="dc-heading-line block">to dealers</span>
          </span>
        </h3>
      </div>

      <div className="mt-16 grid gap-12 lg:mt-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 xl:gap-24">
        <div>
          {/* The photos live stacked in one frame and cross-fade, so the column
              never reflows and nothing below it moves when the row changes */}
          <div className="dc-photo relative aspect-[4/5] w-full overflow-hidden lg:max-h-[34rem]">
            {COMMITMENTS.map((item, i) => (
              <Image
                key={item.title}
                src={item.image}
                alt={item.alt}
                aria-hidden={shown !== i}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className={`object-cover transition-opacity duration-500 ease-out ${
                  shown === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Buttons rather than <details>: the panel has to animate open, and a
            grid row growing from 0fr to 1fr is the one height transition that
            works without measuring anything first. Inset and dropped a little
            on lg so the list sits into the bottom-right of the block. */}
        <div className="dc-list border-b border-foreground/15 lg:mt-12 lg:pl-6 xl:pl-12">
          {COMMITMENTS.map((item, i) => {
            const isOpen = open === i;
            const number = String(i + 1).padStart(2, "0");

            return (
              <div
                key={item.title}
                className="commitment-row border-t border-foreground/15"
              >
                <h4>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    id={`commitment-${i}`}
                    aria-controls={`commitment-panel-${i}`}
                    className="group flex w-full cursor-pointer items-center gap-6 py-6 text-left lg:gap-10"
                  >
                    <span className="w-6 shrink-0 text-xs font-bold tabular-nums text-foreground/40">
                      {number}
                    </span>

                    <span className="flex-1 text-base font-bold leading-snug lg:text-lg">
                      {item.title}
                    </span>

                    <svg
                      className={`size-3.5 shrink-0 text-foreground/40 transition-all duration-300 ease-out group-hover:text-foreground ${
                        isOpen ? "-rotate-180" : ""
                      }`}
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="m4 6 4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </h4>

                <div
                  id={`commitment-panel-${i}`}
                  role="region"
                  aria-labelledby={`commitment-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`${INDENT} max-w-2xl pb-8 pr-6 text-sm text-foreground/60 leading-relaxed lg:pb-10 lg:text-base`}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
