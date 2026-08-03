import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";

/**
 * PLACEHOLDER QUOTES — none of these are attributed, and none are real. They
 * follow the same convention as the homepage testimonials ("Placeholder name")
 * so nobody mistakes them for approved copy. Replace with quotes OnDek has
 * permission to publish, with the dealer's name, company, and region.
 */
const QUOTES = [
  {
    quote:
      "Eight seasons of these decks and I can count the callbacks on one hand. That is the whole pitch, really.",
    name: "Placeholder name",
    role: "Dealer / installer",
  },
  {
    quote:
      "The under-deck space is what sells it. We walk homeowners underneath, they see a dry patio, and the job gets bigger.",
    name: "Placeholder name",
    role: "Dealer / installer",
  },
  {
    quote:
      "Crew picked up the welding faster than I expected. After the first deck it was just another part of the build.",
    name: "Placeholder name",
    role: "Dealer / installer",
  },
];

export default function DealerTestimonials() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 pb-28 lg:pb-40">
        <SectionLabel>Dealer testimonials</SectionLabel>

        <Reveal className="mt-10">
          <h2 className="mt-8 max-w-2xl font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.5rem)]">
            From the crews who put it down.
          </h2>
        </Reveal>

        {/* No card chrome — a rule over each column, the way the coverage and
            reasons lists are set. Keeps the section mostly air. */}
        <Reveal
          stagger=".dealer-quote"
          className="mt-16 lg:mt-24 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12 xl:gap-16"
        >
          {QUOTES.map((item) => (
            <figure key={item.quote} className="dealer-quote flex flex-col">
              <div className="border-t border-foreground/20" />

              <div className="mt-8 text-5xl font-bold leading-none text-cta">
                &ldquo;
              </div>

              <blockquote className="mt-4 flex-1 text-lg text-foreground/80 leading-relaxed text-balance">
                {item.quote}
              </blockquote>

              <figcaption className="mt-8">
                <div className="text-sm font-bold">{item.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.12em] text-foreground/50">
                  {item.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
