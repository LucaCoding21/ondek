"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Two images per row at different widths and different vertical offsets, so
// they drift against each other rather than sitting on a grid line. Transforms
// are split across three elements on purpose: the outer wrapper carries the
// scrub parallax, the inner one the entry animation, and the <img> the slow
// scale — stacking them on one node would have the tweens fight over y.
const ROWS = [
  {
    big: {
      src: "/images/projects/hillside-deck-autumn.webp",
      alt: "Vinyl deck on a hillside home surrounded by autumn trees",
      label: "Hillside deck",
      caption: "One sheet from the house wall to the drip edge.",
      rate: -8,
    },
    small: {
      src: "/images/projects/cedar-post-forest-deck.webp",
      alt: "Deck with cedar posts at the edge of a forest",
      label: "Forest edge",
      caption: "Cedar posts, membrane sealed around every penetration.",
      rate: 12,
    },
  },
  {
    big: {
      src: "/images/projects/glass-railing-lakeside.webp",
      alt: "Lakeside vinyl deck with a glass railing",
      label: "Lakeside",
      caption: "Glass railing, uninterrupted surface underfoot.",
      rate: 10,
    },
    small: {
      src: "/images/projects/deck-edge-over-lawn.webp",
      alt: "Vinyl deck edge finished over a lawn, with dry space beneath",
      label: "The space below",
      caption: "Water leaves at the edge, so underneath stays dry and usable.",
      rate: -6,
    },
  },
];

type Shot = (typeof ROWS)[number]["big"];

function Figure({
  shot,
  className,
  frameClass = "",
  sizes,
  ratio,
}: {
  shot: Shot;
  className: string;
  /** Bleed applied to the frame alone — the caption stays inside the page
      gutter, so widening the picture never clips the words under it. */
  frameClass?: string;
  sizes: string;
  ratio: string;
}) {
  return (
    <figure className={className} data-rate={shot.rate}>
      <div className="float-in">
        <div
          className={`float-frame relative overflow-hidden ${ratio} ${frameClass}`}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            className="object-cover"
            sizes={sizes}
          />
        </div>
        <figcaption className="mt-5 max-w-xs">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">
            {shot.label}
          </span>
          <span className="mt-2 block text-white/60 leading-relaxed">
            {shot.caption}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

export default function ProjectShowcase() {
  const ref = useRef<HTMLElement>(null);

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

  return (
    <section ref={ref} className="bg-foreground text-white overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-24 lg:py-32">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-balance">
            Decks we&apos;ve covered
          </h2>
          <p className="mt-6 max-w-md text-lg text-white/60 leading-relaxed">
            Every one of these is a single sheet of membrane, edge to edge. The
            space underneath stays dry enough to live in.
          </p>
        </div>

        <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-[9vh]">
          {ROWS.map((row, i) => (
            <div
              key={row.big.src}
              className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[3vw]"
            >
              <Figure
                shot={row.big}
                className={`lg:w-[46vw] lg:shrink-0 ${
                  i % 2 === 0 ? "" : "lg:order-2 lg:mt-[16vh]"
                }`}
                // Runs off the outer edge of the page, clipped by the section
                frameClass={
                  i % 2 === 0
                    ? "lg:-ml-[6vw] lg:w-[calc(100%+6vw)]"
                    : "lg:-mr-[6vw] lg:w-[calc(100%+6vw)]"
                }
                ratio="aspect-[4/3]"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              <Figure
                shot={row.small}
                className={`lg:w-[30vw] lg:shrink-0 ${
                  i % 2 === 0
                    ? "lg:mt-[9vh] lg:ml-[3vw]"
                    : "lg:order-1 lg:mt-[7vh] lg:mr-[3vw]"
                }`}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 28vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
