"use client";

import Image from "next/image";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The brand panel the page peels away to: scrolling past the footer uncovers
 * a full-bleed marketing photo with the OnDek logo across it, pinned to the
 * viewport while the rest of the site scrolls up off it.
 *
 * How the reveal works: the child is position:fixed to the bottom of the
 * screen, and the wrapper's clip-path confines its paint to the wrapper's own
 * box at the end of the document. clip-path (unlike overflow) clips fixed
 * descendants without becoming their containing block, so the panel stays
 * screen-fixed but only shows through this section as it scrolls into view.
 */
export default function FooterReveal() {
  const ref = useRef<HTMLDivElement>(null);
  // This component lives in the root layout, so it survives client-side
  // navigations — the scrub has to be rebuilt per page or its trigger
  // positions stay measured against the previous page's height and the zoom
  // only ever plays on the first page loaded.
  const pathname = usePathname();

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the photo still, at rest.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The photo rides the reveal: slightly zoomed as the panel first
        // shows, settling to rest exactly when the page bottoms out. The
        // eased scrub holds the zoom through the first half and lets most of
        // it go near the end, and the smoothing value gives the tracking a
        // touch of momentum rather than a hard 1:1 tie to the wheel.
        gsap.fromTo(
          ".fr-zoom",
          { scale: 1.35 },
          {
            scale: 1,
            ease: "power2.in",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.6,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="relative h-[85svh]" style={{ clipPath: "inset(0)" }}>
      <div className="fixed bottom-0 left-0 h-[85svh] w-full overflow-hidden">
        {/* The zoom scales this wrapper, not the fill Image itself, so the
            transform GSAP writes never fights the inline styles next/image
            manages on its own element */}
        <div className="fr-zoom absolute inset-0">
          <Image
            src="/images/grey-deck-farmhouse-wide.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Just enough wash for the white logo to hold on the photo's sky */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <Image
            src="/images/ondek-logo-white.svg"
            alt="OnDek"
            width={214}
            height={100}
            className="h-auto w-[min(56rem,80vw)]"
          />
        </div>
      </div>
    </div>
  );
}
