"use client";

import { useCallback, useRef } from "react";

/**
 * Before/after slider: design A left of the draggable divider, design B
 * right. Pointer events cover mouse and touch in one path; the handle
 * captures the pointer so the drag keeps tracking outside the divider.
 */
export default function CompareSlider({
  srcA,
  srcB,
  labelA,
  labelB,
  split,
  onSplitChange,
}: {
  srcA: string;
  srcB: string;
  labelA: string;
  labelB: string;
  /** 0..1 — position of the divider, A visible to its left */
  split: number;
  onSplitChange: (split: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const splitFromEvent = useCallback(
    (event: React.PointerEvent) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const ratio = (event.clientX - rect.left) / rect.width;
      onSplitChange(Math.min(0.97, Math.max(0.03, ratio)));
    },
    [onSplitChange],
  );

  // Photos are never cropped in the slider either — contained, over a
  // blurred fill of side A
  const imgClass = "absolute inset-0 h-full w-full select-none object-contain";

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 cursor-ew-resize touch-none"
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        splitFromEvent(event);
      }}
      onPointerMove={(event) => {
        if (dragging.current) splitFromEvent(event);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcA}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full scale-110 select-none object-cover opacity-50 blur-2xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={srcA} alt={labelA} draggable={false} className={imgClass} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcB}
        alt={labelB}
        draggable={false}
        className={imgClass}
        style={{ clipPath: `inset(0 0 0 ${split * 100}%)` }}
      />

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10"
        style={{ left: `${split * 100}%` }}
      >
        <div className="absolute inset-y-0 -ml-px w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.45)]" />
        <div className="absolute top-1/2 -ml-5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-ink"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m9 6-4 6 4 6M15 6l4 6-4 6" />
          </svg>
        </div>
      </div>

      {/* One chip, top left: left side vs right side, in reading order */}
      <span className="absolute left-3 top-3 bg-ink/70 px-2.5 py-1.5 text-xs font-medium text-white">
        {labelA}
        <span className="mx-1.5 text-white/55">vs</span>
        {labelB}
      </span>
    </div>
  );
}
