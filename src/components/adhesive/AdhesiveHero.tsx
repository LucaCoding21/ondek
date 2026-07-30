import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function AdhesiveHero() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 text-center">
        <Reveal>
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl font-bold leading-[1.1] tracking-[-0.01em]">
            The bond that makes it a system.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-foreground/60 leading-relaxed">
            A contact adhesive formulated for OnDek membranes. One pail, every
            season, horizontal and vertical surfaces.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={CTA_LINKS.quote.href}
              className="inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
            >
              {CTA_LINKS.quote.label}
            </Link>
            <a
              href="https://ondekvinylworx.com/wp-content/uploads/2026/01/PDS-OD1010.pdf"
              target="_blank"
              rel="noopener"
              className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
            >
              Read the data sheet
            </a>
          </div>
        </Reveal>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 mt-12 lg:mt-16 pb-16 lg:pb-24">
        <Reveal delay={0.15}>
          <div className="relative aspect-[4/3] sm:aspect-[16/7] overflow-hidden rounded-3xl">
            <Image
              src="/images/hero-deck-backyard.jpg"
              alt="Vinyl deck membrane bonded with OnDek adhesive"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
