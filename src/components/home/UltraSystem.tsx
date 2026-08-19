"use client";

import { useRef } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// Two updated install renders were delivered (Ultra Seam / Ultra Edge); the
// section runs one at a time. To preview the other scene, swap the anchors
// import, FRAME_COUNT, frameSrc base, and PARTS for the alternates below.
import {
  PART_ANCHORS,
  PART_APPEARS,
  PART_HIDES,
} from "@/lib/ultraSeamAnchors";
// import { PART_ANCHORS, PART_APPEARS, PART_HIDES } from "@/lib/ultraEdgeAnchors";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 238; // Ultra Edge scene: 180
const frameSrc = (i: number) =>
  `/images/ultra-seam/frame_${String(i + 1).padStart(4, "0")}.webp`;
// `/images/ultra-edge/frame_${String(i + 1).padStart(4, "0")}.webp`;

// Annotations fade in/out over this many frames of the scrub
const LABEL_FADE = 6;
// Brand gold — the chip flashes it while its part flashes in the render
const GOLD = "#f4ce47";

type PartLabel = {
  swatch: string;
  title: string;
  sub: string;
  labelAt: readonly [number, number];
  icon?: string;
  /** Frame window (0-based, inclusive) where the chip goes gold. */
  flash?: readonly [number, number];
  /** The clip chip re-badges as the combined product when it flashes. */
  becomes?: { title: string; sub: string; icon: string; at: number };
};

/** The labelled parts in the render — chip copy, icons, flash windows and the
 *  clip's re-badge all come from the config the animation was delivered with.
 *  `labelAt` is a fixed spot on the canvas — the words stay put and only the
 *  leader tracks the part; the spots are the delivered label homes, clear of
 *  the action for the stretch each label is visible (see PART_APPEARS /
 *  PART_HIDES). `swatch` is sampled from the frames for the card's key. */
const PARTS: PartLabel[] = [
  {
    swatch: "#5f5f64",
    title: "Ultra Flashing",
    sub: "mechanically fastened",
    labelAt: [0.1, 0.64],
    flash: [73, 82],
  },
  {
    swatch: "#c4bdb1",
    title: "Ultra Seam",
    sub: "clean selvage edge · welded vinyl to vinyl",
    labelAt: [0.74, 0.1],
    icon: "/images/ultra-seam/icons/ultra-seam-badge.svg",
    flash: [176, 185],
  },
  {
    swatch: "#88888a",
    title: "Ultra Clip",
    sub: "screw-free snap fit",
    labelAt: [0.13, 0.86],
    flash: [215, 224],
    becomes: {
      title: "Ultra Edge",
      sub: "Ultra Flashing together with Ultra Clip",
      icon: "/images/ultra-seam/icons/ultra-edge-badge.svg",
      at: 215,
    },
  },
];
/* Ultra Edge scene alternates:
const PARTS: PartLabel[] = [
  { swatch: "#5a595e", title: "Ultra Flashing", sub: "mechanically fastened",
    labelAt: [0.1, 0.62], flash: [73, 82] },
  { swatch: "#d4cbbd", title: "ONDEK membrane", sub: "fully adhered",
    labelAt: [0.72, 0.1] },
  { swatch: "#888789", title: "Ultra Clip", sub: "screw-free snap fit",
    labelAt: [0.13, 0.86], flash: [157, 166],
    becomes: { title: "Ultra Edge", sub: "Ultra Flashing together with Ultra Clip",
      icon: "/images/ultra-edge/icons/ultra-edge-badge.svg", at: 157 } },
]; */

/** Point where the anchor→chip-centre ray meets the chip's (padded)
 *  rectangle, so the leader stops at the chip edge instead of running
 *  underneath the label. All in canvas units. */
function chipEdge(
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
  gap = 8
) {
  const dx = cx - ax;
  const dy = cy - ay;
  const hw = w / 2 + gap;
  const hh = h / 2 + gap;
  let t = 0;
  if (Math.abs(dx) > hw) t = Math.max(t, 1 - hw / Math.abs(dx));
  if (Math.abs(dy) > hh) t = Math.max(t, 1 - hh / Math.abs(dy));
  return [ax + dx * t, ay + dy * t] as const;
}

