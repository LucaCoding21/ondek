import Reveal from "@/components/Reveal";
import {
  DESIGNS,
  DESIGN_FAMILY_LABELS,
  familiesInUse,
} from "@/lib/designs";

export default function DesignsIntro() {
  const families = familiesInUse(DESIGNS);

  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:py-24">
        <Reveal>
          <p className="text-sm font-bold">The collection</p>
          <div className="mt-5 border-b border-foreground/10" />

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-lg">
              Colour sets the tone of a deck. Ours is built to keep it.
            </h2>

            <div>
              <ul className="flex flex-wrap gap-2">
                {families.map((family) => (
                  <li
                    key={family}
                    className="rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground/80"
                  >
                    {DESIGN_FAMILY_LABELS[family]}
                  </li>
                ))}
                <li className="rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground/50">
                  {DESIGNS.length} designs
                </li>
              </ul>

              <p className="mt-6 text-foreground/70 leading-relaxed">
                Every OnDek design uses UV-stable inks sealed beneath a
                textured wear layer, not a surface coating that peels or
                fades. Browse the full range below, filter by colour family,
                and when you&apos;ve shortlisted a few, order free samples to
                see them against your home in real light.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
