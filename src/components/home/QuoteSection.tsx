import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function QuoteSection() {
  return (
    <section className="bg-background">
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <Reveal>
          <div className="notch-frame bg-foreground text-white p-6 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
              <div className="@container flex flex-col justify-between lg:min-h-[520px]">
                {/* Sized off the column, not the viewport: "Ready for a deck"
                    measures 7.35em in Ubuntu Bold at this tracking, so 12.5cqw
                    is the ceiling that still holds two lines at any width —
                    set below it here by choice. Mobile is too narrow for two
                    lines at any size worth setting, so it balances its own
                    wrap there. */}
                <h2 className="lg:mt-10 text-4xl sm:text-[clamp(3rem,11cqw,6rem)] font-bold leading-[1.02] tracking-tight text-balance">
                  Ready for a deck
                  <br className="hidden sm:inline" /> that lasts?
                </h2>

                <div className="mt-14 max-w-md">
                  <p className="text-lg leading-relaxed text-white/70">
                    Tell us about your project and we&apos;ll connect you with
                    a trusted OnDek dealer for a no-pressure quote.
                  </p>
                  <Link
                    href={CTA_LINKS.quote.href}
                    className="mt-6 inline-block bg-cta px-6 py-3 font-bold text-foreground hover:brightness-95 transition-[filter]"
                  >
                    {CTA_LINKS.quote.label}
                  </Link>
                </div>
              </div>

              {/* Same chamfer as the frame around it, so the image echoes the
                  container's bottom-right cut instead of squaring it off. */}
              <div className="notch-frame-br relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
                <Image
                  src="/images/hero-deck-backyard.jpg"
                  alt="Waterproof vinyl deck overlooking a backyard"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
