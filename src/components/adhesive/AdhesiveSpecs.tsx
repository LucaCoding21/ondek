import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

const SPECS = [
  { label: "Formulation", value: "Solvent-based contact adhesive" },
  { label: "Application temperature", value: "Above 10°C (50°F)" },
  { label: "Applied with", value: "Brush, roller, or spray, on both surfaces" },
  { label: "Open time", value: "60 minutes" },
  { label: "Coverage", value: "775 sq ft of installed vinyl per pail" },
  { label: "Finished bond range", value: "-29°C to 49°C (-20°F to 120°F)" },
  { label: "Shelf life", value: "12 months" },
  { label: "Pail size", value: "18.9 L (5 US gal), 35 lb" },
];

const ORDER_STEPS = [
  "Tell us about your project and where you are building.",
  "We connect you with an OnDek dealer or rep in your area.",
  "Adhesive ships alongside your membrane, matched and warrantied.",
];

export default function AdhesiveSpecs() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
            The product
          </p>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold leading-tight">
            OD 1010 at a glance
          </h2>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-start">
            <dl>
              {SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-wrap justify-between gap-x-8 gap-y-1 border-b border-foreground/10 py-4"
                >
                  <dt className="text-sm text-foreground/50">{spec.label}</dt>
                  <dd className="text-sm font-medium text-right">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Not a cart product: make the dealer path explicit */}
            <div className="rounded-2xl bg-foreground p-8 sm:p-10 text-white">
              <h3 className="text-2xl font-bold leading-tight">
                How to order
              </h3>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">
                OD 1010 is not an add-to-cart product. It ships through OnDek
                dealers with your membrane order, so the whole system arrives
                matched and covered by one warranty.
              </p>

              <ol className="mt-8 space-y-5">
                {ORDER_STEPS.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cta text-xs font-bold text-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm text-white/85 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-9 flex flex-wrap items-center gap-6">
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
