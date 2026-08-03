import Image from "next/image";
import Reveal from "@/components/Reveal";
import DealerCommitments from "@/components/become-a-dealer/DealerCommitments";

export default function DealerWhy() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 pb-28 lg:pb-40">
        {/* Slide composition: heading pinned top-left, the copy dropped to the
            foot of the column, and the image pair bottom-right. The empty
            middle of the left column is the point — nothing goes in it. */}
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)] lg:gap-16 xl:gap-24">
          <Reveal className="flex flex-col lg:min-h-[34rem]">
            <h2 className="max-w-lg font-bold uppercase leading-[1.05] tracking-[-0.01em] text-[clamp(1.9rem,3.6vw,3.25rem)]">
              Why partner
              <br />
              with us
            </h2>

            <p className="mt-16 lg:mt-auto lg:pt-24 max-w-xl text-lg text-foreground/80 leading-relaxed">
              We manufacture the membrane ourselves, under one roof. What that
              buys a dealer is a short list of people to call and a warranty
              that doesn&apos;t depend on which brand of adhesive went down that
              morning.
            </p>

            {/* Sat at the reference's caption size and was unreadable — kept
                subordinate to the paragraph above it, but on a rule and at a
                size that can actually be read */}
            <p className="mt-10 lg:mt-14 max-w-lg border-t border-foreground/20 pt-6 text-sm text-foreground/60 leading-relaxed">
              More than 2 million square feet of membrane has gone down to date,
              every foot of it under a 15 Year Waterproofing / 5 Year Appearance
              warranty.
            </p>
          </Reveal>

          {/* Bottom-aligned pair, narrow then wide, sharing one height */}
          <Reveal
            stagger=".why-shot"
            className="grid grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-3 sm:gap-4 lg:mt-auto"
          >
            <div className="why-shot relative h-72 sm:h-96 lg:h-[30rem] overflow-hidden">
              <Image
                src="/images/projects/deck-edge-over-lawn.webp"
                alt="Vinyl deck surface finishing into a black aluminium railing above a lawn"
                fill
                sizes="(min-width: 1024px) 16rem, 35vw"
                className="object-cover"
              />
            </div>

            <div className="why-shot relative h-72 sm:h-96 lg:h-[30rem] overflow-hidden">
              <Image
                src="/images/hero-deck-backyard.jpg"
                alt="Finished OnDek vinyl deck spanning the back of a house"
                fill
                sizes="(min-width: 1024px) 30rem, 60vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <DealerCommitments />
      </div>
    </section>
  );
}
