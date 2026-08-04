"use client";

// TEMP: restore with the hero photo below
// import Image from "@/components/SiteImage";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS rule
      // can't stop it — everything lives behind this media gate instead.
      // Reduced-motion users get the hero fully visible and still.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load: the frame fades in while the headline lines rise out of
        // their masks. Copy and CTAs follow through.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-frame", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0)
          .from(
            ".hero-headline-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            0.3,
          )
          .from(".hero-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.7)
          .from(".hero-cta", { y: 24, opacity: 0, duration: 0.7 }, 0.85);

        // Scroll: the image grows a touch while the copy leads the scroll
        // slightly — depth separation, no pinning.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          })
          .to(".hero-img-wrap", { scale: 1.1, ease: "none" }, 0)
          .to(".hero-copy", { yPercent: -14, ease: "none" }, 0);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-background">
      {/* White gutter frames the photo; the fold still totals 100dvh */}
      <div className="p-[var(--gutter)]">
        <div className="hero-frame relative h-[calc(100dvh-var(--gutter)*2)] min-h-[560px] notch-frame overflow-hidden">
          <div className="relative h-full">
            <div className="hero-img-wrap absolute inset-0">
              {/* TEMP: video stand-in for the hero photo, just to preview.
                  Restore the Image below when done evaluating. */}
              <video
                src="/videos/hero-temp-2.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="hero-img absolute inset-0 h-full w-full object-cover"
              />
              {/* <Image
                src="/images/hero-deck-backyard.jpg"
                alt="Waterproof vinyl deck surface on a raised backyard deck"
                fill
                preload
                className="hero-img object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
              /> */}
            </div>
            {/* Top scrim so the transparent nav's white links stay legible */}
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
            {/* No flat dim — the rest of the darkening sits behind the copy */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Bottom scrim so the headline and CTAs hold against a bright deck */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />

            {/* Copy anchored to the bottom: headline left, support copy and CTAs right */}
            <div className="hero-copy relative z-10 flex h-full items-end">
              <div className="w-full px-6 sm:px-12 lg:px-16 pb-12 lg:pb-16">
                <div className="grid gap-10 lg:grid-cols-[5fr_4fr] lg:gap-12 lg:items-end">
                  {/* "Waterproof decking," has to hold together on one line.
                      It measures 9.84em in Ubuntu Bold (~9.46em after the
                      tracking), and from lg up it only gets 5/9 of the row,
                      so the type is sized off that column rather than off the
                      viewport — text-8xl needed ~900px of a ~600px column and
                      was what split "Waterproof" onto its own line. Below lg
                      the headline has the full width and wraps on its own. */}
                  {/* Each line lives inside an overflow-hidden mask and rises
                      out of it on load. The pb/-mb pair gives descenders
                      ("decking," has a g) room inside the mask at this tight
                      leading without adding visual space between lines. */}
                  <h1 className="text-6xl sm:text-7xl lg:whitespace-nowrap lg:text-[clamp(2.75rem,calc(5.4vw-0.7rem),6rem)] font-bold leading-[1.02] tracking-[-0.02em] text-white">
                    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                      <span className="hero-headline-line block">
                        Waterproof decking,
                      </span>
                    </span>
                    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                      <span className="hero-headline-line block">
                        built to last
                      </span>
                    </span>
                  </h1>

                  <div className="text-white lg:pb-1 lg:ml-auto lg:max-w-lg">
                    <p className="hero-sub text-lg text-white/85 leading-relaxed">
                      Premium vinyl membranes in modern patterns. Low
                      maintenance, slip resistant, and backed by our 15 / 5
                      Year Limited Warranty.
                    </p>
                    <div className="mt-8 flex flex-wrap items-start gap-4">
                      <div className="hero-cta">
                        <Link
                          href={CTA_LINKS.designKit.href}
                          className="block whitespace-nowrap border border-white/40 bg-white/10 backdrop-blur-md px-7 py-3.5 font-bold text-white hover:bg-white/20 transition-colors"
                        >
                          Get your free design kit
                        </Link>
                        <p className="mt-2 text-center text-sm text-white/70">
                          Real Samples, Free Shipping
                        </p>
                      </div>
                      <Link
                        href={CTA_LINKS.quote.href}
                        className="hero-cta whitespace-nowrap px-7 py-3.5 font-bold btn-wipe text-foreground "
                      >
                        {CTA_LINKS.quote.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
