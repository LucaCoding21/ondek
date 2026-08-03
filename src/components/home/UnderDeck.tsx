import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/animations/StatCounter";

// Placed as a staircase on lg — 01/02 across the top, 03/04 stepped one column
// right and one row down — so the four read in order rather than as a block.
const STATS = [
  {
    title: "Outdoor space",
    label: "Usable outdoor space when the underside stays dry",
    value: "2×",
    target: null,
    place: "lg:col-start-1 lg:row-start-1",
    art: "/images/under-deck-living.webp",
    // Mirrored so the deck opens back toward the card
    artClass: "left-1/4 top-[42%] w-[122%] -scale-x-100",
  },
  {
    title: "Waterproof",
    label: "Waterproof membrane, not water-resistant",
    value: "100%",
    target: 100,
    place: "lg:col-start-2 lg:row-start-1",
    art: null,
    artClass: null,
  },
  {
    title: "Dry days",
    label: "Days a year the space below stays dry",
    value: "365",
    target: 365,
    place: "lg:col-start-2 lg:row-start-2",
    art: null,
    artClass: null,
  },
  {
    title: "Installed",
    label: "Square feet of membrane installed",
    value: "3M",
    target: null,
    place: "lg:col-start-3 lg:row-start-2",
    art: "/images/deck-edge-detail.webp",
    artClass: "left-[32%] top-[52%] w-full",
  },
];

export default function UnderDeck() {
  return (
    <section className="bg-foreground text-white">
      {/* Runs wider than UltraSystem above it (100rem) by request — the cap is
          still here so the headline and copy keep sane line lengths on very
          large displays rather than running full-bleed. */}
      <div className="mx-auto w-full max-w-[110rem] px-5 md:px-8 lg:px-12 xl:px-16 py-28 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <Reveal className="lg:pt-2">
            <h2 className="max-w-xl text-4xl sm:text-5xl font-bold leading-[1.05]">
              A waterproof deck doubles your outdoor space.
            </h2>
            <p className="mt-6 max-w-sm text-sm text-white/60 leading-relaxed">
              Because the membrane is fully waterproof, the area under your deck
              stays dry. Turn it into a patio, outdoor kitchen, or covered
              storage instead of wasted space.
            </p>
            <Link
              href="/why-vinyl/under-deck-living-space"
              className="mt-6 inline-block text-sm font-bold border-b-2 border-cta pb-0.5 hover:border-white transition-colors"
            >
              See under-deck living ideas
            </Link>
          </Reveal>

          <Reveal
            stagger=".underdeck-stat"
            // Dropped below the headline's line rather than aligned to it —
            // the offset is on the stats alone so the copy column stays put
            className="grid gap-4 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:grid-rows-2"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`underdeck-stat relative flex min-h-44 flex-col justify-between gap-8 overflow-hidden bg-background p-6 text-foreground sm:aspect-square ${stat.place}`}
              >
                {stat.art && (
                  // Sits in the empty middle band, offset right so its right
                  // edge lands past the card's, which overflow-hidden clips.
                  // The two drawings differ in shape, so anything specific to
                  // one of them rides along in artClass.
                  <Image
                    src={stat.art}
                    alt=""
                    width={900}
                    height={522}
                    className={`pointer-events-none absolute max-w-none -translate-y-1/2 opacity-90 ${
                      stat.artClass ?? ""
                    }`}
                  />
                )}

                <span className="relative text-4xl font-bold leading-none">
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

                <span className="relative">
                  <span className="block text-sm font-bold">{stat.title}</span>
                  <span className="mt-1.5 block text-xs text-foreground/60 leading-snug">
                    {stat.label}
                  </span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
