"use client";

import { useRef } from "react";
import Image from "@/components/SiteImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";
import MutedLoopVideo from "@/components/MutedLoopVideo";
import ComparisonPlate, { type Column } from "./ComparisonPlate";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPICAL: Column = {
  title: "Typical seam",
  items: [
    "Higher risk of seam contamination",
    "Fleece remnants can compromise seam integrity",
    "Less confidence in long-term waterproof performance",
  ],
};

const ULTRA: Column = {
  title: "Ultra Seam",
  items: [
    "Clean selvage edge keeps fleece out of the weld",
    "Pure vinyl-to-vinyl weld",
    "Proved stronger than the membrane itself in independent testing",
  ],
};

// The same test video the old site runs on its Ultra Seam page and home page.
const SEAM_TEST_VIMEO_ID = "522076250";

/**
 * Ultra Seam: heading across the top, the strength-test footage held on the
 * left, and the three things that make the weld different stacked against it
 * on the right. The comparison plate closes the section.
 *
 * Its own component rather than a variant of FeatureBlock — Ultra Edge still
 * runs the original three-column layout, and the two must not share GSAP
 * selectors. Everything here is prefixed `sm-`.
 */
export default function SeamFeature() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks, the intro just behind —
        // the same arrival as every other section on the page.
        gsap.from(".sm-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: { trigger: ".sm-heading", start: "top 78%", once: true },
        });

        gsap.from(".sm-intro", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: { trigger: ".sm-heading", start: "top 78%", once: true },
        });

        // The badge stamps in: pressed straight down from above, the
        // back.out overshoot squashing past resting size and rebounding
        // like a stamp hitting paper. Opacity snaps in ahead of the press so
        // the mark is visible mid-descent.
        const stamp = gsap.timeline({
          scrollTrigger: { trigger: ".sm-heading", start: "top 78%", once: true },
          delay: 0.45,
        });
        stamp
          .from(".sm-badge", { opacity: 0, duration: 0.2, ease: "power1.out" }, 0)
          .from(
            ".sm-badge",
            {
              scale: 1.8,
              duration: 0.7,
              ease: "back.out(2.4)",
              transformOrigin: "50% 50%",
            },
            0,
          );

        gsap.from(".sm-media", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sm-media", start: "top 82%", once: true },
        });

        // The still sits beside the video now, so it arrives on its own scroll
        // position rather than the heading's
        gsap.from(".sm-shot", {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.12,
          scrollTrigger: { trigger: ".sm-shot", start: "top 82%", once: true },
        });

        // The plate lands as one piece, then the Ultra column's checks tick
        // in one after another — the payoff beat of the section.
        gsap.from(".sm-plate", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sm-plate", start: "top 80%", once: true },
        });

        gsap.from(".sm-check", {
          x: 16,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.35,
          scrollTrigger: { trigger: ".sm-plate", start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background overflow-hidden">
      {/* Same container as UltraPinned's "The layers": full width on the same
          padding scale, no max-width. That is what puts this section's text on
          the identical left edge to it. */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-14 pb-20 lg:pt-16 lg:pb-28">
        {/* No breakout: the block sits on the section padding, which is what
            aligns it with "The layers" above. */}
        <div>
          <SectionLabel>Ultra Seam</SectionLabel>

          {/* Heading and intro on the left, the Ultra Seam badge holding the
              right end of the row like a product mark. It rides the sm-intro
              tween so it arrives with the copy. Hidden on small screens where
              the heading needs the full measure. */}
          <div className="mt-10 flex items-start justify-between gap-8">
            <div>
              {/* Type scale matched to Ultra Edge's heading below, so the two
                  feature blocks on this page set at the same size */}
              <h2 className="sm-heading max-w-2xl font-bold leading-[1.12] text-[clamp(2.25rem,4.5vw,3.5rem)]">
                {/* One line, in its own mask; the pb/-mb pair leaves descenders
                    room inside the mask. It wraps on narrow screens, which the
                    mask handles: the block grows and both rows rise together. */}
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="sm-heading-line block">
                    Welded vinyl to vinyl
                  </span>
                </span>
              </h2>

              {/* The claim sits with the heading rather than captioning the
                  video, so the section states its case before the footage,
                  not after */}
              {/* max-w-2xl matches the heading and is what breaks the body onto
                  two lines: the sentence measures roughly 1020px unwrapped */}
              <div className="sm-intro mt-5 max-w-2xl lg:mt-6">
                <p className="text-xs font-bold tracking-[0.08em] text-foreground/50">
                  The seam strength test
                </p>
                <p className="mt-3 font-bold leading-snug text-[clamp(1.25rem,2vw,1.6rem)]">
                  Stronger than the membrane itself
                </p>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  Seam technology engineered for stronger welds and long-term
                  waterproof performance. Watch the PVC-to-PVC weld tested for
                  strength against the competition.
                </p>
              </div>
            </div>

            <Image
              src="/images/ultra-seam-badge.svg"
              alt="Ultra Seam"
              width={112}
              height={112}
              className="sm-badge hidden h-auto shrink-0 sm:block sm:w-20 lg:w-28"
            />
          </div>
        </div>

        {/* Footage wide on the left, the selvage still upright beside it. The
            video's 16:9 sets the row height and the still stretches to match,
            so the two share a baseline top and bottom. */}
        <div className="mt-12 lg:mt-16 grid gap-6 lg:gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)] lg:items-stretch">
          <div className="sm-media aspect-video w-full overflow-hidden bg-black">
            <MutedLoopVideo
              videoId={SEAM_TEST_VIMEO_ID}
              title="The OnDek Ultra Seam strength test"
            />
          </div>

          {/* Inset from its cell on all four sides so whitespace runs around
              it: 82% of the row height, centred, and held off the section's
              right edge. Portrait when stacked on mobile, where there is no
              row height to measure against. */}
          <div className="sm-shot relative aspect-[3/4] w-full overflow-hidden lg:aspect-auto lg:h-[82%] lg:w-[96%] lg:ml-0 lg:mr-auto lg:self-center">
            {/* object-[25%_50%]: the frame is far narrower than the 3:2 source,
                so cover crops hard on the horizontal. Holding the crop left of
                centre keeps the hand and the lifted edge in shot. */}
            <Image
              src="/images/ultra-seam-selvage.webp"
              alt="A hand lifting the fleece backing away from the edge of a vinyl run, leaving the clean selvage edge the weld is made on"
              fill
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="object-cover object-[25%_50%]"
            />
          </div>
        </div>

        {/* Pulled up over the foot of the video: relative+z keeps it above the
            frame, without it the plate slides under the video's own stacking
            context.

            padClass is wider left/right than top/bottom so the chamfered
            corners clear the text. The notch cuts 101x64px, so at 36px of top
            padding it still reaches ~44px in from the edge, which clips the
            heading's first letter and the last item's last word. Widening
            sideways rather than down buys the clearance without adding
            height. */}
        <ComparisonPlate
          typical={TYPICAL}
          ultra={ULTRA}
          className="relative z-10 mt-8 lg:mt-12 mx-auto w-full max-w-[96rem]"
          plateClass="sm-plate"
          checkClass="sm-check"
          minHeight="min-h-[14rem]"
          padClass="p-8 px-10 sm:p-10 sm:px-16 lg:p-12 lg:px-20"
        />

      </div>
    </section>
  );
}
