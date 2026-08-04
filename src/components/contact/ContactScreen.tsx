"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AssemblyLoop from "@/components/contact/AssemblyLoop";
import ContactForm from "@/components/contact/ContactForm";
import { GENERAL_EMAIL, HOURS } from "@/lib/contact";

gsap.registerPlugin(useGSAP);

/**
 * One screen: display headline, the form set on rules beneath it, and a light
 * panel carrying the assembly loop out to the right.
 *
 * Carries [data-hero] so the navbar goes to its white-logo treatment over the
 * dark slab, the same way the dealer hero does.
 */
export default function ContactScreen() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS rule
      // can't stop it — everything lives behind this media gate instead.
      // Reduced-motion users get the screen fully visible and still.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load, not scroll — this screen opens the page. The headline rises
        // out of its mask, the intro and meta follow, then the form and the
        // panel arrive together as one row.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(
          ".ct-headline-line",
          { yPercent: 118, duration: 1.1, ease: "power4.out" },
          0.1,
        )
          .from(".ct-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.45)
          .from(".ct-meta", { y: 24, opacity: 0, duration: 0.8 }, 0.6)
          // No stagger between the two — they rise as a pair, the same way
          // the hero's CTA pair does. Wrappers only: the form owns its state
          // and the panel's canvas runs its own loop.
          .from(".ct-body", { y: 28, opacity: 0, duration: 0.9 }, 0.75);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-hero className="bg-foreground text-white">
      {/* Sized to land inside one screen: every vertical value below is part of
          that budget. min-h rather than h — a short window scrolls instead of
          clipping. */}
      {/* Centred in the screen rather than parked under the navbar: the
          headline was starting the moment the bar ended, with all the slack
          left dead at the foot. pt is the minimum clearance for the fixed bar
          on a short window, where there is no slack to centre with. */}
      <div className="flex min-h-dvh flex-col justify-center px-5 md:px-8 lg:px-12 xl:px-16 pt-32 pb-16 lg:pb-20">
        <div>
            {/* One thought, one mask, risen on load. leading-[0.82] crops the
                line box inside the glyphs, so the mask gets a generous pb/-mb
                pair to keep the descender-free caps from clipping. */}
            <h1 className="font-bold uppercase leading-[0.82] tracking-[-0.045em] text-[clamp(2.75rem,9vw,8.5rem)]">
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <span className="ct-headline-line block">Contact us</span>
              </span>
            </h1>

            {/* Wide gap under the headline: leading-[0.82] crops its line box
                well inside the glyphs, so the space reads smaller than it
                measures */}
            <p className="ct-sub mt-12 max-w-md text-base text-white/60 leading-relaxed sm:text-lg">
              Have a question about a deck? Use the form below to reach out and
              we&apos;ll get back to you.
            </p>

            {/* Same two facts the directory below opens with. Both read from
                HOURS and GENERAL_EMAIL, so a copy change lands in both places
                at once — only the colours differ. */}
            {/* No rule — space alone. Deliberately closer to the intro than
                the intro is to the headline, so the two small blocks group as
                one header unit rather than reading as a third stacked slab. */}
            <div className="ct-meta mt-10 max-w-md">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-white/60">
                <span className="font-bold text-white">
                  {HOURS.days}, {HOURS.time}
                </span>
                <span className="text-white/25" aria-hidden>
                  ·
                </span>
                <a
                  href={`mailto:${GENERAL_EMAIL}`}
                  className="break-all underline decoration-1 underline-offset-4 decoration-white/30 transition-colors hover:text-white hover:decoration-white"
                >
                  {GENERAL_EMAIL}
                </a>
              </p>

              <p className="mt-2.5 text-sm text-white/40">{HOURS.note}</p>

              {/* The old site's primary contact action — kept alongside the
                  form rather than replaced by it */}
              <a
                href="https://calendly.com/ondek_connect/meeting_with_jim"
                target="_blank"
                rel="noopener"
                className="mt-5 inline-block text-sm font-bold underline decoration-1 underline-offset-4 decoration-white/30 transition-colors hover:decoration-white"
              >
                Prefer to talk? Schedule a call
                <span className="sr-only">, opens Calendly in a new tab</span>
              </a>
            </div>

          {/* Centred, not bottom-aligned: the panel is the taller of the two
              columns, and aligning to its foot opened a dead gap above the
              form the height of the render */}
          <div className="ct-body mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16 xl:gap-24">
            <div>
              <ContactForm />
            </div>

            {/* The render carries the panel on its own — no label, no caption */}
            <div className="rounded-3xl bg-surface p-8 sm:p-10">
              <AssemblyLoop />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
