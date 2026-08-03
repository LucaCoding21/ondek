import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function DocsCta() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pb-24 lg:pb-32">
        {/* The same dark panel that closes the adhesive and warranty pages */}
        <Reveal className="bg-foreground p-8 sm:p-12 lg:p-16 text-white">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-md">
                Need a drawing we haven&apos;t published?
              </h2>
              <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-md">
                Send us the condition (an unusual termination, a penetration,
                a substrate you haven&apos;t detailed before) and we will get
                you a drawing for it. Specifiers and installers both reach the
                same technical team.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 lg:justify-end">
              <Link
                href={CTA_LINKS.quote.href}
                className="inline-block px-7 py-3.5 font-bold bg-cta text-foreground hover:brightness-95 transition-[filter]"
              >
                Contact us
              </Link>
              <Link
                href="/resources/faqs"
                className="text-xs font-bold uppercase tracking-[0.12em] text-white/80 underline underline-offset-4 decoration-1 hover:text-white transition-colors"
              >
                Read the FAQs
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
