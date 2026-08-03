import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function WarrantyCta() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pb-24 lg:pb-32">
        {/* Same dark panel that closes the adhesive page — the warranty comes
            with the system, so the ask is the same one */}
        <Reveal className="bg-foreground p-8 sm:p-12 lg:p-16 text-white">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                One system, one warranty.
              </h2>
              <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-md">
                Waterproofing and appearance are covered by the same document,
                and every OnDek deck goes down through a dealer. Tell us about
                your project and we will connect you with one in your area.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 lg:justify-end">
              <Link
                href={CTA_LINKS.quote.href}
                className="inline-block px-7 py-3.5 font-bold bg-cta text-foreground hover:brightness-95 transition-[filter]"
              >
                {CTA_LINKS.quote.label}
              </Link>
              <Link
                href="/resources/documents"
                className="text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
              >
                See all documents
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
