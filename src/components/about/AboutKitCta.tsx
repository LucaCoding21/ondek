import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function AboutKitCta() {
  // Same offer card as the designs page, different photo and framing: this one
  // closes a story about how the membrane is made, so the ask is to go feel it
  return (
    <section className="bg-background">
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl min-h-[560px] lg:min-h-[620px]">
            <Image
              src="/images/projects/hillside-deck-autumn.webp"
              alt="OnDek vinyl deck on a hillside home surrounded by autumn trees"
              fill
              className="object-cover object-[50%_45%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-8 sm:bottom-8 sm:max-w-md bg-background p-7 sm:p-10">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground/50">
                Free design kit
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                Judge it the way we do.
              </h2>
              <p className="mt-4 text-foreground/70 leading-relaxed">
                Everything on this page comes down to how the membrane feels in
                your hand. Order a free kit and we&apos;ll send real samples of
                the designs you&apos;re considering, no charge and no visit
                required.
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
