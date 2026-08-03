"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

/** Every answer is carried by the warranty or care & maintenance page — no
 *  terms are stated here that aren't in one of those two documents */
const FAQS = [
  {
    q: "What does the warranty cover?",
    a: "A 15 Year Waterproofing / 5 Year Appearance warranty. Waterproofing covers our product failing to provide waterproofing performance; appearance covers excessive fading or discolouration over and above natural aging.",
  },
  {
    q: "What happens if the waterproofing is compromised?",
    a: "If it is compromised during the warranty period due to a manufacturer's defect, OnDek Vinyl Worx will repair or replace the affected area.",
  },
  {
    q: "Is fading covered?",
    a: "Only fading or discolouration that is excessive, over and above what would be considered natural aging. That coverage runs five years.",
  },
  {
    q: "How often does the deck need cleaning?",
    a: "Every three months. Mix mild dish soap and water in a bucket, agitate it over the surface with a mop or soft brush on a stick, and rinse thoroughly with a garden hose.",
  },
  {
    q: "Can I use a pressure washer?",
    a: "No. Rinse with water from a garden hose instead. A pressure washer is not part of the recommended routine.",
  },
  {
    q: "Do the seams need an annual inspection?",
    a: "No. UltraSeam performs a vinyl to vinyl weld, so seams are free of contamination and stronger than the vinyl itself. We don't expect seams to separate and we don't require annual inspections.",
  },
];

export default function WarrantyFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-surface text-foreground">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 pb-28 lg:pb-40">
        <SectionLabel>Questions &amp; answers</SectionLabel>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 xl:gap-24 lg:items-start">
          <Reveal>
            <h2 className="max-w-md font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.5rem)]">
              Straight answers on coverage and care.
            </h2>

            <p className="mt-8 max-w-md text-foreground/60 leading-relaxed">
              What the two warranties cover, what they don&apos;t, and the
              quarterly routine that keeps a deck looking the way it did on day
              one.
            </p>
          </Reveal>

          {/* Buttons rather than <details>: the answer has to animate open,
              and a grid row that grows from 0fr to 1fr is the one height
              transition that works without measuring anything. One open at a
              time — clicking the open question closes it. */}
          <Reveal stagger=".faq-item" className="flex flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q} className="faq-item bg-background">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      id={`faq-question-${i}`}
                      aria-controls={`faq-answer-${i}`}
                      className="group flex w-full cursor-pointer items-center justify-between gap-6 p-6 text-left sm:p-8"
                    >
                      <span className="text-base sm:text-lg font-bold leading-snug">
                        {faq.q}
                      </span>
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                          isOpen
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/20 group-hover:border-foreground/50"
                        }`}
                      >
                        <svg
                          className={`size-3.5 transition-transform duration-300 ease-out ${
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
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl px-6 pb-6 sm:px-8 sm:pb-8 text-sm text-foreground/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
