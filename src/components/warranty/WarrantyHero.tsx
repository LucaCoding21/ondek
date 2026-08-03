import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

const WARRANTY_PDF =
  "https://ondekvinylworx.com/wp-content/uploads/2020/02/ONDEK-VINYL-WORX-WARRANTY-20feb2020.pdf";

export default function WarrantyHero() {
  // Centred and text-only: the photo belongs to the coverage section below,
  // so the fold is the claim and the two ways to act on it
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-40 lg:pt-52 pb-20 lg:pb-28 text-center">
        <Reveal>
          <h1 className="mx-auto max-w-4xl font-bold leading-[0.98] tracking-[-0.03em] text-[clamp(3rem,7vw,6rem)]">
            Warranty &amp; care
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg text-foreground/60 leading-relaxed text-balance">
            A 15 Year Waterproofing / 5 Year Appearance warranty stands behind
            every OnDek deck, and keeping it looking new takes little more than
            soap, water, and a garden hose.
          </p>

          {/* Both routes carry the same corner arrow — the filled one is the
              ask, the plain one is the document */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href={CTA_LINKS.quote.href}
              className="group inline-flex items-center gap-3 px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
            >
              {CTA_LINKS.quote.label}
              <svg
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 12L12 4M12 4H6M12 4V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <a
              href={WARRANTY_PDF}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 px-2 py-3.5 font-bold transition-colors hover:text-foreground/60"
            >
              Read the warranty
              <svg
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 12L12 4M12 4H6M12 4V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">, PDF, opens in a new tab</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
