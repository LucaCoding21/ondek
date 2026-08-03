import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

/** Straight from the OD 1010 product page — do not embellish */
const SPECS = [
  { label: "Formulation", value: "Solvent-based contact adhesive" },
  {
    label: "Application temperature",
    value: "Above 10°C (50°F), best above 15°C",
  },
  { label: "Applied with", value: "Brush, roller, or spray, on both surfaces" },
  { label: "Open time", value: "60 minutes" },
  { label: "Coverage", value: "775 sq ft per pail" },
  { label: "Finished bond range", value: "-29°C to 49°C (-20°F to 120°F)" },
  { label: "Remains liquid to", value: "-5°C (23°F)" },
  { label: "Storage range", value: "10°C to 32°C (50°F to 90°F)" },
  { label: "Shelf life", value: "12 months" },
  { label: "Pail size", value: "18.9 L (5 US gal), 35 lb" },
  { label: "Hazard class", value: "3, Packing Group II" },
];

export default function AdhesiveOverview() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-2 lg:pt-4 pb-20 lg:pb-28">
        <SectionLabel>Overview</SectionLabel>

        <Reveal>
          {/* Uncapped: the columns run gutter to gutter, which is what puts
              the pail as far right as the page allows */}
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-44 items-start">
            {/* The spec table rides inside this column rather than under the
                whole grid: the pail art overflows its own box, so anything
                set full-width beneath the grid lands under the artwork */}
            <div>
              <h2 className="lg:ml-12 text-4xl sm:text-5xl font-bold leading-tight max-w-md">
                Proven results, trusted bond.
              </h2>
              <p className="mt-6 lg:ml-12 text-foreground/60 leading-relaxed max-w-2xl">
                OD 1010 has gone down under decks in coastal rain, prairie
                winters, and rooftop sun. Aggressive tack at low temperatures,
                a rapid cure, and a finished bond that holds from -29&deg;C to
                49&deg;C, all covered under the same warranty as the membrane
                above it.
              </p>

              <h3 className="mt-16 lg:ml-40 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground/50">
                OD 1010 at a glance
              </h3>
              <dl className="mt-4 lg:ml-40 max-w-xl">
                {SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid gap-x-8 gap-y-0.5 border-b border-foreground/10 py-3 sm:grid-cols-[13rem_1fr]"
                  >
                    <dt className="text-sm font-medium text-foreground/60">{spec.label}</dt>
                    <dd className="text-sm text-right text-foreground">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* The 4:3 box only reserves layout space; the taller pail art
                overflows it and is cropped by the section's bottom edge —
                which is also why it stays last, so the overflow on the
                stacked layout has nothing below it to spill over. */}
            <div className="relative aspect-[4/3] lg:mt-20 lg:mr-32 lg:justify-self-end lg:w-full lg:max-w-[34rem]">
              <Image
                src="/images/od1010-pail-sketch.png"
                alt="Line drawing of a five gallon OD 1010 adhesive pail"
                width={1122}
                height={1402}
                className="w-full h-auto scale-[1.25] origin-top"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
