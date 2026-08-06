"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";
import { DESIGNS, DESIGN_TAG_LABELS } from "@/lib/designs";
import SectionLabel from "@/components/SectionLabel";
import DesignLightbox from "@/components/designs-colours/DesignLightbox";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Shown in pattern-series order: the Speckled Stones fill the top row, the
// Granites the middle, and the remaining colours the last. Coming-soon
// colours sit in the grid with everything else, marked under their name.
const SWATCHES = DESIGNS;

export default function DesignsIntro() {
  const ref = useRef<HTMLElement>(null);
  const [openAt, setOpenAt] = useState<number | null>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks — the site's signature move
        gsap.from(".di-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".di-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Copy, then the sample links — one composed follow-through
        gsap.from(".di-copy > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".di-copy",
            start: "top 85%",
            once: true,
          },
        });

        // The swatch grid settles in tile by tile, triggered by its own
        // position — it sits well below the copy on lg
        gsap.from(".colour-tile", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".di-grid",
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
      <div className="w-full px-8 md:px-14 lg:px-20 xl:px-28 pt-14 lg:pt-20 pb-24 lg:pb-36">
        <SectionLabel>The collection</SectionLabel>

        {/* Deliberately diagonal: the words sit top-left, the colours
            bottom-right, and the empty corners are the whitespace the rest of
            the page runs on */}
        {/* min-h is what makes the diagonal: the row is taller than either
            column needs, so the copy stays at the top and the grid — pinned
            with mt-auto — drops to the bottom with air between them */}
        <div className="pt-8 grid gap-y-16 lg:min-h-[85vh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12">
          <div>
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="di-heading max-w-3xl font-medium leading-[1.08] tracking-tight text-[clamp(2.25rem,4vw,3.75rem)]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="di-heading-line block">
                  The right look
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="di-heading-line block">
                  for your outdoor space
                </span>
              </span>
            </h2>

            <div className="di-copy">
              <p className="mt-10 max-w-xl text-foreground/70 leading-relaxed">
                Explore our selection of premium waterproof vinyl decking and
                roofing membrane options for residential and light commercial
                outdoor spaces.
              </p>

              <div className="mt-14 flex max-w-xl flex-col items-start gap-y-4 font-mono text-xs uppercase tracking-[0.1em] text-foreground/50">
                <Link
                  href={CTA_LINKS.designKit.href}
                  className="text-foreground/75 underline underline-offset-4 decoration-foreground/35 hover:text-foreground hover:decoration-foreground transition-colors"
                >
                  Order free samples
                </Link>
              </div>
            </div>
          </div>

          {/* Every colour shown at once — no hover, nothing hidden. Four even
              columns line the series up as rows: Speckled Stones, Granites,
              then the rest. */}
          <div className="flex flex-col">
            {/* Negative bottom margin lets the block settle below the copy's
                last line, into the section's bottom padding */}
            <div className="di-grid mt-auto pt-4 lg:pt-24">
              <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
                {SWATCHES.map((design, i) => (
                  <li key={design.slug} className="colour-tile">
                    <button
                      type="button"
                      onClick={() => setOpenAt(i)}
                      aria-label={`View ${design.name} up close`}
                      className="group block w-full cursor-zoom-in text-left"
                    >
                      <div
                        className="relative aspect-square w-full overflow-hidden"
                        style={{
                          backgroundColor: design.tileTone ?? design.tone,
                        }}
                      >
                        {design.tile && (
                          <Image
                            src={design.tile}
                            alt={`${design.name} pattern`}
                            fill
                            sizes="(min-width: 1024px) 150px, (min-width: 640px) 15vw, 42vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.24]"
                          />
                        )}
                      </div>

                      <p className="mt-2.5 font-mono text-[0.625rem] uppercase leading-snug tracking-[0.1em] text-foreground/60 transition-colors group-hover:text-foreground">
                        {design.name}
                        {/* Availability only — best-seller is a chip for the
                            gallery, not this mono index */}
                        {(design.tag === "coming-soon" ||
                          design.tag === "sold-out") && (
                          <span className="mt-0.5 block text-foreground/40">
                            {DESIGN_TAG_LABELS[design.tag]}
                          </span>
                        )}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DesignLightbox
        designs={SWATCHES}
        openAt={openAt}
        onChange={setOpenAt}
        onClose={() => setOpenAt(null)}
      />
    </section>
  );
}
