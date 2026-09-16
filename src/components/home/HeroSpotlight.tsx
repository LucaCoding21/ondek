"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Image from "@/components/SiteImage";

// A capture of the tool itself in compare mode: the oceanview stock deck,
// original photo against Granite Brown, with the swatch column beside it.
// Recapture at /visualizer?layout=lakeview&vinyl=granite-brown when the
// UI changes. Cropped 845×553.
const TOOL_SHOT = "/images/visualizer/spotlight-tool.webp";
const PREVIEW_VIDEO = "/videos/visualizer-preview.mp4";

const ROW_CLASS =
  "group max-w-full items-center gap-3 bg-white p-1 pr-4 transition-colors duration-300 hover:bg-offwhite";

/**
 * The white spotlight card in the hero, tucked bottom-right on desktop: one low
 * row, a thumbnail of the visualizer on the left and two short lines on
 * the right. Hovering plays a screen capture of the tool inside the
 * thumbnail; leaving pauses it and fades the still back in. The video only
 * starts loading on that first hover, so the hero's LCP never pays for it.
 * Below desktop the hero has no free corner, so HeroSpotlightPill carries
 * the same row inline above the headline instead.
 */
export default function HeroSpotlight() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    // preload="none": the first hover is what fetches the file
    if (video.preload === "none") video.preload = "auto";
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }

  function stop() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaying(false);
  }

  return (
    <Link
      href="/visualizer"
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className={`hero-fade-card absolute bottom-32 right-10 z-10 hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] desktop:inline-flex ${ROW_CLASS}`}
    >
      <span className="relative block h-[68px] w-[104px] shrink-0 overflow-hidden bg-ink">
        <Image
          src={TOOL_SHOT}
          alt="The deck visualizer comparing the original photo with Granite Brown vinyl"
          fill
          sizes="208px"
          className="object-cover"
        />
        <video
          ref={videoRef}
          src={PREVIEW_VIDEO}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
      <Copy />
    </Link>
  );
}

/**
 * The phone and tablet form: the same row, inline above the headline. No
 * video: there is no hover to trigger it. Hidden on short viewports, where
 * the bottom-aligned copy block has no room left above the headline.
 */
export function HeroSpotlightPill() {
  return (
    <Link
      href="/visualizer"
      className={`hero-fade-sub mb-5 inline-flex shrink-0 self-start [@media(max-height:719px)]:hidden desktop:hidden ${ROW_CLASS}`}
    >
      <span className="relative block h-11 w-[68px] shrink-0 overflow-hidden bg-ink">
        <Image
          src={TOOL_SHOT}
          alt=""
          aria-hidden
          fill
          sizes="68px"
          className="object-cover object-left"
        />
      </span>
      <Copy />
    </Link>
  );
}

function Copy() {
  return (
    <span className="min-w-0 desktop:max-w-[150px]">
      <span className="block font-heading text-[0.95rem] font-medium leading-[1.15] text-ink">
        We built a deck visualizer
      </span>
      <span className="mt-1 flex items-center gap-1.5 font-body text-[0.7rem] leading-none text-ink/60">
        Your deck, our vinyl.
        <svg
          viewBox="0 0 24 24"
          className="size-3 text-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </span>
  );
}
