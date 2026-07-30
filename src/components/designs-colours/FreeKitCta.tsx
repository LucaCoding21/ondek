import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

// Scattered over the photo like the reference, not pinned to corners
const FLOATING_PILLS = [
  { label: "Real vinyl samples", className: "top-[10%] left-[6%]" },
  { label: "Shipped to your door", className: "top-[18%] right-[8%]" },
  { label: "No cost, no pressure", className: "bottom-[14%] right-[12%]" },
];

function PillArrow() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-foreground/15">
      <svg className="size-3" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4 12L12 4M12 4H6M12 4V10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function FreeKitCta() {
  return (
    <section className="bg-surface">
      <div className="px-3 sm:px-4 py-16 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl min-h-[560px] lg:min-h-[620px]">
            <Image
              src="/images/hero-deck-backyard.jpg"
              alt="Waterproof vinyl deck overlooking a backyard"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

            {/* Floating proof points */}
            {FLOATING_PILLS.map((pill) => (
              <span
                key={pill.label}
                className={`absolute hidden sm:flex items-center gap-2.5 rounded-full bg-background/95 py-1.5 pl-4 pr-1.5 text-xs font-medium text-foreground ${pill.className}`}
              >
                {pill.label}
                <PillArrow />
              </span>
            ))}

            {/* The offer card */}
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:left-8 sm:bottom-8 sm:max-w-md bg-background p-7 sm:p-10">
              <p className="inline-block rounded-full border border-foreground/20 px-3.5 py-1.5 text-xs font-medium">
                Free design kit
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                See every colour in your own light.
              </h2>
              <p className="mt-4 text-foreground/70 leading-relaxed">
                Photos only get you so far. Order real vinyl samples of the
                designs you&apos;re considering and match them against your
                home before you decide.
              </p>
              <Link
                href={CTA_LINKS.designKit.href}
                className="mt-7 inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
              >
                Order your free kit
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
