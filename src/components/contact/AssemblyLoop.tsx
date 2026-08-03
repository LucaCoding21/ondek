"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const FRAME_COUNT = 40;
const frameSrc = (i: number) =>
  `/images/deck-assembly/frame-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * The homepage's deck-assembly render, playing itself instead of being scrubbed
 * by the scroll. Same 40 frames and the same bitmap-blit approach as
 * UltraSystem — the difference is the playhead is driven by a looping tween
 * here, so the panel is a video in everything but codec, with no file to host
 * and no third-party player on the page.
 *
 * Yoyo rather than a cut back to frame 0: the deck assembles, holds, then comes
 * apart again, so the loop has no seam. The frames carry real transparency,
 * which is why this sits on the light panel — the black edge trim would
 * disappear against the dark page behind it.
 */
export default function AssemblyLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      const frames: (ImageBitmap | null)[] = new Array(FRAME_COUNT).fill(null);
      const playhead = { frame: 0 };
      let cancelled = false;

      // The tween fires far more often than the picture actually changes
      let lastDrawn = -1;

      const render = () => {
        const exact = playhead.frame;
        const key = Math.round(exact * 20);
        if (key === lastDrawn) return;

        const index = Math.floor(exact);
        const next = Math.min(index + 1, FRAME_COUNT - 1);
        const blend = exact - index;
        const current = frames[index];
        // Marked drawn only once it actually is — otherwise a decode that lands
        // later is skipped as a repeat and the canvas stays blank
        if (!current) return;

        lastDrawn = key;
        // Required, not hygiene: these frames are transparent, so without a
        // clear the previous frame shows through every gap
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(current, 0, 0, canvas.width, canvas.height);

        // 40 frames is coarse enough to read as stepping, so the next frame is
        // dissolved over the current one by the fractional part
        const upcoming = frames[next];
        if (blend > 0.01 && upcoming) {
          ctx.globalAlpha = blend;
          ctx.drawImage(upcoming, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }
      };

      const load = async (i: number) => {
        try {
          const response = await fetch(frameSrc(i));
          const bitmap = await createImageBitmap(await response.blob());
          if (cancelled) {
            bitmap.close();
            return;
          }
          frames[i] = bitmap;
          render();
        } catch {
          // A dropped frame degrades to holding the previous one, which beats
          // tearing down the whole sequence
        }
      };

      // All of them up front: this panel is on the first screen, and there is
      // no scroll position to wait for
      for (let i = 0; i < FRAME_COUNT; i++) load(i);

      const mm = gsap.matchMedia();

      // Reduced motion: no loop, just the assembled system
      mm.add("(prefers-reduced-motion: reduce)", () => {
        playhead.frame = FRAME_COUNT - 1;
        render();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(playhead, {
          frame: FRAME_COUNT - 1,
          duration: 4.5,
          ease: "none",
          repeat: -1,
          yoyo: true,
          repeatDelay: 1,
          onUpdate: render,
        });
        return () => tween.kill();
      });

      return () => {
        mm.revert();
        // Decoded bitmaps are not garbage collected on their own
        cancelled = true;
        for (const frame of frames) frame?.close();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="w-full">
      <canvas
        ref={canvasRef}
        width={1047}
        height={654}
        role="img"
        aria-label="The Ultra system assembling onto a deck edge: substrate, edge trim, and vinyl membrane coming together, then apart again"
        // Capped against the viewport, not just the column: at 1047×654 the
        // render is what drives the row's height, and left uncapped it pushes
        // the send button and the meta bar off the first screen
        className="block h-auto max-h-[30svh] w-full object-contain"
      />
    </div>
  );
}
