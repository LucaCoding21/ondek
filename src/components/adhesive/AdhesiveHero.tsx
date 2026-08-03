import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function AdhesiveHero() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-36 lg:pt-48 text-center">
        <Reveal>
          <h1 className="mx-auto max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.02em]">
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

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 mt-6 lg:mt-9 pb-16 lg:pb-24">
        <Reveal delay={0.15}>
          {/* Frame kept close to the art's own 16:9 so little is cropped */}
          <div className="relative aspect-[4/3] sm:aspect-[16/8.4] overflow-hidden rounded-3xl">
            <Image
              src="/images/adhesive-hero-pail-v3.webp"
              alt="Pail of OD 1010 All Season Adhesive on a finished vinyl deck"
              fill
              preload
              // 16:9 art in a 16:7 frame — bias the crop low so the deck and
              // the base of the pail stay in and the sky goes
              className="object-cover object-[50%_85%]"
              sizes="100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
