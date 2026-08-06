"use client";

import { useRef } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PART_ANCHORS } from "@/lib/deckAssemblyAnchors";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 40;
const frameSrc = (i: number) =>
  `/images/deck-assembly/frame-${String(i + 1).padStart(3, "0")}.webp`;

/** The three parts in the render, with the colour each is drawn in sampled
 *  from the frames. `labelAt` is a fixed spot on the canvas — the words stay
 *  put and only the leader tracks the part. Each was picked from a coverage
 *  map of all 40 frames: these three regions are the ones never painted, so a
 *  label there never sits on top of the render. */
const PARTS = [
  {
    swatch: "#753b10",
    title: "Deck substrate",
    labelAt: [0.88, 0.9] as const,
  },
  {
    swatch: "#1f1e1d",
    title: "Edge trim",
    labelAt: [0.1, 0.93] as const,
  },
  {
    swatch: "#969696",
    title: "Vinyl membrane",
    labelAt: [0.72, 0.07] as const,
  },
];

export default function UltraSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leaderRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      // Bitmap size comes from the width/height attributes in the markup —
      // the layout derives the drawn width from them, so they can't wait for JS

      // ImageBitmaps, not <img>: drawing an <img> the browser has not decoded
      // yet forces a synchronous decode on the main thread, and one of those
      // mid-scrub is a dropped frame. createImageBitmap does that work off the
      // main thread once, up front, so every draw is a straight blit.
      const frames: (ImageBitmap | null)[] = new Array(FRAME_COUNT).fill(null);
      const playhead = { frame: 0 };
      let cancelled = false;

      // Skips redundant draws: the scrub fires far more often than the picture
      // actually changes, and every skipped tick is a full-canvas blit saved
      let lastDrawn = -1;

      const render = () => {
        const exact = playhead.frame;
        const key = Math.round(exact * 20);
        if (key === lastDrawn) return;

        const index = Math.floor(exact);
        const next = Math.min(index + 1, FRAME_COUNT - 1);
        const blend = exact - index;
        const current = frames[index];
        // Marked drawn only once it actually is — otherwise the decode that
        // lands later is skipped as a repeat and the canvas stays blank
        if (!current) return;

        lastDrawn = key;
        // Required, not hygiene: these frames carry real transparency, so
        // without a clear the previous frame shows through every gap
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(current, 0, 0, canvas.width, canvas.height);

        // 40 frames is coarse enough to read as stepping, so the next frame is
        // dissolved over the current one by the fractional part. Drawing it
        // *over* an already-opaque frame (rather than blending both down) keeps
        // the body solid and confines the blend to the moving edges.
        const upcoming = frames[next];
        if (blend > 0.01 && upcoming) {
          ctx.globalAlpha = blend;
          ctx.drawImage(upcoming, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }

        moveAnnotations(index, next, blend);
      };

      // Only the leader moves — the labels are static, so the words stay put
      // and the elbow tracks the part on the same interpolated playhead as the
      // frames, keeping line and part together mid-blend
      const moveAnnotations = (index: number, next: number, blend: number) => {
        PART_ANCHORS.forEach((track, part) => {
          const from = track[index];
          const to = track[next];
          // Canvas units, so the stroke scales with the render
          const x = (from[0] + (to[0] - from[0]) * blend) * canvas.width;
          const y = (from[1] + (to[1] - from[1]) * blend) * canvas.height;
          const [labelX, labelY] = PARTS[part].labelAt;
          const originX = labelX * canvas.width;
          const originY = labelY * canvas.height;

          // Right-angle leader: out from the label along its own row, then a
          // single turn down or up onto the part
          leaderRefs.current[part]?.setAttribute(
            "points",
            `${originX},${originY} ${x},${originY} ${x},${y}`
          );
          dotRefs.current[part]?.setAttribute("cx", String(x));
          dotRefs.current[part]?.setAttribute("cy", String(y));
        });
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
          // A dropped frame degrades to holding the previous one, which is far
          // better than tearing down the whole sequence
        }
      };

      // The first frame right away so the canvas is never empty, the rest once
      // the section is within a screen of view. Nothing is requested during the
      // scrub itself — each frame is fetched and decoded once, then blitted.
      load(0);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom+=100%",
        once: true,
        onEnter: () => {
          for (let i = 1; i < FRAME_COUNT; i++) load(i);
        },
      });

      const mm = gsap.matchMedia();

      // Reduced motion: skip the scrub, show the assembled system
      mm.add("(prefers-reduced-motion: reduce)", () => {
        playhead.frame = FRAME_COUNT - 1;
        // The last frame may not be requested yet; every load calls render(),
        // so this settles as soon as it arrives
        render();
      });

      mm.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile:
            "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean };

          // Headline lines rise out of their masks — the same signature move
          // as the hero and Design kit. fromTo (not from) here and below:
          // matchMedia tweens escape useGSAP's auto-revert, so a StrictMode
          // remount must not capture mid-tween values as targets.
          gsap.fromTo(
            ".ultra-heading-line",
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 1,
              ease: "power4.out",
              stagger: 0.14,
              overwrite: "auto",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              },
            }
          );

          gsap.fromTo(
            ".ultra-fade",
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: "auto",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              },
            }
          );

          gsap.to(playhead, {
            frame: FRAME_COUNT - 1,
            ease: "none",
            onUpdate: render,
            scrollTrigger: desktop
              ? {
                  // Scroll-locked: pin the section and scrub through the frames.
                  // Kept short deliberately: with only 40 frames, a longer pin
                  // spends more scroll on each one, which reads as stepping.
                  trigger: sectionRef.current,
                  start: "top top",
                  end: "+=100%",
                  pin: true,
                  // Higher than a typical scrub: with only 40 source frames
                  // the playhead's own easing is doing real smoothing work
                  scrub: 1,
                  anticipatePin: 1,
                }
              : {
                  // Too tall to pin comfortably on small screens; scrub in place
                  trigger: sectionRef.current,
                  start: "top 65%",
                  end: "bottom 85%",
                  scrub: 0.5,
                },
          });
        }
      );

      return () => {
        mm.revert();
        // Decoded bitmaps are not garbage collected on their own
        cancelled = true;
        for (const frame of frames) frame?.close();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-background overflow-hidden">
      {/* Pinned at "top top", and the content is centred in what the padding
          leaves — so the lopsided pt/pb is what sits the block high on the
          screen while still clearing the fixed navbar. Everything has to fit
          one screen; nothing past 100vh survives the pin. */}
      {/* Wider than the site's max-w-7xl sections, matching the padding scale
          UltraPinned uses for this same subject; the cap keeps line lengths
          sane on very large displays instead of running full-bleed. */}
      <div className="mx-auto flex w-full max-w-[100rem] flex-col justify-center px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:min-h-screen lg:pt-12 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-14">
          {/* Headline pinned to the top, card pushed to the bottom — the gap
              between them is what gives the column its shape, so it is the
              justify-between doing the work rather than a fixed margin. */}
          <div className="flex flex-col justify-between gap-10 lg:gap-14">
            {/* Split where the thought breaks, each line in its own mask. The
                pb/-mb pair leaves descenders room inside the mask. */}
            <h2 className="text-4xl sm:text-5xl font-bold leading-[1.08]">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ultra-heading-line block">
                  Waterproof from
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span className="ultra-heading-line block">
                  seam to edge
                </span>
              </span>
            </h2>

            <div className="ultra-fade bg-surface p-6 sm:p-7">
              {/* A key to the render, so it leads the card — each swatch is
                  sampled from the part it names */}
              <ul className="flex flex-wrap gap-x-6 gap-y-2 border-b border-foreground/10 pb-4">
                {PARTS.map((part) => (
                  <li
                    key={part.title}
                    className="flex items-center gap-2 text-xs text-foreground/60"
                  >
                    <span
                      aria-hidden
                      style={{ backgroundColor: part.swatch }}
                      className="block h-2.5 w-2.5 shrink-0"
                    />
                    {part.title}
                  </li>
                ))}
              </ul>

              {/* The two product marks sit against the title that names them.
                  Decorative to a screen reader — the title already says it. */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold">
                  Ultra Seam and Ultra Edge
                </h3>
                <div aria-hidden className="flex shrink-0 items-center gap-2.5">
                  {/* h-auto everywhere these badges appear: sizing width
                      alone leaves the attribute height in charge, and the
                      mismatch squashes the circles slightly oval and soft */}
                  <Image
                    src="/images/ultra-seam-badge.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="w-11 h-auto"
                  />
                  <Image
                    src="/images/ultra-edge-badge.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="w-11 h-auto"
                  />
                </div>
              </div>
              <p className="mt-2.5 text-foreground/70 leading-relaxed">
                Ultra Seam welds the vinyl directly to itself, a weld that
                proved stronger than the membrane in independent testing.
                Ultra Edge finishes the perimeter with a screw-free snap fit
                built to hold through hot and cold seasons.
              </p>
              <Link
                href="/vinyl-decking/the-ultra-system"
                className="mt-5 inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                See how the Ultra system works
              </Link>
            </div>
          </div>

          {/* Capped by height as well as width so the render gives way first on
              a short screen — nothing past 100vh survives the pin */}
          <div className="ultra-fade flex items-center justify-center lg:justify-end">
            {/* Shrink-wraps the canvas so the annotations, positioned as
                percentages of this box, land on the render itself */}
            <div className="relative w-full lg:w-auto">
              <canvas
                ref={canvasRef}
                width={1047}
                height={654}
                role="img"
                aria-label="The Ultra system assembling onto a deck edge: substrate, edge trim, and vinyl membrane coming together"
                className="block w-full h-auto lg:w-auto lg:max-w-full lg:max-h-[56svh]"
              />

              {/* The card already lists these parts, so the overlay is
                  decorative to a screen reader. Hidden below lg, where the
                  render is too small for labels to sit clear of the parts. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden lg:block"
              >
                <svg
                  viewBox="0 0 1047 654"
                  className="absolute inset-0 h-full w-full text-foreground/40"
                >
                  {PARTS.map((part, i) => {
                    // Frame 0 placement, so the overlay is right on the very
                    // first paint rather than snapping into position
                    const [ax, ay] = PART_ANCHORS[i][0];
                    const x = ax * 1047;
                    const y = ay * 654;
                    const originX = part.labelAt[0] * 1047;
                    const originY = part.labelAt[1] * 654;
                    return (
                      <g key={part.title}>
                        <polyline
                          ref={(node) => {
                            leaderRefs.current[i] = node;
                          }}
                          points={`${originX},${originY} ${x},${originY} ${x},${y}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          ref={(node) => {
                            dotRefs.current[i] = node;
                          }}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="currentColor"
                        />
                      </g>
                    );
                  })}
                </svg>

                {PARTS.map((part) => (
                  <div
                    key={part.title}
                    style={{
                      left: `${part.labelAt[0] * 100}%`,
                      top: `${part.labelAt[1] * 100}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap bg-background px-2 py-1 text-xs font-bold">
                      <span
                        style={{ backgroundColor: part.swatch }}
                        className="block h-2.5 w-2.5 shrink-0"
                      />
                      {part.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
