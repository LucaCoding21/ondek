"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import StoryVideo from "@/components/about/StoryVideo";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Copy is OnDek's own About page, kept close to the source. The only edits
 * anywhere in these sections are the two em dashes in the original, which are
 * commas here to match the rest of the site.
 */
export default function CompanyStory() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks, the intro follows through.
        gsap.from(".cs-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".cs-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".cs-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".cs-heading",
            start: "top 78%",
            once: true,
          },
        });

        // The wrapper rises, never the facade itself — StoryVideo swaps its
        // own children between poster and iframe and stays untouched.
        gsap.from(".cs-video", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cs-video", start: "top 85%", once: true },
        });

        gsap.from(".cs-who > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".cs-who", start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-20 lg:pt-32">
        {/* Deliberately off the video's left edge: wider measure, so the
            heading sits outboard of it without running to the page gutter */}
        <SectionLabel className="mx-auto max-w-[94rem]">
          Company story
        </SectionLabel>

        <div className="mx-auto mt-10 max-w-[94rem]">
          {/* Split where the thought breaks, each line in its own mask — the
              hand-set break also keeps "company." off a line of its own. The
              pb/-mb pair leaves descenders room inside the mask. */}
          <h2 className="cs-heading mt-8 max-w-[54rem] font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(2.25rem,3.6vw,3.5rem)]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="cs-heading-line block">
                A full service waterproof
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="cs-heading-line block">
                vinyl decking membrane company.
              </span>
            </span>
          </h2>
          <p className="cs-sub mt-7 max-w-xl text-foreground/60 leading-relaxed">
            A short film on where the membrane came from, who makes it, and
            what we will not compromise on to keep the price down.
          </p>
        </div>
      </div>

      <div className="cs-video mt-12 px-5 md:px-8 lg:mt-16 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <StoryVideo />
        </div>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pb-20 lg:pb-32">
        <div className="cs-who mx-auto mt-16 grid max-w-7xl gap-6 lg:mt-24 lg:grid-cols-[minmax(0,2fr)_minmax(0,7fr)] lg:gap-16 lg:items-start">
          <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/50">
            Who we are
          </h3>
          <div className="max-w-4xl space-y-6 text-foreground/70 leading-relaxed sm:text-justify sm:hyphens-auto">
            <p>
              OnDek Vinyl Worx Inc. builds on the success of our parent company,
              Innovative Aluminum Systems Inc. In business since 2004,
              Innovative Aluminum has built a solid network of aluminum railing
              dealers. Now, with the launch of OnDek Vinyl Worx Inc., our family
              of companies can offer all components required for today&rsquo;s
              decking contractor.
            </p>
            <p>
              After more than 20 years of building Innovative Aluminum Systems
              Inc. into a trusted aluminum railing manufacturer, our leadership
              team launched OnDek Vinyl Worx Inc. in 2020 to bring the same
              standards of quality, reliability, and service into the vinyl
              decking industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
