import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScrollScale from "@/components/ScrollScale";
import DesignKitVideo from "@/components/home/DesignKitVideo";
import { CTA_LINKS } from "@/lib/nav";

export default function DesignKit() {
  return (
    <section className="bg-[#26282a] text-white overflow-hidden">
      {/* At least one screen tall on lg, and taller if the spacing asks for it.
          The video is sized off the viewport rather than off whatever height is
          left over, so padding and margins here never eat into it. The top
          padding keeps the title clear of the fixed navbar. */}
      <div className="px-4 sm:px-6 lg:px-10 pt-20 pb-36 lg:py-0 lg:min-h-svh lg:pt-20 lg:pb-32 lg:flex lg:flex-col lg:justify-center">
        <Reveal className="mt-6 lg:mt-16 lg:pl-8 xl:pl-14">
          <h2 className="max-w-2xl text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08]">
            See and feel it before you commit.
          </h2>
        </Reveal>

        {/* Sized off the viewport, not off whatever height is left over, so the
            spacing around it never eats into it — aspect-video then derives the
            width. The min() caps the height by the width available on tall,
            narrow windows, where 62svh would otherwise be wider than the
            column and get squashed out of ratio. */}
        {/* 0.82: it enters at roughly the size it used to hold and grows into
            the full frame as it centres, so the scroll does the work rather
            than the video just sitting there large. */}
        <ScrollScale from={0.82} className="mt-6 lg:mt-4 flex justify-center items-center">
          <div className="aspect-video w-full max-w-7xl lg:h-[min(62svh,calc((100vw_-_6rem)*9/16))] lg:w-auto lg:max-w-full">
            <DesignKitVideo />
          </div>
        </ScrollScale>

        <Reveal
          delay={0.3}
          className="mt-10 lg:mt-12 lg:text-right lg:pr-6 xl:pr-12"
        >
          <p className="max-w-md lg:ml-auto text-lg text-white/80 leading-relaxed">
            Order a free design kit with real vinyl samples of our most popular
            designs and colours, shipped straight to your door so you can match
            them against your home in real light.
          </p>
          <Link
            href={CTA_LINKS.designKit.href}
            className="mt-5 inline-block px-7 py-3.5 font-bold text-foreground bg-cta hover:brightness-95 transition-[filter]"
          >
            Order your free kit
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
