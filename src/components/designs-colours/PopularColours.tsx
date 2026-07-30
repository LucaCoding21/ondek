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
        </Reveal>

        <Reveal stagger=".popular-row" className="mt-10 md:mt-14">
          <ul>
            {POPULAR.map((design) => (
              <li
                key={design.slug}
                className="popular-row border-t border-foreground/15 last:border-b"
              >
                {/* Text hugs the top rule; the tall image sets the row height,
                    leaving deliberate air under the copy */}
                <div className="grid items-start gap-x-10 gap-y-4 py-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,4fr)] lg:py-8">
                  <h3 className="font-bold text-lg leading-tight">
                    {design.name}
                  </h3>

                  <p className="text-sm text-foreground/60 leading-relaxed lg:max-w-sm">
                    {design.blurb}
                  </p>

                  <div
                    className="relative aspect-[10/7] w-full overflow-hidden"
                    style={{ backgroundColor: design.tone }}
                  >
                    <Image
                      src={design.scene ?? design.swatch}
                      alt={`${design.name} vinyl decking`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
