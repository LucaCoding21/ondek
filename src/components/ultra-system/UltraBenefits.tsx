import Reveal from "@/components/Reveal";

const BENEFITS = [
  {
    number: "01",
    title: "Fully waterproof",
    text: "A true waterproof membrane, not a water-resistant coating.",
    icon: (
      <path
        d="M12 4c2.9 3.4 4.7 5.9 4.7 8.2a4.7 4.7 0 1 1-9.4 0C7.3 9.9 9.1 7.4 12 4Z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: "02",
    title: "Heat-welded seams",
    text: "Seams are fused into one continuous surface with no gaps to fail.",
    icon: (
      <>
        <path d="M4 15h16" strokeLinecap="round" />
        <path d="M8 15c0-4 2-7 4-7s4 3 4 7" strokeLinecap="round" />
        <path d="M12 4v2" strokeLinecap="round" />
      </>
    ),
  },
  {
    number: "03",
    title: "Certified and code-listed",
    text: "Tested to ASTM and CGSB standards and listed for walkable roof decks.",
    icon: (
      <>
        <path
          d="M12 3l7 3v5c0 4.4-2.9 8-7 10-4.1-2-7-5.6-7-10V6l7-3Z"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    number: "04",
    title: "Warrantied as one",
    text: "Membrane, seams, and adhesive covered together under a single warranty.",
    icon: (
      <>
        <path d="M6 3h9l4 4v14H6V3Z" strokeLinejoin="round" />
        <path d="M15 3v4h4" strokeLinejoin="round" />
        <path d="M9 13h6M9 16h6" strokeLinecap="round" />
      </>
    ),
  },
];

export default function UltraBenefits() {
  return (
    <section className="bg-surface">
      <div className="pt-20 lg:pt-28 pb-20 lg:pb-28">
        <Reveal className="px-5 md:px-8 text-center">
          <p className="inline-flex items-center gap-2 bg-background px-3.5 py-1.5 text-xs font-medium">
            <span className="size-1.5 rounded-full bg-cta" />
            Why the Ultra system
          </p>
          <h2 className="mx-auto mt-8 max-w-3xl font-bold leading-[1.15] text-[clamp(2.25rem,4.5vw,3.5rem)]">
            Benefits and certifications built into every roll
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-foreground/60 leading-relaxed">
            Every roll of Ultra membrane is engineered and tested beyond code
            requirements, so your deck is covered in wet climates, rooftop
            applications, and everything between.
          </p>
        </Reveal>

        {/* Full-bleed card row; the px gaps read as hairline borders.
            No per-card stagger: transparent cards would expose the divider
            backdrop as grey bands mid-animation */}
        <Reveal className="mt-14 md:mt-20 grid gap-px bg-foreground/15 border-y border-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.number}
              className="benefit-card group flex min-h-[24rem] lg:min-h-[26rem] flex-col bg-surface p-8 transition-colors duration-300 hover:bg-cta"
            >
              <span className="text-xs font-bold text-foreground/50 transition-colors duration-300 group-hover:text-foreground/70">
                {benefit.number}.
              </span>

              <div className="flex flex-1 items-center justify-center py-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden
                  className="size-24 lg:size-28 text-foreground/50 transition-colors duration-300 group-hover:text-foreground"
                >
                  {benefit.icon}
                </svg>
              </div>

              <h3 className="text-2xl font-bold leading-tight">
                {benefit.title}
              </h3>
              <p className="mt-2.5 text-sm text-foreground/60 leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                {benefit.text}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
