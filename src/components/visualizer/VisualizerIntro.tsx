/**
 * The page opener: eyebrow, headline, and the one-line pitch. Its own
 * section above the tool, so the visualizer below reads as a self-contained
 * workspace rather than a form under a heading.
 */
export default function VisualizerIntro() {
  return (
    <section className="mx-auto max-w-[96rem] px-6 pb-16 pt-28 tablet:pb-20 tablet:pt-36">
      <p className="text-xs font-bold uppercase tracking-[0.2em]">
        Deck visualizer
      </p>
      <div className="mt-4 grid gap-5 desktop:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] desktop:gap-16">
        <h1 className="max-w-3xl text-3xl font-bold leading-[1.05] tracking-[-0.02em] tablet:text-4xl desktop:text-5xl">
          See your deck in OnDek vinyl.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-foreground/70 desktop:pt-1">
          Try the lineup on our decks or upload a photo of yours. Compare
          favourites, download the look, send it with a quote request.
        </p>
      </div>
    </section>
  );
}
