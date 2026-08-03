import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function FreeKitCta() {
  return (
    <section className="bg-background">
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl min-h-[560px] lg:min-h-[620px]">
            <Image
              src="/images/hero-deck-backyard.jpg"
              alt="Waterproof vinyl deck overlooking a backyard"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

            {/* The offer card */}
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-8 sm:bottom-8 sm:max-w-md bg-background p-7 sm:p-10">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground/50">
                Free design kit
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                See every colour in your own light.
              </h2>
              <p className="mt-4 text-foreground/70 leading-relaxed">
                Photos only get you so far. Order real vinyl samples of the
                designs you&apos;re considering and match them against your
                home before you decide.
              </p>
              <Link
                href={CTA_LINKS.designKit.href}
                className="mt-7 inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
              >
                Order your free kit
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
