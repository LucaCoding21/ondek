"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BLOG_CATEGORY_LABELS, type BlogPost } from "@/lib/blog";

gsap.registerPlugin(useGSAP);

export default function PostHero({
  post,
  minutes,
}: {
  post: BlogPost;
  minutes: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the hero fully visible and still.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load: breadcrumb and meta settle in, the title rises out of its
        // mask, the standfirst follows, then the photo fades up beneath it.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".ph-back", { y: 24, opacity: 0, duration: 0.7 }, 0)
          .from(".ph-meta", { y: 24, opacity: 0, duration: 0.8 }, 0.15)
          .from(
            ".ph-heading-line",
            { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.14 },
            0.3,
          )
          .from(".ph-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.7)
          .from(".ph-media", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.85);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  // A post opens on its title rather than under a photo: the words sit
  // centred on the background, and the picture runs full bleed beneath them.
  // No data-hero here — the bar has white behind it, so it stays solid.
  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-32 lg:pt-40 pb-8 lg:pb-12">
        <Link
          href="/resources/blog"
          className="ph-back group inline-flex w-fit items-center gap-2.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground/50 transition-colors hover:text-foreground"
        >
          <svg
            className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M13 8H3m0 0 4-4M3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          The OnDek blog
        </Link>

        {/* One column, read top to bottom: what it is and when it ran, then
            the title, then what it covers. Measures are capped per line —
            without the old right-hand column the title would otherwise run
            the full gutter width. */}
        <div className="mt-16 flex flex-col items-center text-center lg:mt-24">
          <p className="ph-meta flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <span className="inline-block bg-cta px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-foreground">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>

            <span className="text-sm text-foreground/60">
              {post.date}
              <span className="mx-3 text-foreground/25">&middot;</span>
              {minutes} min read
            </span>
          </p>

          {/* The title is dynamic copy, so it rises out of one mask as a
              block rather than being split into authored lines. text-wrap
              inherits, so the balance still applies inside the mask. */}
          <h1 className="mt-9 max-w-5xl font-bold leading-[1.03] tracking-[-0.03em] text-[clamp(3rem,6vw,5.5rem)] text-balance">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="ph-heading-line block">{post.title}</span>
            </span>
          </h1>

          <p className="ph-sub mt-8 max-w-2xl text-lg text-foreground/60 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Full bleed under the title, gutter to gutter */}
      <div className="ph-media relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/8] lg:aspect-[16/6]">
        <Image
          src={post.image}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
