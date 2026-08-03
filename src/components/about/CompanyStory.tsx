import Reveal from "@/components/Reveal";
import StoryVideo from "@/components/about/StoryVideo";
import SectionLabel from "@/components/SectionLabel";

/**
 * Copy is OnDek's own About page, kept close to the source. The only edits
 * anywhere in these sections are the two em dashes in the original, which are
 * commas here to match the rest of the site.
 */
export default function CompanyStory() {
  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-20 lg:pt-32">
        {/* Deliberately off the video's left edge: wider measure, so the
            heading sits outboard of it without running to the page gutter */}
        <SectionLabel className="mx-auto max-w-[94rem]">
          Company story
        </SectionLabel>

        <Reveal className="mx-auto mt-10 max-w-[94rem]">
          {/* Wide enough for two lines, balanced so "company." can't end up
              alone on the second one */}
          <h2 className="mt-8 max-w-[54rem] font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(2.25rem,3.6vw,3.5rem)] text-balance">
            A full service waterproof vinyl decking membrane company.
          </h2>
          <p className="mt-7 max-w-xl text-foreground/60 leading-relaxed">
            A short film on where the membrane came from, who makes it, and
            what we will not compromise on to keep the price down.
          </p>
        </Reveal>
      </div>

      <Reveal
        delay={0.1}
        className="mt-12 px-5 md:px-8 lg:mt-16 lg:px-12 xl:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <StoryVideo />
        </div>
      </Reveal>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pb-20 lg:pb-32">
        <Reveal className="mx-auto mt-16 grid max-w-7xl gap-6 lg:mt-24 lg:grid-cols-[minmax(0,2fr)_minmax(0,7fr)] lg:gap-16 lg:items-start">
          <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-foreground/50">
            Who we are
          </h3>
          <div className="max-w-4xl space-y-6 text-foreground/70 leading-relaxed sm:text-justify sm:hyphens-auto">
            <p>
              OnDek Vinyl Worx Inc. builds on the success of our parent company,
              Innovative Aluminum Systems Inc. In business since 2004,
              Innovative Aluminum has built a solid network of aluminum railing
              dealers. Now, with the launch of OnDek Vinyl Worx Inc., our family
              of companies can offer all components required for today&rsquo;s
              decking contractor.
            </p>
            <p>
              After more than 20 years of building Innovative Aluminum Systems
              Inc. into a trusted aluminum railing manufacturer, our leadership
              team launched OnDek Vinyl Worx Inc. in 2020 to bring the same
              standards of quality, reliability, and service into the vinyl
              decking industry.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
