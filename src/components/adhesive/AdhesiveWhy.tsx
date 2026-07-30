import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

const FEATURES = [
  {
    title: "Coverage",
    text: "Spreads evenly at a predictable rate for a full-surface bond with no hollow spots underfoot.",
    icon: (
      <path
        d="M4 14c2.5-2 5.5-2 8 0s5.5 2 8 0M4 9c2.5-2 5.5-2 8 0s5.5 2 8 0"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Compatibility",
    text: "Formulated for OnDek membranes and common deck substrates, and covered under the same warranty.",
    icon: (
      <>
        <circle cx="9" cy="12" r="5" />
        <circle cx="15" cy="12" r="5" />
      </>
    ),
  },
];

export default function AdhesiveWhy() {
  return (
    <section className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          {/* Left rail: label up top, mark and photo pinned low */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              Why it matters
            </p>

            <div className="mt-10 lg:mt-auto">
              <Image
                src="/images/ondek-logo-black.svg"
                alt=""
                width={110}
                height={28}
                className="h-6 w-auto"
              />
              <div className="relative mt-8 aspect-[7/9] w-full max-w-xs">
                <Image
                  src="/images/od1010-pail.png"
                  alt="Five gallon pail of OD 1010 All Season Adhesive"
                  fill
                  sizes="320px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Membrane and adhesive are designed as one. The Ultra membrane
              locks down with an adhesive built for it, so the bond is full,
              even, and made to outlast the weather.
            </h2>

            {/* Link on a full-width rule, arrow pinned to the far end */}
            <Link
              href={CTA_LINKS.quote.href}
              className="group mt-10 flex w-full items-center justify-between gap-6 border-b border-foreground/40 pb-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-foreground transition-colors"
            >
              Get a quote
              <svg
                className="size-3.5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 8h12M10 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-16 lg:gap-x-24">
              {FEATURES.map((feature) => (
                <div key={feature.title}>
                  <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden
                      className="size-5"
                    >
                      {feature.icon}
                    </svg>
                  </span>
                  <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.2em]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
