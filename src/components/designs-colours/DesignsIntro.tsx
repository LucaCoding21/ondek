import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";
import { DESIGNS, familiesInUse } from "@/lib/designs";
import SectionLabel from "@/components/SectionLabel";

// Unreleased colours read as their own line rather than sitting in the grid
// as flat blocks — neither has a pattern tile shot yet
const SHIPPING = DESIGNS.filter((d) => d.tag !== "coming-soon");
const UPCOMING = DESIGNS.filter((d) => d.tag === "coming-soon");

// DESIGNS is ordered by pattern series, which would scatter the greys across
// the grid. Grouping by family instead puts like next to like, so the block
// reads as a range rather than a shuffle.
const FAMILY_ORDER = familiesInUse(DESIGNS);
const SWATCHES = FAMILY_ORDER.flatMap((family) =>
  SHIPPING.filter((d) => d.family === family)
);

/** Tiles on the top row; the rest share the row below */
const TOP_ROW = 4;

export default function DesignsIntro() {
  return (
    <section className="bg-background">
      <div className="w-full px-8 md:px-14 lg:px-20 xl:px-28 pt-14 lg:pt-20 pb-24 lg:pb-36">
        <SectionLabel>The collection</SectionLabel>

        {/* Deliberately diagonal: the words sit top-left, the colours
            bottom-right, and the empty corners are the whitespace the rest of
            the page runs on */}
        {/* min-h is what makes the diagonal: the row is taller than either
            column needs, so the copy stays at the top and the grid — pinned
            with mt-auto — drops to the bottom with air between them */}
        <div className="pt-8 grid gap-y-16 lg:min-h-[85vh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12">
          <div>
            <Reveal>
              <h2 className="max-w-3xl font-medium leading-[1.08] tracking-tight text-[clamp(2.25rem,4vw,3.75rem)]">
                Colour sets the tone of a deck. Ours is built to keep it.
              </h2>

              <p className="mt-10 max-w-xl text-foreground/70 leading-relaxed">
                Explore our selection of premium waterproof vinyl decking and
                roofing membrane options for residential and light commercial
                outdoor spaces.
              </p>

              <div className="mt-14 flex max-w-xl flex-col items-start gap-y-4 font-mono text-xs uppercase tracking-[0.1em] text-foreground/50">
                {UPCOMING.length > 0 && (
                  <p>
                    <span className="text-foreground/70">Coming soon</span>
                    <span className="mx-2 text-foreground/30">/</span>
                    {UPCOMING.map((d) => d.name).join(", ")}
                  </p>
                )}

                <Link
                  href={CTA_LINKS.designKit.href}
                  className="text-foreground/75 underline underline-offset-4 decoration-foreground/35 hover:text-foreground hover:decoration-foreground transition-colors"
                >
                  Order free samples
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Every colour shown at once — no hover, nothing hidden. Five even
              columns keep every tile the same size; the fifth slot on the top
              row is left empty so the block reads 4 over 5 rather than 5 over
              4, which would put the hole in the bottom corner. */}
          <div className="flex flex-col">
            {/* Negative bottom margin lets the block settle below the copy's
                last line, into the section's bottom padding */}
            <Reveal
              stagger=".colour-tile"
              className="mt-auto pt-4 lg:pt-24"
            >
              <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-5 sm:gap-x-4">
                {SWATCHES.map((design, i) => (
                  <li
                    key={design.slug}
                    className={`colour-tile ${
                      i === TOP_ROW ? "sm:col-start-1" : ""
                    }`}
                  >
                    <Link href={`#${design.slug}`} className="group block">
                      <div
                        className="relative aspect-square w-full overflow-hidden"
                        style={{
                          backgroundColor: design.tileTone ?? design.tone,
                        }}
                      >
                        {design.tile && (
                          <Image
                            src={design.tile}
                            alt={`${design.name} pattern`}
                            fill
                            sizes="(min-width: 1024px) 150px, (min-width: 640px) 15vw, 42vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        )}
                      </div>

                      <p className="mt-2.5 font-mono text-[0.625rem] uppercase leading-snug tracking-[0.1em] text-foreground/60 transition-colors group-hover:text-foreground">
                        {design.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
