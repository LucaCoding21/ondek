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
 * doing, with a thin progress bar along its bottom edge.
 *
 * The bar is checkpoint-anchored, not fake-determinate: it paces against
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

  return (
    <div className="absolute inset-0 z-10">
      {/* The sweeping sheen — keyframes live in globals.css */}
      <div className="viz-sheen absolute inset-0" aria-hidden />

      {/* Status chip — the same squared ink chip the stage already uses
          for its other notes, with the progress bar as its bottom edge */}
      <div
        role="status"
        className="absolute bottom-3 left-3 overflow-hidden bg-ink/70 px-3 pb-2 pt-1.5"
      >
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
        <span
          role="progressbar"
          aria-label="Render progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="absolute inset-x-0 bottom-0 block h-[3px] bg-white/20"
        >
          <span
            className="block h-full bg-cta"
            style={{
              width: `${percent}%`,
              transition: "width 260ms linear",
            }}
          />
        </span>
      </div>
    </div>
  );
}
