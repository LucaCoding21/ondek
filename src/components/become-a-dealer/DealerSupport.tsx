import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * PLACEHOLDER PROGRAM — confirm with OnDek before this page goes live.
 *
 * OnDek has not published a dealer training or support program, so the two
 * blocks of copy below describe an ordinary manufacturer-supported path and
 * are NOT quoted from any OnDek document. They deliberately promise no
 * schedule, no cost, no certification, and no response time. Swap them for the
 * real program once it is supplied. The product details they lean on —
 * UltraSeam, OD1010, the design kit, the warranty document — are real.
 *
 * Full-bleed photograph with the copy set straight onto it, small block into
 * the top-right corner and the larger one bottom-left. The two gradients are
 * what make that legible over a bright sky and a shadowed foreground; without
 * them the top block sits on blue and disappears.
 */
export default function DealerSupport() {
  return (
    <section className="bg-background">
      <div className="relative overflow-hidden">
        <Image
          src="/images/hero-deck.jpg"
          alt="Finished OnDek vinyl deck running the width of a house"
          fill
          sizes="100vw"
          className="object-cover object-[50%_55%]"
        />

        <div className="absolute inset-0 bg-black/35" />
        {/* The top block sits over bright sky, so it needs the heavier of the
            two gradients to hold its contrast */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        <div className="relative z-10 flex min-h-[85svh] lg:min-h-[92svh] flex-col justify-between gap-24 px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 text-white">
          {/* Everything introductory in the top-left corner, the statement and
              the way out of the section in the bottom-right */}
          <Reveal className="max-w-2xl">
            <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,4.5vw,3.5rem)] sm:whitespace-nowrap">
              Training and support
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white">
              The membrane is manufactured under our own roof, so a question
              about a detail on site goes to the people who made the material
              rather than down a distribution chain. Design kits, colour
              samples, spec sheets, and the warranty document come with the
              account.
            </p>
          </Reveal>

          <Reveal className="max-w-2xl sm:self-end">
            <p className="text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.4] tracking-[-0.01em] text-balance">
              A waterproof deck is a detail job. New dealers are taken through
              the whole system before the first one goes down, and the line
              stays open long after it does.
            </p>

            <Link
              href="/resources/documents"
              className="mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-cta hover:decoration-2"
            >
              See the documents dealers work from
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M4 12L12 4M12 4H6M12 4V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
