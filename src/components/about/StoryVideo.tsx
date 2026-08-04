"use client";

import Image from "@/components/SiteImage";
import { useState } from "react";

const YOUTUBE_ID = "j2EynZy1Vws";

// nocookie host for the same reason the old Vimeo embed carried dnt=1 —
// nothing is tracked until the visitor chooses to play.
const EMBED = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&playsinline=1&rel=0`;

/**
 * Click-to-play facade rather than an autoplaying loop: this clip is narrated,
 * so it should start on purpose and with sound. The poster is a plain image
 * until then, which also keeps YouTube's player off the page for anyone who
 * never presses play.
 */
export default function StoryVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-foreground/5">
      {playing ? (
        <iframe
          src={EMBED}
          title="The OnDek Vinyl Worx story"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          <Image
            src="/images/ultra-hero-deck.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />

          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 place-items-center rounded-full bg-cta text-foreground shadow-lg transition-transform duration-300 group-hover:scale-105 sm:size-24">
              <svg
                viewBox="0 0 24 24"
                className="ml-1 size-7 fill-current sm:size-8"
                aria-hidden
              >
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          </span>

          <span className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-left text-white sm:bottom-7 sm:left-7">
            <span className="text-base font-bold sm:text-lg">
              Watch the OnDek story
            </span>
            <span className="text-xs uppercase tracking-[0.14em] text-white/70">
              Play video
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
