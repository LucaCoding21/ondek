"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GENERATION_MESSAGES,
  GENERATION_PROGRESS,
  REFINING_MESSAGE,
} from "@/config/visualizer";

/**
 * The generation wait, generative-fill style: the photo stays fully
 * visible with a soft light sheen sweeping across it — the work happening
 * on the image — and a frosted pill cycling through what the model is
 * doing, with a progress ring at its left.
 *
 * The ring is checkpoint-anchored, not fake-determinate: it paces against
 * the median render time (see GENERATION_PROGRESS), `progressFloor`
 * snaps it forward when a streamed partial frame really arrives, and it
 * tops out at the cap until the render actually completes. It never
 * moves backwards and never sits still.
 *
 * `refining` is set once a streamed preview is on the stage: the cycling
 * copy stops guessing and says what's actually left.
 */
export default function GeneratingOverlay({
  refining = false,
  progressFloor = 0,
}: {
  refining?: boolean;
  /** 0..1 — minimum progress backed by a real event (partial frames) */
  progressFloor?: number;
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [paced, setPaced] = useState(0);
  // Floors only ever rise — a late or out-of-order event can't pull the
  // bar backwards (the documented derive-during-render pattern)
  const [floor, setFloor] = useState(0);
  if (progressFloor > floor) setFloor(progressFloor);
  useEffect(() => {
    const startedAt = Date.now();
    const cycle = setInterval(
      () => setMessageIndex((i) => (i + 1) % GENERATION_MESSAGES.length),
      3200,
    );
    const pace = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const next =
        GENERATION_PROGRESS.cap *
        (1 - Math.exp(-elapsed / GENERATION_PROGRESS.tauSeconds));
      setPaced((current) => Math.max(current, next));
    }, 200);
    return () => {
      clearInterval(cycle);
      clearInterval(pace);
    };
  }, []);

  const percent = Math.round(Math.max(paced, floor) * 100);
  // Ring geometry: r=7 in a 20px box, stroke 2.5
  const circumference = 2 * Math.PI * 7;

  return (
    <div className="absolute inset-0 z-10">
      {/* The sweeping sheen — keyframes live in globals.css */}
      <div className="viz-sheen absolute inset-0" aria-hidden />

      {/* Status chip — the same squared ink chip the stage already uses
          for its other notes, with the progress ring leading the copy */}
      <div
        role="status"
        className="absolute bottom-3 left-3 flex items-center gap-2.5 bg-ink/70 px-3 py-2"
      >
        <svg
          role="progressbar"
          aria-label="Render progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          viewBox="0 0 20 20"
          className="size-5 flex-none -rotate-90"
        >
          <circle
            cx="10"
            cy="10"
            r="7"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2.5"
          />
          <circle
            cx="10"
            cy="10"
            r="7"
            fill="none"
            stroke="var(--cta)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent / 100)}
            style={{ transition: "stroke-dashoffset 260ms linear" }}
          />
        </svg>
        <AnimatePresence mode="wait">
          <motion.span
            key={refining ? "refining" : messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="block whitespace-nowrap text-xs font-semibold text-white"
          >
            {refining ? REFINING_MESSAGE : GENERATION_MESSAGES[messageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
