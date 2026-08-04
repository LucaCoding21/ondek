"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionLabel from "@/components/SectionLabel";
import {
  FEATURED_VIDEOS,
  LIBRARY_VIDEOS,
  VIDEO_COUNT,
  videoEmbedSrc,
  videoThumb,
  type OndekVideo,
} from "@/lib/videos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Click-to-play facade: 23 live embeds on one page would be a network storm,
 * so each card shows the video's own thumbnail and only mounts its iframe
 * once asked for. YouTube publishes thumbnails as static images; the one
 * Vimeo video gets a dark tile instead.
 */
function VideoCard({ video }: { video: OndekVideo }) {
  const [playing, setPlaying] = useState(false);
  const thumb = videoThumb(video);

  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden bg-[#26282a]">
        {playing ? (
          <iframe
            src={videoEmbedSrc(video)}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${video.title}`}
            className="group absolute inset-0 block h-full w-full cursor-pointer"
          >
            {thumb && (
              // eslint-disable-next-line @next/next/no-img-element -- static
              // YouTube thumbnail; not worth a remotePatterns entry
              <img
                src={thumb}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            )}
            <span className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/10" />
            <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center bg-cta text-foreground transition-transform duration-300 group-hover:scale-110">
              <svg className="size-5" viewBox="0 0 16 16" aria-hidden>
                <path d="M5 3.5v9l7.5-4.5L5 3.5Z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-4">
        <span className="block font-bold leading-snug">{video.title}</span>
        {video.blurb && (
          <span className="mt-2 block max-w-xl text-sm text-foreground/60 leading-relaxed">
            {video.blurb}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export default function VideoLibrary() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the page static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load, not scroll: the heading opens the page. It rises out of its
        // mask, the standfirst follows through.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(
          ".vl-heading-line",
          { yPercent: 118, duration: 1.1, ease: "power4.out" },
          0,
        ).from(".vl-sub", { y: 28, opacity: 0, duration: 0.9 }, 0.4);

        // The two featured cards arrive as a pair, the grid card by card.
        // Wrappers only — the play state swaps children inside them.
        gsap.from(".vl-featured", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".vl-featured-row",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from(".vl-card", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".vl-grid",
            start: "top 88%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-36 lg:pt-48 pb-16 lg:pb-20 text-center">
        {/* One thought, one line, one mask. The pb/-mb pair leaves the
            descender room inside the mask. */}
        <h1 className="mx-auto max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.02em]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="vl-heading-line block">Watch and learn</span>
          </span>
        </h1>
        <p className="vl-sub mx-auto mt-5 max-w-xl text-foreground/60 leading-relaxed">
          We share everything from how-to instructions to answers to
          frequently asked questions. Browse {VIDEO_COUNT} videos on OnDek
          vinyl decking and roofing products.
        </p>
      </div>

      {/* The UltraFlash pair the source page leads with, at full width */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-8 pb-20 lg:pb-28">
        <SectionLabel>Featured</SectionLabel>
        <div className="vl-featured-row mt-10 grid gap-x-8 gap-y-14 lg:grid-cols-2">
          {FEATURED_VIDEOS.map((video) => (
            <div key={video.title} className="vl-featured">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>

      {/* The full grid on the grey band, three across */}
      <div className="bg-surface">
        <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-16 lg:pt-24 pb-24 lg:pb-32">
          <SectionLabel>All videos</SectionLabel>
          <div className="vl-grid mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY_VIDEOS.map((video) => (
              <div key={video.title} className="vl-card">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
