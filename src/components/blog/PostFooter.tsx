"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BLOG_CATEGORY_LABELS,
  postPath,
  type BlogPost,
} from "@/lib/blog";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PostFooter({ posts }: { posts: BlogPost[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading rises out of its mask, the all-posts link just behind it
        gsap.from(".pf-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".pf-head",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".pf-all", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pf-head",
            start: "top 78%",
            once: true,
          },
        });

        // Related cards follow through as a short run
        gsap.from(".pf-card", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".pf-grid",
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  // Same card anatomy as the index grid, so the foot of a post is a smaller
  // version of the page it came from rather than a new pattern
  return (
    <section ref={ref} className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <div className="pf-head flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.75rem,3vw,2.5rem)]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="pf-heading-line block">Keep reading</span>
            </span>
          </h2>

          <Link
            href="/resources/blog"
            className="pf-all group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
          >
            All posts
            <svg
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M2.5 8h11m0 0L9.5 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="pf-grid mt-12 lg:mt-16">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="pf-card">
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
                    <p className="flex items-baseline justify-between gap-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
                      {BLOG_CATEGORY_LABELS[post.category]}
                      <span className="shrink-0 text-xs font-normal normal-case tracking-normal text-foreground/45">
                        {post.date}
                      </span>
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug decoration-1 underline-offset-4 group-hover:underline">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm text-foreground/60 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
