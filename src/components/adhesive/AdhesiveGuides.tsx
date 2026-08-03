import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";
import SectionLabel from "@/components/SectionLabel";

const GUIDES = [
  {
    label: "Spec sheet",
    format: "PDF",
    title: "OD 1010 Product Data Sheet",
    blurb:
      "Coverage, application temperatures, open time, and the full technical data for the pail.",
    href: "https://ondekvinylworx.com/wp-content/uploads/2026/01/PDS-OD1010.pdf",
  },
  {
    label: "Safety",
    format: "PDF",
    title: "OD 1010 Safety Data Sheet",
    blurb:
      "Handling, storage, hazard classification, and first-aid information for the job site.",
    href: "https://ondekvinylworx.com/wp-content/uploads/2026/01/SDS-OD1010.pdf",
  },
];

export default function AdhesiveGuides() {
  return (
    <section className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <SectionLabel rule={false}>Downloads</SectionLabel>

        <Reveal stagger=".guide-row" className="mt-10">
          {/* Heading rail left, documents right — the same 4fr/7fr split the
              features section above uses, so the page has one structure rather
              than a new one per section. It also solves what was wrong with
              both earlier attempts: two full-width rows looked thin, and two
              half-width cards left most of each box empty. */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20 xl:gap-28 lg:items-start">
            <div className="guide-row">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Data sheets
              </h2>

              <p className="mt-6 max-w-md text-foreground/60 leading-relaxed">
                Everything published on the pail sits in two documents — the
                product sheet for the numbers, the safety sheet for the job
                site.
              </p>

              {/* A solid black block here would out-shout the dark order panel
                  at the foot of the section, so the secondary route out is a
                  label on a hairline that fills in on hover */}
              <Link
                href="/resources/documents"
                className="mt-8 inline-block border-b border-foreground/25 pb-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-foreground"
              >
                See all documents
              </Link>
            </div>

            {/* One rule between the two sheets, none above the first or below
                the last — the pair reads as a list, not as boxed cards */}
            <ul className="guide-row divide-y divide-foreground/15">
              {GUIDES.map((guide) => (
                <li key={guide.title}>
                  <Link
                    href={guide.href}
                    target="_blank"
                    rel="noopener"
                    className="group block py-8 lg:py-10"
                  >
                    <span className="flex items-center gap-3">
                      <span className="border border-foreground/20 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-foreground/60">
                        {guide.format}
                      </span>
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/40">
                        {guide.label}
                      </span>
                    </span>

                    {/* Title and blurb against the download mark, so the cue
                        sits on the same line as the thing it acts on */}
                    <span className="mt-6 flex items-start justify-between gap-8">
                      <span>
                        <span className="block text-xl font-bold leading-snug sm:text-2xl">
                          {guide.title}
                        </span>
                        <span className="mt-2.5 block max-w-md text-sm text-foreground/60 leading-relaxed">
                          {guide.blurb}
                        </span>
                      </span>

                      <span className="mt-1.5 shrink-0 text-foreground/40 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-foreground">
                        <svg
                          className="size-5"
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
                      </span>
                    </span>

                    <span className="sr-only">, PDF, opens in a new tab</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Not a cart product: the dealer path is the whole point of the ask */}
          <div className="guide-row mt-16 bg-foreground p-8 sm:p-12 lg:p-16 text-white">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                  Order OD 1010 with your membrane.
                </h2>
                <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-md">
                  Adhesive ships through OnDek dealers alongside your membrane
                  order, so the whole system arrives matched and covered by a
                  single warranty. Tell us about your project and we will
                  connect you with a dealer in your area.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 lg:justify-end">
                <Link
                  href={CTA_LINKS.quote.href}
                  className="inline-block px-7 py-3.5 font-bold bg-cta text-foreground hover:brightness-95 transition-[filter]"
                >
                  {CTA_LINKS.quote.label}
                </Link>
                <Link
                  href="/become-a-dealer"
                  className="text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
                >
                  Become a dealer
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
