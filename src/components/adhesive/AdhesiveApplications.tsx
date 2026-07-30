import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

type PhotoCell = { kind: "photo"; src: string; alt: string };
type TextCell = {
  kind: "text";
  title: string;
  text: string;
  href: string;
  icon: React.ReactNode;
};

const CELLS: (PhotoCell | TextCell)[] = [
  {
    kind: "photo",
    src: "/images/hero-deck-backyard.jpg",
    alt: "Membrane bonded over a plywood deck",
  },
  {
    kind: "text",
    title: "Exterior-grade plywood",
    text: "Rolls out evenly over sheathing for a full-surface bond across open areas.",
    href: "/vinyl-decking/the-ultra-system",
    icon: <path d="M4 8h16v10H4zM4 12h16M9 8v10" strokeLinejoin="round" />,
  },
  {
    kind: "photo",
    src: "/images/designs/speckled-silver-scene.jpg",
    alt: "Vinyl membrane on a balcony surface",
  },
  {
    kind: "text",
    title: "Concrete and treated lumber",
    text: "Grips dry, cured concrete and pressure-treated lumber without lifting at the edges.",
    href: "/vinyl-decking/warranty",
    icon: (
      <path
        d="M4 18h16M6 18V9l6-4 6 4v9M10 18v-4h4v4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    kind: "text",
    title: "Metal flashings and details",
    text: "Aggressive initial tack holds vertical surfaces, flashings, and trim while it cures.",
    href: "/resources/faqs",
    icon: (
      <path
        d="M4 18h5v-4h5v-4h5V6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    kind: "photo",
    src: "/images/hero-deck.jpg",
    alt: "Deck stairs wrapped in vinyl membrane",
  },
];

export default function AdhesiveApplications() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
            Applications
          </p>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight max-w-xl">
            One adhesive for every part of the deck
          </h2>
          <p className="mt-4 text-sm text-foreground/60 leading-relaxed max-w-lg">
            Horizontal and vertical surfaces: plywood, pressure-treated
            lumber, cured concrete, and metal flashings.
          </p>
          <Link
            href="/vinyl-decking"
            className="mt-7 inline-block bg-foreground px-5 py-2.5 text-xs font-bold text-white hover:bg-foreground/85 transition-colors"
          >
            View all
          </Link>
        </Reveal>

        <Reveal
          stagger=".application-cell"
          className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CELLS.map((cell, i) => (
            <div key={i} className="application-cell">
              {cell.kind === "photo" ? (
                <div className="relative h-full min-h-[21rem] overflow-hidden">
                  <Image
                    src={cell.src}
                    alt={cell.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-full min-h-[21rem] flex-col bg-surface p-6">
                  <span className="flex size-9 items-center justify-center bg-cta">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden
                      className="size-5"
                    >
                      {cell.icon}
                    </svg>
                  </span>
                  <h3 className="mt-5 font-bold">{cell.title}</h3>
                  <p className="mt-auto pt-8 text-sm text-foreground/60 leading-relaxed">
                    {cell.text}
                  </p>
                  <Link
                    href={cell.href}
                    className="mt-4 inline-block self-start text-xs font-bold uppercase tracking-[0.12em] hover:text-foreground/60 transition-colors"
                  >
                    Learn more
                  </Link>
                </div>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
