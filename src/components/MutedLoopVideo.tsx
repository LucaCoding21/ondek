"use client";

import { useEffect, useRef, useState } from "react";

const VIMEO_ORIGIN = "https://player.vimeo.com";

// Vimeo's embed speaks JSON over postMessage — no SDK needed.
function post(frame: HTMLIFrameElement | null, method: string, value?: unknown) {
  frame?.contentWindow?.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    VIMEO_ORIGIN
  );
}

function subscribe(frame: HTMLIFrameElement | null) {
  ["play", "pause", "timeupdate"].forEach((e) =>
    post(frame, "addEventListener", e)
  );
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// controls=0 hides Vimeo's chrome, so the sound button is the only control —
// which means loop=1 is required, or the clip dead-ends on a black frame with
// no way to replay it.
function embedSrc(videoId: string) {
  return (
    `${VIMEO_ORIGIN}/video/${videoId}` +
    "?title=0&byline=0&portrait=0&dnt=1&autoplay=1&muted=1&loop=1&controls=0&playsinline=1"
  );
}

/**
 * A Vimeo clip that autoplays muted on loop with no player chrome, so the only
 * control on screen is one sound button. Fills whatever box the caller sizes.
 *
 * The button doubles as a play control: browsers that refuse muted autoplay
 * report a `pause`, and pressing it then starts the clip with sound.
 */
export default function MutedLoopVideo({
  videoId,
  title,
  blackTailSeconds = 0,
  overscan = false,
}: {
  videoId: string;
  title: string;
  /**
   * Restart this many seconds early. Only for clips that fade to black before
   * they actually end, where loop=1 alone leaves a dead beat on screen every
   * time round. Costs the tail of the clip, so leave it at 0 unless the black
   * is visible.
   */
  blackTailSeconds?: number;
  /**
   * Scale the frame up 2% to hide the rounding gap that renders as a black
   * seam on sources that aren't exactly 16:9.
   */
  overscan?: boolean;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Muted autoplay is the expected path, so assume it — a `pause` event
  // corrects the label on the browsers that block it, without a flicker on
  // the ones that don't.
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  // timeupdate keeps firing while the seek is in flight — without this the
  // restart is posted several times over.
  const restartingRef = useRef(false);

  // Mirror the player's play/pause state so the button can double as a play
  // control on browsers that refuse muted autoplay.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== VIMEO_ORIGIN) return;

      const data =
        typeof event.data === "string" ? safeParse(event.data) : event.data;
      if (!data) return;

      if (data.event === "ready") {
        subscribe(frameRef.current);
        return;
      }
      if (data.event === "timeupdate") {
        if (blackTailSeconds <= 0) return;

        const { seconds = 0, duration = 0 } = data.data ?? {};
        if (!duration) return;

        if (seconds < duration - blackTailSeconds) {
          restartingRef.current = false;
        } else if (!restartingRef.current) {
          restartingRef.current = true;
          post(frameRef.current, "setCurrentTime", 0);
        }
        return;
      }

      // Mute state isn't mirrored back: with controls=0 the button below is
      // the only thing that can change it, so our own state stays authoritative.
      if (data.event === "play") setPlaying(true);
      if (data.event === "pause") setPlaying(false);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [blackTailSeconds]);

  function toggleSound() {
    const frame = frameRef.current;

    if (!playing || muted) {
      // setVolume alone leaves the muted flag set, so both are needed.
      post(frame, "setMuted", false);
      post(frame, "setVolume", 1);
      post(frame, "play");
      setMuted(false);
      setPlaying(true);
    } else {
      post(frame, "setMuted", true);
      post(frame, "setVolume", 0);
      setMuted(true);
    }
  }

  const label = !playing ? "Play with sound" : muted ? "Unmute" : "Mute";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <iframe
        ref={frameRef}
        src={embedSrc(videoId)}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        onLoad={() => subscribe(frameRef.current)}
        tabIndex={-1}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 ${
          overscan ? "h-[102%] w-[102%]" : "h-full w-full"
        }`}
      />

      <button
        type="button"
        onClick={toggleSound}
        className="absolute top-5 right-5 flex items-center gap-2 bg-black/55 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/40 backdrop-blur-md transition-colors hover:bg-black/75"
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
        {label}
      </button>
    </div>
  );
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </svg>
  );
}
