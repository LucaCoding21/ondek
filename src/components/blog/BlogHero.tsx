import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { BLOG_CATEGORY_LABELS, FEATURED_POST, postPath } from "@/lib/blog";

export default function BlogHero() {
  const post = FEATURED_POST;

  return (
    // Full bleed photo, headline top left, latest post bottom right, and a
    // two-tone band cutting across the bottom edge
    <section data-hero className="relative h-dvh min-h-[600px] overflow-hidden">
      {/* Not the featured post's own photo: that one is a flat grey deck
          close-up, which makes a dull full-bleed hero. The post keeps its
          picture on the card in the grid below. */}
      <Image
        src="/images/projects/glass-railing-lakeside.webp"
        alt="Vinyl deck with a glass railing looking out over a lake"
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/65 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
      {/* Heavier and taller than the other heroes: the copy in the bottom
          right lands on lake and sky, which is the brightest part of the shot */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

      <Reveal
        stagger=".hero-line"
        className="relative z-10 flex h-full flex-col px-5 md:px-8 lg:px-12 xl:px-16 pt-32 lg:pt-40 pb-14 lg:pb-20 text-white"
      >
        {/* Everything sits on the floor of the frame: title, then what the
            blog is, then the latest post beside them */}
        <div className="mt-auto grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-end">
          <div>
            {/* Sized off the column it sits in, not the viewport, so it holds
                one line from lg up. Below that it wraps on its own. */}
            <h1 className="hero-line font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.5rem,6vw,6.5rem)] lg:whitespace-nowrap">
              The OnDek blog
            </h1>
            {/* Wide enough to set in two lines rather than three */}
            <p className="hero-line mt-7 max-w-2xl text-lg text-white/75 leading-relaxed text-balance">
              How the system goes together, what it asks of you once it&apos;s
              down, and the questions installers and homeowners keep bringing
              us.
            </p>
          </div>

          {/* No floating panel: the latest post is set as type under a
              hairline, square edges and no shadow, like the rest of the site */}
          <div className="hero-line border-t border-white/30 pt-7">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="bg-cta px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-foreground">
              Latest post
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            {/* Pushed to the far end of the rule, clear of the two tags */}
            <span className="ml-auto text-xs font-bold text-white/75">
              {post.date}
            </span>
          </p>

          <Link href={postPath(post)} className="group mt-5 flex items-start gap-5">
            <span className="text-xl font-bold leading-snug decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
              {post.title}
            </span>
            <svg
              className="mt-2 size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
          </Link>
          </div>
        </div>
      </Reveal>

    </section>
  );
}
