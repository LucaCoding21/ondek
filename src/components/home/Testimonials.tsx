import Reveal from "@/components/Reveal";

const TESTIMONIALS = [
  {
    quote:
      "We've installed OnDek membranes for eight years. Callbacks are basically zero. The product just holds up.",
    name: "Placeholder name",
    role: "Dealer / installer",
  },
  {
    quote:
      "Our deck went from an eyesore to the best room of the house. The under-deck patio was the bonus we didn't expect.",
    name: "Placeholder name",
    role: "Homeowner",
  },
  {
    quote:
      "The design kit sold it for us. We matched the colour to our siding before spending a dollar.",
    name: "Placeholder name",
    role: "Homeowner",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Trusted by dealers and homeowners.
          </h2>
        </Reveal>

        <Reveal
          stagger=".testimonial-card"
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <figure key={t.quote} className="testimonial-card bg-white p-8 flex flex-col">
              <div className="text-5xl font-bold text-cta leading-none">&ldquo;</div>
              <blockquote className="mt-2 flex-1 text-foreground/80 leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-bold">{t.name}</div>
                <div className="text-sm text-foreground/50">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
