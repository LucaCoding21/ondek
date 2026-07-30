"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import {
  DESIGNS,
  DESIGN_FAMILY_LABELS,
  DESIGN_TAG_LABELS,
  familiesInUse,
  type DesignFamily,
} from "@/lib/designs";

type Filter = DesignFamily | "all";

export default function ColourGallery() {
  const [filter, setFilter] = useState<Filter>("all");

  const families = familiesInUse(DESIGNS);
  const visible =
    filter === "all" ? DESIGNS : DESIGNS.filter((d) => d.family === filter);

  const filterButton = (value: Filter, label: string, count: number) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] border transition-colors ${
        filter === value
          ? "bg-foreground text-white border-foreground"
          : "border-foreground/20 text-foreground/60 hover:border-foreground/50 hover:text-foreground"
      }`}
    >
      {label}
      <span className={filter === value ? "text-white/50" : "text-foreground/35"}>
        {" "}
        {count}
      </span>
    </button>
  );

  return (
    <section id="gallery" className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-bold leading-[1.1] text-[clamp(2.25rem,3.4vw,3rem)]">
              All designs
            </h2>

            <div className="flex flex-wrap gap-2">
              {filterButton("all", "All", DESIGNS.length)}
              {families.map((family) =>
                filterButton(
                  family,
                  DESIGN_FAMILY_LABELS[family],
                  DESIGNS.filter((d) => d.family === family).length,
                ),
              )}
            </div>
          </div>
        </Reveal>

        <ul className="mt-10 md:mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((design) => (
            <li key={design.slug} className="group">
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ backgroundColor: design.tone }}
              >
                <Image
                  src={design.swatch}
                  alt={`${design.name} vinyl decking pattern`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {design.tag && (
                  <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/90 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                    <span
                      className={`size-1.5 rounded-full ${
                        design.tag === "sold-out"
                          ? "bg-foreground/30"
                          : "bg-cta"
                      }`}
                    />
                    {DESIGN_TAG_LABELS[design.tag]}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-bold text-xl leading-tight">
                  {design.name}
                </h3>
                <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  {DESIGN_FAMILY_LABELS[design.family]}
                </span>
              </div>
              {design.blurb && (
                <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">
                  {design.blurb}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
