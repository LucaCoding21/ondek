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
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-between lg:min-h-[520px]">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
                  Ready for
                  <br />
                  a deck that
                  <br />
                  lasts?
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

              <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
                <Image
                  src="/images/hero-deck-backyard.jpg"
                  alt="Waterproof vinyl deck overlooking a backyard"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
