import Reveal from "@/components/Reveal";
import EdgeBlueprint from "@/components/ultra-system/EdgeBlueprint";

export default function UltraIntro() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:py-24">
        <Reveal>
          <p className="text-sm font-bold">The system</p>
          <div className="mt-5 border-b border-foreground/10" />

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-lg">
                What makes it Ultra? Every part is built for the part next to
                it.
              </h2>
              <p className="mt-6 text-foreground/70 leading-relaxed max-w-md">
                Most deck coatings are a single product doing all the work.
                The Ultra system is different: a multi-layer vinyl membrane,
                heat-welded seams, and a system-matched adhesive, each
                engineered and tested against the others so the finished deck
                performs as one surface.
              </p>
            </div>

            {/* Edge-profile blueprint, oversized so the section edge crops it
                like the technical-drawing reference. Same viewBox as the PNG
                it replaces, so the crop lands where it always did. */}
            <div className="relative">
              <EdgeBlueprint className="w-full h-auto scale-[1.3] lg:scale-[1.45] origin-top text-foreground/35" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
