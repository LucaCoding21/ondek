"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// Placeholder shots repeated to fill pages, swapped for real photos as they come in
const PLACEHOLDERS = [
  { src: "/images/hero-deck-backyard.jpg", alt: "Backyard deck project" },
  { src: "/images/designs/speckled-silver-scene.jpg", alt: "Silver deck project" },
  { src: "/images/hero-deck.jpg", alt: "Covered deck project" },
];

const PROJECTS = Array.from({ length: 12 }, (_, i) => PLACEHOLDERS[i % 3]);

const PAGE_SIZE = 6;
const PAGE_COUNT = Math.ceil(PROJECTS.length / PAGE_SIZE);

export default function ProjectGallery() {
  const [page, setPage] = useState(0);

  const visible = PROJECTS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-16">
          {/* Left rail: heading + link up top, square pagers pinned to the bottom */}
          <div className="flex flex-col">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Projects preview
            </h2>
            <Link
              href="/resources/blog"
              className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4 decoration-1 hover:decoration-cta hover:decoration-2 transition-all"
            >
              View more
              <svg className="size-3" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 8h12M10 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div className="mt-10 lg:mt-auto flex gap-3">
              {Array.from({ length: PAGE_COUNT }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Show project page ${i + 1}`}
                  aria-current={i === page}
                  className={`size-2 transition-colors ${
                    i === page
                      ? "bg-foreground"
                      : "border border-foreground/40 hover:border-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 3 x 2 grid, one page at a time */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {visible.map((project, i) => (
              <div
                key={`${page}-${i}`}
                className="relative aspect-[4/3] overflow-hidden bg-background"
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
