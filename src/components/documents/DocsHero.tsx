import Image from "next/image";
import Reveal from "@/components/Reveal";
import { DOCUMENT_COUNT } from "@/lib/documents";

export default function DocsHero() {
  // Same construction as the blog hero: full bleed photo, title and standfirst
  // on the floor of the frame. data-hero keeps the nav transparent over it.
  return (
    <section data-hero className="relative h-dvh min-h-[600px] overflow-hidden">
      <Image
        src="/images/projects/grey-deck-black-railing.webp"
        alt="Grey OnDek vinyl deck with a black railing looking into forest"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[50%_35%]"
      />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/65 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

      <Reveal
        stagger=".hero-line"
        className="relative z-10 flex h-full flex-col px-5 md:px-8 lg:px-12 xl:px-16 pt-32 lg:pt-40 pb-14 lg:pb-20 text-white"
      >
        <div className="mt-auto">
          <h1 className="hero-line font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.5rem,6vw,6.5rem)] lg:whitespace-nowrap">
            The whole library
          </h1>

          <p className="hero-line mt-7 max-w-2xl text-lg text-white/75 leading-relaxed text-balance">
            {DOCUMENT_COUNT} documents and guides: drawings for every condition
            on a deck, product and safety data for everything that goes down
            with the membrane, the warranty, and the care routine.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
