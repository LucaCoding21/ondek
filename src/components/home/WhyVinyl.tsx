"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WhyVinyl() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the hero and Design kit, kept consistent on purpose.
        gsap.from(".wv-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".wv-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Spec card then link, one composed arrival. The registration
        // corners ride along on the wrapper.
        gsap.from(".wv-item", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".wv-card",
            start: "top 85%",
            once: true,
          },
        });

        // The photo is the biggest thing in the section, so it gets the
        // deepest rise — on its own trigger, since it sits below the copy
        // until lg.
        gsap.from(".wv-image", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".wv-image",
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
    <section ref={ref} className="bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="wv-heading text-3xl sm:text-4xl font-bold leading-tight">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="wv-heading-line block">
                  The last deck surface
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="wv-heading-line block">
                  <span className="bg-cta box-decoration-clone px-1.5">
                    you&apos;ll ever install.
                  </span>
                </span>
              </span>
            </h2>

            <div className="wv-item wv-card relative mt-16 lg:mt-40">
              {/* registration corners, echoing a technical drawing */}
              <span
                aria-hidden
                className="absolute -top-2.5 -left-2.5 h-5 w-5 border-t-2 border-l-2 border-foreground/30"
              />
              <span
                aria-hidden
                className="absolute -top-2.5 -right-2.5 h-5 w-5 border-t-2 border-r-2 border-foreground/30"
              />
              <span
                aria-hidden
                className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-2 border-l-2 border-foreground/30"
              />
              <span
                aria-hidden
                className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-2 border-r-2 border-foreground/30"
              />

              <div className="bg-surface p-6 sm:p-8">
                <h3 className="text-xl font-bold">
                  100% waterproof. Not water-resistant.
                </h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">
                  One sealed surface protects your deck structure for decades:
                  no staining, sealing, or sanding, slip-resistant when wet,
                  and UV-stable through freeze-thaw winters. Soap and water is
                  all it takes.
                </p>
              </div>
            </div>

            <div className="wv-item mt-8">
              <Link
                href="/why-vinyl"
                className="inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                More on why vinyl wins
              </Link>
            </div>
          </div>

          <div className="wv-image relative lg:ml-16 lg:-mr-16">
            <span
              aria-hidden
              className="absolute -top-2.5 -left-2.5 h-5 w-5 border-t-2 border-l-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -top-2.5 -right-2.5 h-5 w-5 border-t-2 border-r-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-2 border-l-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-2 border-r-2 border-foreground/30"
            />
            <Image
              src="/images/designs/speckled-silver-scene.jpg"
              alt="Vinyl deck surface on a backyard deck in full sun"
              width={1680}
              height={945}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
