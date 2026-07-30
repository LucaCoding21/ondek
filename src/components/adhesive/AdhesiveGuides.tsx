import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const GUIDES = [
  {
    label: "Spec sheet",
    title: "OD 1010 Product Data Sheet",
    src: "/images/hero-deck-backyard.jpg",
    href: "https://ondekvinylworx.com/wp-content/uploads/2026/01/PDS-OD1010.pdf",
    external: true,
  },
  {
    label: "Safety",
    title: "OD 1010 Safety Data Sheet",
    src: "/images/designs/speckled-silver-scene.jpg",
    href: "https://ondekvinylworx.com/wp-content/uploads/2026/01/SDS-OD1010.pdf",
    external: true,
  },
  {
    label: "Warranty",
    title: "What the Ultra warranty covers",
    src: "/images/hero-deck.jpg",
    href: "/vinyl-decking/warranty",
    external: false,
  },
];

export default function AdhesiveGuides() {
  return (
    <section className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal stagger=".guide-row">
          <ul>
            {GUIDES.map((guide) => (
              <li key={guide.title} className="guide-row border-t border-foreground/15 last:border-b">
                <Link
                  href={guide.href}
                  target={guide.external ? "_blank" : undefined}
                  rel={guide.external ? "noopener" : undefined}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-6 lg:gap-10 lg:py-8"
                >
                  <span className="relative block h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={guide.src}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </span>

                  <span>
                    <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/40">
                      {guide.label}
                    </span>
                    <span className="mt-1.5 block font-bold text-lg leading-snug group-hover:underline underline-offset-4 decoration-cta decoration-2">
                      {guide.title}
                    </span>
                  </span>

                  <svg
                    className="size-5 text-foreground/40 transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4 12L12 4M12 4H6M12 4V10"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <div className="guide-row mt-10 flex justify-end">
            <Link
              href="/resources/documents"
              className="rounded-full border border-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] hover:bg-cta hover:border-cta transition-colors"
            >
              See all documents
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
