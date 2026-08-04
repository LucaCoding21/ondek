"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@/components/SiteImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Real project photography — five shots, more to come
const PROJECTS = [
  {
    src: "/images/projects/lake-view-glass-railing.webp",
    alt: "Lakeside deck with glass railing and patio seating",
  },
  {
    src: "/images/projects/grey-deck-black-railing.webp",
    alt: "Grey vinyl deck with black picket railing",
  },
  {
    src: "/images/projects/cedar-post-forest-deck.webp",
    alt: "Deck with cedar post and black railing overlooking forest",
  },
  {
    src: "/images/projects/hillside-deck-autumn.webp",
    alt: "Hillside deck in autumn light",
  },
  {
    src: "/images/projects/deck-edge-over-lawn.webp",
    alt: "Deck edge and railing looking out over a lawn",
  },
];

// Same drift as the why-vinyl showcase: two shots per row at different widths
// and vertical offsets, each scrubbing at its own rate. Transforms are split
// across three elements on purpose — the outer figure carries the parallax,
// the inner wrapper the entry animation, and the <img> the slow scale.
const ROWS = [
  { big: 0, small: 1, rates: [-8, 12] },
  { big: 2, small: 3, rates: [10, -6] },
];

export default function ProjectGallery() {
  const ref = useRef<HTMLElement>(null);
  const [openAt, setOpenAt] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = openAt !== null;

  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) =>
        i === null ? i : (i + delta + PROJECTS.length) % PROJECTS.length,
      ),
    [],
  );

  // Esc and arrows while open, and the page behind held still so scrolling
  // the overlay away is not possible
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenAt(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, step]);

  useGSAP(
    () => {
      // Entry: fade up 40px. Kept outside matchMedia — it's a short move that
      // the reduced-motion CSS block already flattens for everything else.
      gsap.utils.toArray<HTMLElement>(".float-in").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Parallax and the slow scale are the motion worth opting out of
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // Heading rises out of its mask — the site's signature entrance,
        // gated here so reduced-motion users get it static and visible
        gsap.from(".pg-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".pg-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-rate]").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.rate),
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".float-frame").forEach((frame) => {
          gsap.fromTo(
            frame.querySelector("img"),
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "center center",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  const shown = openAt === null ? null : PROJECTS[openAt];

  return (
    <section ref={ref} className="bg-background overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-24 lg:py-32">
        {/* One thought, one line, one mask. The pb/-mb pair leaves
            descenders ("Projects" has a j) room inside the mask. */}
        <h2 className="pg-heading max-w-2xl text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-balance">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="pg-heading-line block">Projects preview</span>
          </span>
        </h2>

        <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-[9vh]">
          {ROWS.map((row, i) => {
            const flipped = i % 2 === 1;

            return (
              <div
                key={PROJECTS[row.big].src}
                className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[3vw]"
              >
                <figure
                  data-rate={row.rates[0]}
                  className={`lg:w-[45vw] lg:shrink-0 ${
                    flipped ? "lg:order-2 lg:mt-[20vh]" : ""
                  }`}
                >
                  <div className="float-in">
                    <button
                      type="button"
                      onClick={() => setOpenAt(row.big)}
                      aria-label={`View larger: ${PROJECTS[row.big].alt}`}
                      className="float-frame relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
                    >
                      <Image
                        src={PROJECTS[row.big].src}
                        alt={PROJECTS[row.big].alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </button>
                  </div>
                </figure>

                <figure
                  data-rate={row.rates[1]}
                  className={`lg:w-[28vw] lg:shrink-0 ${
                    flipped
                      ? "lg:order-1 lg:mt-[10vh] lg:mr-[3vw]"
                      : "lg:mt-[14vh] lg:ml-[3vw]"
                  }`}
                >
                  <div className="float-in">
                    <button
                      type="button"
                      onClick={() => setOpenAt(row.small)}
                      aria-label={`View larger: ${PROJECTS[row.small].alt}`}
                      className="float-frame relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden"
                    >
                      <Image
                        src={PROJECTS[row.small].src}
                        alt={PROJECTS[row.small].alt}
                        fill
                        sizes="(min-width: 1024px) 28vw, 100vw"
                        className="object-cover"
                      />
                    </button>
                  </div>
                </figure>
              </div>
            );
          })}

          {/* The fifth closes the run on its own, held to the left so it lands
              under the big frames rather than trailing off the right edge */}
          <figure data-rate={-9} className="lg:mr-auto lg:w-[28vw]">
            <div className="float-in">
              <button
                type="button"
                onClick={() => setOpenAt(4)}
                aria-label={`View larger: ${PROJECTS[4].alt}`}
                className="float-frame relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
              >
                <Image
                  src={PROJECTS[4].src}
                  alt={PROJECTS[4].alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover"
                />
              </button>
            </div>
          </figure>
        </div>
      </div>

      {shown && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project photo"
          onClick={() => setOpenAt(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpenAt(null)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Stop the backdrop handler from firing for the controls and the
              photo itself — only the surrounding black should close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-5 flex size-11 items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path
                d="M15 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-5 flex size-11 items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-full w-full max-w-6xl"
          >
            <Image
              key={shown.src}
              src={shown.src}
              alt={shown.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
