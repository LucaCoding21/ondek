import Link from "next/link";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/animations/StatCounter";

const STATS = [
  {
    label: "Usable outdoor space when the underside stays dry",
    value: "2×",
    target: null,
  },
  {
    label: "Waterproof membrane, not water-resistant",
    value: "100%",
    target: 100,
  },
  {
    label: "Days a year the space below stays dry",
    value: "365",
    target: 365,
  },
  {
    label: "Square feet of membrane installed",
    value: "3M",
    target: null,
  },
];

export default function UnderDeck() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="flex min-h-[420px] flex-col justify-between bg-background p-8 sm:p-12 lg:min-h-[560px]">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-xl">
              A waterproof deck doubles your outdoor space.
            </h2>
            <div className="mt-16 max-w-md">
              <p className="text-foreground/70 leading-relaxed">
                Because the membrane is fully waterproof, the area under your
                deck stays dry. Turn it into a patio, outdoor kitchen, or
                covered storage instead of wasted space.
              </p>
              <Link
                href="/why-vinyl/under-deck-living-space"
                className="mt-6 inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                See under-deck living ideas
              </Link>
            </div>
          </Reveal>

          <Reveal
            stagger=".underdeck-stat"
            className="grid grid-cols-2 grid-rows-2 bg-background"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`underdeck-stat flex min-h-52 items-end justify-between gap-4 p-6 sm:p-8 lg:min-h-70 ${
                  i % 2 === 1 ? "border-l border-foreground/15" : ""
                } ${i > 1 ? "border-t border-foreground/15" : ""}`}
              >
                <span className="max-w-32 text-sm text-foreground/60 leading-snug">
                  {stat.label}
                </span>
                <span className="text-5xl sm:text-6xl font-bold leading-none">
                  {stat.target === null ? (
                    stat.value
                  ) : (
                    <StatCounter
                      target={stat.target}
                      finalText={stat.value}
                      delay={200 + i * 120}
                    />
                  )}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
