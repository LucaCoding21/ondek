"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CTA_LINKS } from "@/lib/nav";

gsap.registerPlugin(useGSAP);

export default function AdhesiveHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the hero static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load, not scroll: this is the top of the page. Headline lines rise
        // out of their masks, copy and CTAs follow, the pail fades in behind.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(
          ".ah-heading-line",
          { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
          0,
        )
          .from(".ah-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.4)
          // Both routes rise as one gesture — the pair shares a wrapper, so
          // there is no stagger between them
          .from(".ah-cta", { y: 24, opacity: 0, duration: 0.7 }, 0.55)
          .from(
            ".ah-frame",
            { opacity: 0, duration: 0.9, ease: "power2.out" },
            0.5,
          );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-36 lg:pt-48 text-center">
        {/* Split where the thought breaks, each line in its own mask. The
            pb/-mb pair leaves descenders room inside the mask. */}
        <h1 className="mx-auto max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.02em]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="ah-heading-line block">OnDek Decking</span>
          </span>
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="ah-heading-line block">Adhesive</span>
          </span>
        </h1>
        <p className="ah-sub mx-auto mt-5 max-w-md text-foreground/60 leading-relaxed">
          An aggressive contact adhesive specially formulated for fleece and
          fabric-back vinyl decking membranes.
        </p>
        <div className="ah-cta mt-8 flex flex-wrap items-center justify-center gap-6">
          <Link
            href={CTA_LINKS.quote.href}
            className="inline-block px-7 py-3.5 font-bold btn-wipe "
          >
            {CTA_LINKS.quote.label}
          </Link>
          <a
            href="/documents/PDS-OD1010.pdf"
            target="_blank"
            rel="noopener"
            className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
          >
            Read the data sheet
          </a>
        </div>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 mt-6 lg:mt-9 pb-16 lg:pb-24">
        {/* Frame kept close to the art's own 16:9 so little is cropped */}
        <div className="ah-frame relative aspect-[4/3] sm:aspect-[16/8.4] overflow-hidden rounded-3xl">
          <Image
            src="/images/adhesive-hero-pail-v3.webp"
            alt="Pail of OD 1010 adhesive on a finished vinyl deck"
            fill
            preload
            // 16:9 art in a 16:7 frame — bias the crop low so the deck and
            // the base of the pail stay in and the sky goes
            className="object-cover object-[50%_85%]"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
