import Image from "next/image";
import Reveal from "@/components/Reveal";
import { FEATURED_DESIGNS } from "@/lib/designs";

const POPULAR = FEATURED_DESIGNS.slice(0, 3);

export default function PopularColours() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal>
          <h2 className="font-bold leading-[1.1] text-[clamp(2.25rem,3.4vw,3rem)]">
            Popular this year
          </h2>
          <p className="mt-5 max-w-xl text-foreground/70 leading-relaxed">
            The colours homeowners have chosen most this season. Order any of
            them as a free sample and see them against your home in real light.
          </p>
        </Reveal>

        {/* Cards offset to the right — the empty left column is the breathing
            room the rest of the page uses between sections */}
        <div className="lg:ml-auto lg:w-[88%] xl:w-[84%]">
          <Reveal stagger=".popular-row" className="pt-16 md:pt-24 lg:pt-32">
            {/* One column per design rather than a full-bleed row each — the
                copy is a name and a sentence, which never filled a row's width */}
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {POPULAR.map((design) => (
                <li key={design.slug} className="popular-row">
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden"
                    style={{ backgroundColor: design.tone }}
                  >
                    <Image
                      src={design.scene ?? design.swatch}
                      alt={`${design.name} vinyl decking`}
                      fill
                      sizes="(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-xl leading-tight">
                    {design.name}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                    {design.blurb}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
