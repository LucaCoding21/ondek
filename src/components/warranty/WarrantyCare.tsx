import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

const CARE_PDF =
  "https://ondekvinylworx.com/wp-content/uploads/2020/02/ONDEK-Care-and-Cleaning-20feb2020.pdf";

/** The three-step clean from the care & maintenance page — nothing added */
const STEPS = [
  {
    title: "Mix",
    text: "In a bucket, mix soap and water. We recommend the use of mild dish soap.",
  },
  {
    title: "Agitate",
    text: "Use a mop or soft brush on a stick to agitate the soap on the deck surface.",
  },
  {
    title: "Rinse",
    text: "Rinse thoroughly with water from a garden hose. Do not use a pressure washer.",
  },
];

export default function WarrantyCare() {
  return (
    <section className="bg-surface text-foreground">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 pb-28 lg:pb-40">
        <SectionLabel>Care &amp; maintenance</SectionLabel>

        <Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20 lg:items-end">
            <h2 className="max-w-2xl font-bold leading-[1.02] tracking-[-0.02em] text-[clamp(2.5rem,5.5vw,4.75rem)]">
              Virtually maintenance-free.
            </h2>

            <div className="lg:pb-3">
              <p className="max-w-md text-foreground/60 leading-relaxed">
                Deck maintenance is virtually non-existent with OnDek products.
                Soap, water, and a garden hose is the whole routine.
              </p>

              <a
                href={CARE_PDF}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center gap-3 border-b border-foreground/25 pb-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-foreground"
              >
                Download the care guide
                <svg
                  className="size-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13h11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">, PDF, opens in a new tab</span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* The routine lifted onto white — the one solid panel on the page,
            so the three steps read as a card of instructions rather than
            another run of rules on the section background */}
        <Reveal className="mt-16 lg:mt-24 bg-background p-8 sm:p-12 lg:p-16">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/40">
            Every three months
          </p>

          <div className="mt-10 grid gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:gap-x-16">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={
                  i > 0
                    ? "sm:border-l sm:border-foreground/15 sm:pl-10 lg:pl-16"
                    : ""
                }
              >
                <span className="block text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-[-0.03em] tabular-nums text-foreground/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-7 text-sm font-bold uppercase tracking-[0.14em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Why the routine is this short: the seams are welded, so there is
            nothing to inspect annually */}
        <div className="mt-16 lg:mt-24 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20 lg:items-center">
          <Reveal>
            <div className="relative aspect-[16/10] w-full overflow-hidden sm:max-w-md lg:max-w-none">
              <Image
                src="/images/projects/grey-deck-black-railing.webp"
                alt="Clean grey vinyl deck surface with no visible seams"
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 28rem, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal>
            <p className="max-w-2xl text-2xl sm:text-3xl font-bold leading-[1.25] tracking-[-0.01em]">
              We don&apos;t expect seams to separate, and we don&apos;t require
              annual inspections.
            </p>
            <p className="mt-6 max-w-xl text-foreground/60 leading-relaxed">
              UltraSeam performs a vinyl to vinyl weld, so every seam is free
              of contamination and stronger than the vinyl itself. With an
              OnDek Vinyl Worx deck you do not have to worry about seam
              delamination.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
