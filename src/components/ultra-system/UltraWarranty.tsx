import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function UltraWarranty() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal className="grid items-stretch lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-[#dedede] p-8 sm:p-12 lg:p-16 lg:min-h-[640px]">
            <h2 className="font-bold leading-[1.1] text-[clamp(2rem,3vw,2.75rem)] max-w-md">
              One system.
              <br />
              One warranty.
            </h2>

            <p className="mt-6 text-foreground/70 leading-relaxed max-w-md">
              Because every part of the Ultra system is engineered together,
              we stand behind it together: membrane, seams, and adhesive
              under a single industry-leading warranty. No finger-pointing
              between products if something ever goes wrong.
            </p>

            <Link
              href="/vinyl-decking/warranty"
              className="mt-10 inline-block self-start rounded-full border border-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] hover:bg-cta hover:border-cta transition-colors"
            >
              Read the warranty
            </Link>
          </div>

          <div className="relative min-h-[320px] lg:min-h-[640px]">
            <Image
              src="/images/hero-deck-backyard.jpg"
              alt="Waterproof vinyl deck covered by the Ultra system warranty"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
