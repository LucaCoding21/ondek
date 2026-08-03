"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_LABELS,
  GRID_POSTS,
  postPath,
  type BlogCategory,
} from "@/lib/blog";

export default function BlogIndex() {
  const [active, setActive] = useState<BlogCategory | "all">("all");

  const posts =
    active === "all"
      ? GRID_POSTS
      : GRID_POSTS.filter((post) => post.category === active);

  return (
    <section id="posts" className="scroll-mt-24 bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-24 lg:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,3.5vw,3rem)]">
            All posts
          </h2>

          {/* Chips rather than a select: five categories fit on one row and a
              filter you can see the whole of is a filter people use. Each one
              is outlined — on the grey band a fill alone barely showed. */}
          <div
            role="group"
            aria-label="Filter posts by category"
            className="flex flex-wrap gap-2"
          >
            {(["all", ...BLOG_CATEGORIES] as const).map((category) => {
              const isActive = active === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  aria-pressed={isActive}
                  className={`cursor-pointer border px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-colors ${
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/25 bg-background text-foreground/80 hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {category === "all"
                    ? "All"
                    : BLOG_CATEGORY_LABELS[category]}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* One Reveal on the container, not per card: the card set changes as
            you filter, and animating items that mount mid-scroll leaves them
            stranded at opacity 0 */}
        <Reveal className="mt-14 lg:mt-20">
          {/* Cards on their own white plate so each post has an edge, with
              the title and excerpt clamped so a row lines up whatever the
              headline length, and the read cue pinned to the bottom */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={postPath(post)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10 transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    {/* Category and date share the top line, so the foot of
                        the card is free for the read cue */}
                    <p className="flex items-baseline justify-between gap-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
                      {BLOG_CATEGORY_LABELS[post.category]}
                      <span className="shrink-0 font-normal normal-case tracking-normal text-xs text-foreground/45">
                        {post.date}
                      </span>
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug decoration-1 underline-offset-4 group-hover:underline">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm text-foreground/60 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Nothing at rest: the cue slides up in the bottom right
                        on hover, and stays reachable on keyboard focus */}
                    <span className="mt-auto flex justify-end pt-6">
                      <span className="flex translate-y-1 items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        Read post
                        <svg
                          className="size-3.5"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M4 12L12 4M12 4H6M12 4V10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {posts.length === 0 && (
            <p className="text-foreground/50">
              Nothing filed under that category yet.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
