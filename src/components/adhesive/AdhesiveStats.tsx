import Image from "next/image";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/animations/StatCounter";

const STATS = [
  { label: "Square feet covered per pail", value: "775", target: 775 },
  { label: "Minutes of open working time", value: "60", target: 60 },
  { label: "Month shelf life", value: "12", target: 12 },
];

export default function AdhesiveStats() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
            Results
          </p>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                Proven results, trusted bond.
              </h2>
              <p className="mt-6 text-foreground/60 leading-relaxed max-w-md">
                OD 1010 has gone down under decks in coastal rain, prairie
                winters, and rooftop sun. Aggressive tack at low temperatures,
                a rapid cure, and a finished bond that holds from -29&deg;C to
                49&deg;C, all covered under the same warranty as the membrane
                above it.
              </p>

              <div className="mt-14 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg">
                {STATS.map((stat, i) => (
                  <div key={stat.label} className="border-t border-foreground/15 pt-5">
                    <p className="text-xs text-foreground/50">{stat.label}</p>
                    <p className="mt-3 text-5xl sm:text-6xl font-bold leading-none">
                      <StatCounter
                        target={stat.target}
                        finalText={stat.value}
                        delay={200 + i * 120}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* The 4:3 box only reserves layout space; the taller pail art
                overflows it and is cropped by the section's bottom edge */}
            <div className="relative aspect-[4/3] lg:justify-self-end lg:w-full lg:max-w-lg">
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
