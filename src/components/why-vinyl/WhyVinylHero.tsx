import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function WhyVinylHero() {
  return (
    <section data-hero className="bg-background">
      {/* Full-bleed photo — no gutter frame here, unlike the other sub-page
          heroes. The headline sits in the band below rather than over the
          photo, so the image only has to carry the nav. */}
      {/* overflow-hidden so the tab's lower edge is cut off by the photo
          rather than floating on the band below it */}
      <div className="relative h-[54vh] min-h-[400px] overflow-hidden lg:h-[64vh]">
        <Image
          src="/images/projects/lake-view-glass-railing.webp"
          alt="Vinyl deck with glass railing looking out over a lake"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        {/* Only scrim needed: the nav's white links over a bright sky */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />

        {/* The band below pushing up into the photo, cut to the logo's ramp
            profile — two offset slabs, white in front and CTA yellow behind,
            the same pairing as the mark itself */}
        {/* Widths and the offset are the mark's own, scaled off the tab height:
            the white ramp is 2.55×H, the yellow 3.05×H, and the yellow starts
            1.84×H along — 147/244/204px at 80px tall */}
        <div
          aria-hidden
          // Sunk slightly past the photo's bottom edge into the band below
          className="absolute -bottom-5 left-0 h-[58px] w-[284px] sm:-bottom-7 sm:h-[80px] sm:w-[391px]"
        >
          {/* Back to the mark's own pairing: white slab, CTA yellow behind and
              to the right, with the logo's gap between the two ramps kept */}
          <span className="logo-ramp absolute bottom-0 left-[107px] h-full w-[177px] bg-cta sm:left-[147px] sm:w-[244px]" />
          <span className="logo-ramp absolute bottom-0 left-0 h-full w-[148px] bg-background sm:w-[204px]" />
        </div>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <Reveal>
            <h1 className="max-w-3xl text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-[-0.02em] text-balance">
              The last deck surface you&apos;ll ever install.
            </h1>
          </Reveal>

          <Reveal delay={0.15} className="lg:pt-3">
            <p className="max-w-xl text-lg text-foreground/70 leading-relaxed">
              A wood deck sheds water between its boards. An OnDek deck
              doesn&apos;t. The membrane is one sealed surface with
              fusion-welded seams, approved by the CGSB and tested to ICC-ES
              AC75.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={CTA_LINKS.quote.href}
                className="group inline-flex items-center gap-2.5 bg-cta px-7 py-3.5 font-bold text-foreground hover:brightness-95 transition-[filter]"
              >
                {CTA_LINKS.quote.label}
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                >
                  <path
                    d="M2.5 8h11m0 0L9.5 4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href={CTA_LINKS.designKit.href}
                className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
              >
                {CTA_LINKS.designKit.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
