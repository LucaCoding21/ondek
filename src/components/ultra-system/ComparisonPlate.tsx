export type Column = { title: string; items: string[] };

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="mt-[0.4em] size-4 shrink-0 stroke-current stroke-[1.5]"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" fill="none" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="mt-[0.4em] size-4 shrink-0 stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5L13 4.5" fill="none" />
    </svg>
  );
}

/**
 * The old site's comparison table as a split plate. Them on the dark neutral,
 * us on the brand gold — the two halves butt together with no seam, chamfered
 * as one piece.
 *
 * The animation hooks are passed in: each section that renders a plate owns
 * its own GSAP class prefix, so two plates on one page can't share triggers.
 */
export default function ComparisonPlate({
  typical,
  ultra,
  className = "",
  plateClass,
  checkClass,
  minHeight = "",
  padClass = "p-8 sm:p-10 lg:p-12",
}: {
  /** Omit to run the plate as the Ultra column alone, with no contrast half */
  typical?: Column;
  ultra: Column;
  className?: string;
  /** GSAP hook on the plate itself, which is also the scroll trigger */
  plateClass: string;
  /** GSAP hook on each item in the Ultra column */
  checkClass: string;
  /**
   * Floor for each half, e.g. "min-h-[20rem]". Three short items leave the
   * plate squat once it is capped narrower than its section, and padding
   * alone only pushes the content around inside it.
   */
  minHeight?: string;
  /**
   * Padding on each half. Once the items alone are taller than `minHeight`,
   * this is the only thing left that changes the plate's height.
   */
  padClass?: string;
}) {
  // Where a floor is set there is spare room below the items, and content left
  // to sit at the top of it reads as though it slipped. Centring only applies
  // in that case: without a floor each half is exactly as tall as its content,
  // so there is nothing to centre against.
  const fill = minHeight ? `${minHeight} flex flex-col justify-center` : "";
  const pad = `${fill} ${padClass}`;
  const list = "mt-8 space-y-5";
  const item = "leading-relaxed";

  return (
    <div
      className={`${plateClass} notch-frame grid ${
        typical ? "md:grid-cols-2" : ""
      } ${className}`}
    >
      {typical && (
        <div className={`bg-[#26282a] ${pad}`}>
          <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-white/50">
            {typical.title}
          </h3>
          <ul className={list}>
            {typical.items.map((text) => (
              <li key={text} className={`flex gap-3.5 text-white/65 ${item}`}>
                <span className="text-white/40">
                  <CrossIcon />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={`bg-cta ${pad}`}>
        <h3 className="text-sm font-bold uppercase tracking-[0.08em]">
          {ultra.title}
        </h3>
        <ul className={list}>
          {ultra.items.map((text) => (
            <li
              key={text}
              className={`${checkClass} flex gap-3.5 font-medium ${item}`}
            >
              <CheckIcon />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
