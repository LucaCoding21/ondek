"use client";

import Image from "@/components/SiteImage";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The top rule, spread across the band like the reference's meta row
const MARKS = [
  { value: "2004", label: "Innovative Aluminum established" },
  { value: "2020", label: "OnDek Vinyl Worx launched" },
  { value: "15 / 5", label: "Year warranty" },
];

// Mission, service and the closing invitation, all from OnDek's About page.
// Split four ways so they land in the reference's 2 x 2 grid.
const ENTRIES = [
  {
    n: "01",
    title: "What great service means",
    text: "From the beginning, one question guided everything we built: what does great service really mean? To us, it means being treated fairly, receiving the right products on time, and having confidence that what you purchase will perform as promised.",
  },
  {
    n: "02",
    title: "A team behind the order",
    text: "It also means knowing that a knowledgeable, responsive team is there to support you when you need it, offering fair pricing, dependable inventory, reasonable lead times, and consistent product quality.",
  },
  {
    n: "03",
    title: "Suppliers we can stand behind",
    text: "We work closely with proven suppliers whose products meet the standards our customers expect. Passing on lower-grade options that offer short-term savings is worth it: reliable, well-engineered material is worth more to your business and ours.",
  },
  {
    n: "04",
    title: "Working together",
    text: "If you are entering the decking market or looking to strengthen your current offering, our team would welcome the opportunity to speak with you about how OnDek Vinyl Worx can support your growth.",
  },
];

export default function AboutPrinciples() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The band is nearly two screens tall, so each block arrives on its
        // own trigger rather than all hanging off the section's top edge.
        gsap.from(".ap-mark", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".ap-marks", start: "top 85%", once: true },
        });

        // The signature move: the title rises out of its mask.
        gsap.from(".ap-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".ap-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".ap-quote", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ap-quote", start: "top 85%", once: true },
        });

        gsap.from(".ap-principle", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".ap-grid", start: "top 85%", once: true },
        });

        gsap.from(".ap-sign", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ap-sign", start: "top 88%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-surface">
      {/* Anchored to the bottom left corner and allowed to run off both edges,
          filling the gap the right-hand grid leaves. lg and up only: below
          that, the columns stack over this space. */}
      <div className="pointer-events-none absolute bottom-0 left-0 hidden aspect-[1465/936] w-[28rem] -translate-x-16 translate-y-10 lg:block xl:w-[36rem]">
        {/* Linework on transparency: the source's black vignette was stripped
            out, so no blend mode is needed to sit it on the band */}
        <Image
          src="/images/about-deck-sketch.webp"
          alt=""
          fill
          sizes="36rem"
          className="object-contain"
        />
      </div>

      <div className="relative w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-32">
        {/* Runs the full width of the page gutters: the meta row and the 2 x 2
            grid both want the room, and the measures below cap the text */}
        <div className="w-full">
          {/* Meta row: the three dates, spread and ruled off */}
          {/* Grouped at the left on an even gap rather than spread edge to
              edge, which stretched the three apart at full width */}
          <ul className="ap-marks flex flex-wrap items-baseline gap-x-12 gap-y-3 border-b border-foreground/15 pb-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
            {MARKS.map((mark) => (
              <li key={mark.value} className="ap-mark flex items-baseline gap-3">
                <span className="text-foreground tabular-nums">
                  {mark.value}
                </span>
                {mark.label}
              </li>
            ))}
          </ul>

          {/* Single thought, single mask. The pb/-mb pair leaves descenders
              room inside the mask at this tight leading. */}
          <h2 className="ap-heading mt-12 lg:mt-16 font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,7vw,6rem)]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="ap-heading-line block">Our mission</span>
            </span>
          </h2>

          <p className="ap-quote mt-8 max-w-3xl text-foreground/70 leading-relaxed">
            &ldquo;Our mission is to provide the highest possible level of
            professional construction products and service for our clients,
            in an atmosphere of mutual support, teamwork and uncompromising
            standards.&rdquo;
          </p>

          {/* The 2 x 2 grid, parked in the bottom right the way the reference
              sets it against the title and intro up on the left */}
          <div className="ap-grid mt-24 grid gap-x-16 gap-y-12 lg:mt-40 lg:ml-auto lg:w-[68%] lg:grid-cols-2 xl:gap-x-24">
            {ENTRIES.map((entry) => (
              <div key={entry.n} className="ap-principle flex gap-5">
                {/* Yellow type on the grey band was almost invisible, so the
                    accent carries the number. self-start keeps it a square
                    box: as a flex child it otherwise stretches the column */}
                <span className="grid size-10 shrink-0 self-start place-items-center bg-cta text-sm font-bold tabular-nums text-foreground">
                  {entry.n}
                </span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.1em]">
                    {entry.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-foreground/60 leading-relaxed">
                    {entry.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Signed, because the closing line is written in the first person.
              Parked in the bottom right, under the right edge of the grid */}
          <div className="ap-sign mt-24 lg:mt-40">
            <div className="lg:ml-auto lg:max-w-2xl lg:text-right">
              <p className="text-lg font-bold leading-snug">
                We look forward to delivering one of the most dependable vinyl
                decking experiences in the industry.
              </p>
              <p className="mt-5 text-sm text-foreground/60">
                <span className="font-bold text-foreground">Fred Hobeyn</span>,
                President, OnDek Vinyl Worx
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