export default function UltraSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leaderRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleRefs = useRef<(HTMLElement | null)[]>([]);
  const subRefs = useRef<(HTMLElement | null)[]>([]);
  // Whether each chip has re-badged (the clip → Ultra Edge), so the DOM is
  // only touched when the state actually flips
  const becameRef = useRef<boolean[]>([]);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      // Bitmap size comes from the width/height attributes in the markup —
      // the layout derives the drawn width from them, so they can't wait for JS

      // Plain <img> elements, decoded lazily by the browser: at 238 frames,
      // decoding everything up front (the old ImageBitmap approach at 40
      // frames) would pin over a gigabyte of bitmaps. The read-ahead in
      // render() keeps the frames near the playhead decoded, and this dense
      // a sequence needs no cross-fade — the nearest frame is smooth enough.
      const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
      const playhead = { frame: 0 };
      let cancelled = false;

      const loadFrame = (i: number) => {
        let img = images[i];
        if (!img) {
          // window.Image — the bare name is the SiteImage component up top
          img = new window.Image();
          img.decoding = "async";
          img.src = frameSrc(i);
          images[i] = img;
        }
        return img;
      };

      // Skips redundant draws: the scrub fires far more often than the picture
      // actually changes, and every skipped tick is a full-canvas blit saved
      let drawn = -1;
      // The frame waiting on its image, so a late arrival only draws if it is
      // still the one wanted — not a stale frame over a newer one
      let pendingDraw = -1;

      const draw = (i: number) => {
        const img = loadFrame(i);
        if (!img.complete || !img.naturalWidth) {
          pendingDraw = i;
          img.onload = () => {
            if (!cancelled && pendingDraw === i) draw(i);
          };
          return;
        }
        pendingDraw = -1;
        drawn = i;
        // Required, not hygiene: these frames carry real transparency, so
        // without a clear the previous frame shows through every gap
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      const render = () => {
        const exact = playhead.frame;
        const index = Math.floor(exact);
        const next = Math.min(index + 1, FRAME_COUNT - 1);
        // Leaders track the fractional playhead even when the drawn frame
        // holds still, so they never visibly step
        moveAnnotations(index, next, exact - index);

        const want = Math.round(exact);
        if (want !== drawn) draw(want);
        // Read-ahead both ways so a fast scrub lands on frames already
        // requested rather than a burst of misses
        for (let d = 1; d <= 4; d++) {
          if (want + d < FRAME_COUNT) loadFrame(want + d);
          if (want - d >= 0) loadFrame(want - d);
        }
      };

      // Only the leader moves — the labels are static, so the words stay put
      // and the elbow tracks the part on the same interpolated playhead as the
      // frames, keeping line and part together mid-blend
      const moveAnnotations = (index: number, next: number, blend: number) => {
        const exact = index + blend;
        PART_ANCHORS.forEach((track, part) => {
          const cfg = PARTS[part];
          // The parts fly in mid-sequence; each annotation fades in with its
          // part instead of pointing at empty canvas, and back out once the
          // part is buried under later ones (the flashing, see PART_HIDES)
          const fadeIn = gsap.utils.clamp(
            0,
            1,
            (exact - PART_APPEARS[part] + LABEL_FADE) / LABEL_FADE
          );
          const hideAt = PART_HIDES[part];
          const fadeOut =
            hideAt === null
              ? 1
              : gsap.utils.clamp(0, 1, (hideAt - exact) / LABEL_FADE + 1);
          const alpha = Math.min(fadeIn, fadeOut);
          const groupStyle = groupRefs.current[part]?.style;
          if (groupStyle) groupStyle.opacity = String(alpha);
          const labelStyle = labelRefs.current[part]?.style;
          if (labelStyle) labelStyle.opacity = String(alpha);

          // The clip chip re-badges as the combined product when it flashes;
          // swap the copy only on the flip, not every tick
          const became = !!cfg.becomes && exact >= cfg.becomes.at;
          if (became !== !!becameRef.current[part]) {
            becameRef.current[part] = became;
            const face = became && cfg.becomes ? cfg.becomes : cfg;
            const titleEl = titleRefs.current[part];
            if (titleEl) titleEl.textContent = face.title;
            const subEl = subRefs.current[part];
            if (subEl) subEl.textContent = face.sub;
            const iconEl = iconRefs.current[part];
            if (iconEl) {
              if (face.icon) {
                iconEl.src = face.icon;
                iconEl.style.display = "";
              } else {
                iconEl.style.display = "none";
              }
            }
          }

          // Chip goes brand gold while its part flashes in the render
          const chip = chipRefs.current[part];
          if (chip) {
            chip.style.background =
              cfg.flash && exact >= cfg.flash[0] && exact <= cfg.flash[1]
                ? GOLD
                : "#fff";
          }

          const from = track[index];
          const to = track[next];
          // Canvas units, so the stroke scales with the render
          const x = (from[0] + (to[0] - from[0]) * blend) * canvas.width;
          const y = (from[1] + (to[1] - from[1]) * blend) * canvas.height;
          const [labelX, labelY] = cfg.labelAt;
          const originX = labelX * canvas.width;
          const originY = labelY * canvas.height;

          // Straight leader from the chip's edge onto the part — the chip is
          // measured in CSS pixels, the line lives in canvas units
          let ex = originX;
          let ey = originY;
          const label = labelRefs.current[part];
          if (label && canvas.clientWidth > 0) {
            const scale = canvas.width / canvas.clientWidth;
            [ex, ey] = chipEdge(
              x,
              y,
              originX,
              originY,
              label.offsetWidth * scale,
              label.offsetHeight * scale
            );
          }
          leaderRefs.current[part]?.setAttribute(
            "points",
            `${ex},${ey} ${x},${y}`
          );
          dotRefs.current[part]?.setAttribute("cx", String(x));
          dotRefs.current[part]?.setAttribute("cy", String(y));
        });
      };

      // The first frame right away so the canvas is never empty, the rest once
      // the section is within a screen of view — coarse-to-fine, so a scrub
      // that starts before the fetch finishes lands near a loaded frame
      // instead of at the far end of a sequential queue.
      draw(0);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom+=100%",
        once: true,
        onEnter: () => {
          for (let step = 32; step >= 1; step >>= 1)
            for (let i = 0; i < FRAME_COUNT; i += step) loadFrame(i);
        },
      });

      const mm = gsap.matchMedia();

      // Reduced motion: skip the scrub, show the assembled system
      mm.add("(prefers-reduced-motion: reduce)", () => {
        playhead.frame = FRAME_COUNT - 1;
        // draw() waits on the image itself if it has not arrived yet
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

          const tl = gsap.timeline({
            scrollTrigger: desktop
              ? {
                  // Scroll-locked: pin the section and scrub through the
                  // frames. The animation spans 1.25 screens of scroll; the
                  // last quarter-screen is the hold below.
                  trigger: sectionRef.current,
                  start: "top top",
                  end: "+=150%",
                  pin: true,
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
          // Durations are relative scroll shares: 1.25 screens of animation,
          // then a quarter-screen hold
          tl.to(playhead, {
            frame: FRAME_COUNT - 1,
            ease: "none",
            onUpdate: render,
            duration: 1.25,
          });
          // Rest on the finished assembly before the pin releases — also lets
          // the scrub's smoothing catch up so the last frames aren't cut off
          if (desktop) tl.to({}, { duration: 0.25 });
        }
      );

      return () => {
        mm.revert();
        cancelled = true;
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
                width={1600}
                height={1000}
                role="img"
                aria-label="The Ultra system assembling onto a deck edge: flashing, welded seam, and clip coming together"
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
                  viewBox="0 0 1600 1000"
                  className="absolute inset-0 h-full w-full text-foreground/70"
                >
                  {PARTS.map((part, i) => {
                    // Frame 0 placement, so the overlay is right on the very
                    // first paint rather than snapping into position
                    const [ax, ay] = PART_ANCHORS[i][0];
                    const x = ax * 1600;
                    const y = ay * 1000;
                    const originX = part.labelAt[0] * 1600;
                    const originY = part.labelAt[1] * 1000;
                    return (
                      <g
                        key={part.title}
                        ref={(node) => {
                          groupRefs.current[i] = node;
                        }}
                        style={{ opacity: PART_APPEARS[i] === 0 ? 1 : 0 }}
                      >
                        <polyline
                          ref={(node) => {
                            leaderRefs.current[i] = node;
                          }}
                          points={`${originX},${originY} ${x},${y}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
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

                {PARTS.map((part, i) => (
                  <div
                    key={part.title}
                    ref={(node) => {
                      labelRefs.current[i] = node;
                    }}
                    style={{
                      left: `${part.labelAt[0] * 100}%`,
                      top: `${part.labelAt[1] * 100}%`,
                      opacity: PART_APPEARS[i] === 0 ? 1 : 0,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* Chip styled after the delivered demo: white card,
                        product icon, bold name over a quiet spec line. The
                        background is driven imperatively (gold flash) in
                        moveAnnotations, so it lives in style, not a class. */}
                    <span
                      ref={(node) => {
                        chipRefs.current[i] = node;
                      }}
                      style={{ background: "#fff" }}
                      className="flex items-center gap-2 whitespace-nowrap rounded px-2.5 py-1.5 text-[#1a1a1a] transition-colors duration-[250ms]"
                    >
                      {/* Plain img: src is swapped imperatively on re-badge */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={(node) => {
                          iconRefs.current[i] = node;
                        }}
                        src={part.icon}
                        alt=""
                        style={{ display: part.icon ? undefined : "none" }}
                        className="h-9 w-9 shrink-0"
                      />
                      <span className="leading-tight">
                        <b
                          ref={(node) => {
                            titleRefs.current[i] = node;
                          }}
                          className="block text-[13px] font-bold tracking-[0.02em]"
                        >
                          {part.title}
                        </b>
                        <small
                          ref={(node) => {
                            subRefs.current[i] = node;
                          }}
                          className="block text-[11px] font-normal opacity-65"
                        >
                          {part.sub}
                        </small>
                      </span>
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
