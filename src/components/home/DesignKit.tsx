import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA_LINKS } from "@/lib/nav";

export default function DesignKit() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              See and feel it before you commit.
            </h2>
            <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
              Order a free design kit with real vinyl samples of our most
              popular designs and colours, shipped straight to your door so you
              can match them against your home in real light.
            </p>
            <Link
              href={CTA_LINKS.designKit.href}
              className="mt-8 inline-block px-7 py-3.5 font-bold bg-cta hover:brightness-95 transition-[filter]"
            >
              Order your free kit
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            {/* Overscan by 2%: the source is 1.775:1, just off 16:9, and the
                rounding gap renders as a black seam along the top edge. */}
            <div className="relative aspect-video overflow-hidden">
              <iframe
                src="https://player.vimeo.com/video/521215844?title=0&byline=0&portrait=0&dnt=1"
                title="OnDek Design Kit"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute left-1/2 top-1/2 h-[102%] w-[102%] -translate-x-1/2 -translate-y-1/2 border-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
