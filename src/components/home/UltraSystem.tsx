"use client";

import { useRef } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// Two updated install renders were delivered (Ultra Seam / Ultra Edge); the
// section runs one at a time. To preview the other scene, swap the anchors
// import, FRAME_COUNT, frameSrc base, and LEADERS for the alternates below.
import { PART_ANCHORS, PART_APPEARS } from "@/lib/ultraSeamAnchors";
// import { PART_ANCHORS, PART_APPEARS } from "@/lib/ultraEdgeAnchors";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 238; // Ultra Edge scene: 180
const frameSrc = (i: number) =>
  `/images/ultra-seam/frame_${String(i + 1).padStart(4, "0")}.webp`;
// `/images/ultra-edge/frame_${String(i + 1).padStart(4, "0")}.webp`;

// Annotations fade in/out over this many frames of the scrub
const LABEL_FADE = 6;
// Brand gold — the chip flashes it while its part flashes in the render
const GOLD = "#f4ce47";

type Stage = {
  /** Index into PART_ANCHORS for the leader's endpoint during this stage */
  part: number;
  title: string;
  sub: string;
  /** Frame the stage takes over (0-based); defaults to the part's appear */
  at?: number;
  /** Frame the stage hides (0-based) — the flashing buried under the vinyl */
  until?: number;
  /** Frame window (0-based, inclusive) where the chip goes gold */
  gold?: readonly [number, number];
};

type Leader = {
  /** Chip centre as fractions of the canvas, before `shift` */
  home: readonly [number, number];
  /** Extra centre offset in chip widths/heights — hangs the chip off home */
  shift?: readonly [number, number];
  icon?: string;
  /** The product chips run larger than plain part labels */
  big?: boolean;
  stages: Stage[];
};

/** The leader-line tags over the render — chip copy, icons, stage hand-offs
 *  and gold flash windows all come from the config the animation was
 *  delivered with (frame numbers converted to 0-based). Each leader is one
 *  chip at a fixed home; its stages decide which part the line tracks and
 *  what the chip says — the Edge chip starts as Ultra Flashing, hides while
 *  the vinyl buries it, returns as Ultra Clip and re-badges as Ultra Edge
 *  when the clip flashes. */
const LEADERS: Leader[] = [
  {
    home: [0.74, 0.1],
    icon: "/images/ultra-seam/icons/ultra-seam-badge.svg",
    big: true,
    stages: [
      {
        part: 1,
        title: "Ultra Seam",
        sub: "clean selvage edge · welded vinyl to vinyl",
        gold: [176, 185],
      },
    ],
  },
  {
    home: [0.13, 0.74],
    shift: [-0.5, 0],
    icon: "/images/ultra-seam/icons/ultra-edge-badge.svg",
    big: true,
    stages: [
      {
        part: 0,
        title: "Ultra Flashing",
        sub: "mechanically fastened",
        gold: [73, 82],
        until: 163,
      },
      { part: 2, title: "Ultra Clip", sub: "screw-free snap fit" },
      {
        part: 2,
        at: 215,
        title: "Ultra Edge",
        sub: "Ultra Flashing together with Ultra Clip",
        gold: [215, 224],
      },
    ],
  },
];
/* Ultra Edge scene alternates:
const LEADERS: Leader[] = [
  { home: [0.72, 0.1], stages: [
      { part: 1, title: "ONDEK membrane", sub: "fully adhered" } ] },
  { home: [0.13, 0.74], shift: [-0.5, 0], big: true,
    icon: "/images/ultra-edge/icons/ultra-edge-badge.svg",
    stages: [
      { part: 0, title: "Ultra Flashing", sub: "mechanically fastened",
        gold: [73, 82], until: 125 },
      { part: 2, title: "Ultra Clip", sub: "screw-free snap fit" },
      { part: 2, at: 157, title: "Ultra Edge",
        sub: "Ultra Flashing together with Ultra Clip", gold: [157, 166] },
    ] },
]; */

/** The two products the section is about, as they head the card. */
const CARD_MARKS = [
  { title: "Ultra Seam", icon: "/images/ultra-seam-badge.svg" },
  { title: "Ultra Edge", icon: "/images/ultra-edge-badge.svg" },
] as const;

/** The parts underneath, one row each. Flashing and clip carry the Ultra Edge
 *  mark because together they are Ultra Edge — not a stand-in for a missing
 *  asset. Card copy only; the render's chips read from LEADERS. */
const CARD_FEATURES = [
  {
    icon: "/images/ultra-edge-badge.svg",
    title: "Ultra Flashing",
    blurb:
      "Mechanically fastened around the deck perimeter, giving the clip a solid anchor to snap onto.",
  },
  {
    icon: "/images/ultra-seam-badge.svg",
    title: "Ultra Seam",
    blurb:
      "A clean selvage edge welds vinyl straight to vinyl, a bond that outlasted the membrane in testing.",
  },
  {
    icon: "/images/ultra-edge-badge.svg",
    title: "Ultra Clip",
    blurb:
      "Snaps onto the flashing with no fasteners through the finish, and holds through hot and cold seasons.",
  },
] as const;

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
  const titleRefs = useRef<(HTMLElement | null)[]>([]);
  const subRefs = useRef<(HTMLElement | null)[]>([]);
  // The stage each chip currently shows, so the DOM copy is only swapped
  // when the stage actually flips (the clip re-badging as Ultra Edge)
  const stageIdxRef = useRef<number[]>([]);

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

      // Only the leader moves — the chips are static, so the words stay put
      // and the line tracks the part on the same interpolated playhead as the
      // frames, keeping line and part together mid-blend
      const startOf = (st: Stage) =>
        Math.max(st.at ?? 0, PART_APPEARS[st.part]);
      const endOf = (st: Stage) => st.until ?? Infinity;
      const moveAnnotations = (index: number, next: number, blend: number) => {
        const exact = index + blend;
        LEADERS.forEach((leader, li) => {
          // Delivered stage logic: the last stage that has started and not
          // ended owns the chip; none active hides it. A stage starts at its
          // own `at` or its part's appear, and only while the part is on the
          // canvas.
          let active = -1;
          leader.stages.forEach((st, si) => {
            const track = PART_ANCHORS[st.part];
            const [nx, ny] = track[Math.min(index, track.length - 1)];
            const onscreen = nx > -0.02 && nx < 1.02 && ny > -0.02 && ny < 1.02;
            const started =
              exact >= (st.at ?? 0) &&
              exact >= PART_APPEARS[st.part] &&
              onscreen;
            if (started && exact < endOf(st)) active = si;
          });

          const groupStyle = groupRefs.current[li]?.style;
          const labelStyle = labelRefs.current[li]?.style;
          if (active < 0) {
            if (groupStyle) groupStyle.opacity = "0";
            if (labelStyle) labelStyle.opacity = "0";
            return;
          }
          const st = leader.stages[active];

          // The chip fades with its whole visible run, not each stage — the
          // clip re-badging as Ultra Edge must not blink out over the swap.
          // Grow the active stage's window across any stages that touch it.
          let ws = startOf(st);
          let we = endOf(st);
          for (let grew = true; grew; ) {
            grew = false;
            for (const other of leader.stages) {
              const s = startOf(other);
              const e = endOf(other);
              if (s < ws && e >= ws) { ws = s; grew = true; }
              if (s <= we && e > we) { we = e; grew = true; }
            }
          }
          const fadeIn = gsap.utils.clamp(0, 1, (exact - ws) / LABEL_FADE);
          const fadeOut =
            we === Infinity
              ? 1
              : gsap.utils.clamp(0, 1, (we - exact) / LABEL_FADE);
          const alpha = String(Math.min(fadeIn, fadeOut));
          if (groupStyle) groupStyle.opacity = alpha;
          if (labelStyle) labelStyle.opacity = alpha;

          // Swap the chip copy only on the flip, not every tick
          if (stageIdxRef.current[li] !== active) {
            stageIdxRef.current[li] = active;
            const titleEl = titleRefs.current[li];
            if (titleEl) titleEl.textContent = st.title;
            const subEl = subRefs.current[li];
            if (subEl) subEl.textContent = st.sub;
          }

          // Chip goes brand gold while its part flashes in the render
          const chip = chipRefs.current[li];
          if (chip) {
            chip.style.background =
              st.gold && exact >= st.gold[0] && exact <= st.gold[1]
                ? GOLD
                : "#fff";
          }

          const track = PART_ANCHORS[st.part];
          const from = track[Math.min(index, track.length - 1)];
          const to = track[Math.min(next, track.length - 1)];
          // Canvas units, so the geometry scales with the render
          const x = (from[0] + (to[0] - from[0]) * blend) * canvas.width;
          const y = (from[1] + (to[1] - from[1]) * blend) * canvas.height;
          let originX = leader.home[0] * canvas.width;
          let originY = leader.home[1] * canvas.height;

          // Straight leader from the chip's edge onto the part — the chip is
          // measured in CSS pixels, the line lives in canvas units
          let ex = originX;
          let ey = originY;
          const label = labelRefs.current[li];
          if (label && canvas.clientWidth > 0) {
            const scale = canvas.width / canvas.clientWidth;
            const w = label.offsetWidth * scale;
            const h = label.offsetHeight * scale;
            if (leader.shift) {
              originX += leader.shift[0] * w;
              originY += leader.shift[1] * h;
            }
            [ex, ey] = chipEdge(x, y, originX, originY, w, h, 6 * scale);
          }
          leaderRefs.current[li]?.setAttribute(
            "points",
            `${ex},${ey} ${x},${y}`
          );
          dotRefs.current[li]?.setAttribute("cx", String(x));
          dotRefs.current[li]?.setAttribute("cy", String(y));
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
          // then a quarter-screen hold. The opening runs about twice as hot
          // as the rest — hesitant scrollers see the flashing land and flash
          // gold on the first nudge instead of a barely-moving render. The
          // segment break sits in the still hold after the flash, where the
          // speed change can't be seen; scrub smoothing rounds off the kink.
          tl.to(playhead, {
            frame: 89,
            ease: "none",
            onUpdate: render,
            duration: 0.3,
          });
          tl.to(playhead, {
            frame: FRAME_COUNT - 1,
            ease: "none",
            onUpdate: render,
            duration: 0.95,
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
      <div className="mx-auto flex w-full max-w-[100rem] flex-col justify-center px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:min-h-screen lg:pt-12 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-14">
          {/* Headline pinned to the top, card pushed to the bottom — the gap
              between them is what gives the column its shape, so it is the
              justify-between doing the work rather than a fixed margin. */}
          <div className="flex flex-col justify-between gap-10">
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
              {/* The two products head the card, mark against name, over the
                  rule that separates them from the parts they are made of */}
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-foreground/25 pb-5">
                {CARD_MARKS.map((mark) => (
                  <h3
                    key={mark.title}
                    className="flex items-center gap-3 text-lg font-bold"
                  >
                    {/* h-auto everywhere these badges appear: sizing width
                        alone leaves the attribute height in charge, and the
                        mismatch squashes the circles slightly oval and soft */}
                    <Image
                      src={mark.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="w-12 h-auto"
                    />
                    {mark.title}
                  </h3>
                ))}
              </div>

              <ul className="mt-5 space-y-4">
                {CARD_FEATURES.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-3.5">
                    <Image
                      src={feature.icon}
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden
                      className="mt-0.5 w-10 h-auto shrink-0"
                    />
                    <div>
                      <b className="block text-[15px] font-bold">
                        {feature.title}
                      </b>
                      <p className="mt-1 text-[13px] leading-snug text-foreground/65">
                        {feature.blurb}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/vinyl-decking/the-ultra-system"
                className="mt-6 inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                See how the Ultra system works
              </Link>
            </div>
          </div>

          {/* Capped by height as well as width so the render gives way first on
              a short screen — nothing past 100vh survives the pin */}
          {/* The Edge tag hangs off the render's left edge (the clip flies
              through the space to its right, so it can't sit over the
              canvas). The left padding reserves that hang room so the tag
              never reaches the card; the negative margin bleeds the render
              right into the page padding to give some of that width back. */}
          <div className="ultra-fade flex items-center justify-center lg:justify-end lg:pl-24 xl:-mr-10">
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
                  className="absolute inset-0 h-full w-full"
                >
                  {LEADERS.map((leader, i) => {
                    // Frame 0 placement, so the overlay is right on the very
                    // first paint rather than snapping into position
                    const [ax, ay] = PART_ANCHORS[leader.stages[0].part][0];
                    const x = ax * 1600;
                    const y = ay * 1000;
                    const originX = leader.home[0] * 1600;
                    const originY = leader.home[1] * 1000;
                    return (
                      <g
                        key={i}
                        ref={(node) => {
                          groupRefs.current[i] = node;
                        }}
                        style={{ opacity: 0 }}
                      >
                        {/* 2px ink leader and 3.5px dot at the render's
                            typical on-screen size — the units are canvas
                            space, drawn at roughly half scale */}
                        <polyline
                          ref={(node) => {
                            leaderRefs.current[i] = node;
                          }}
                          points={`${originX},${originY} ${x},${y}`}
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <circle
                          ref={(node) => {
                            dotRefs.current[i] = node;
                          }}
                          cx={x}
                          cy={y}
                          r="7"
                          fill="#1a1a1a"
                        />
                      </g>
                    );
                  })}
                </svg>

                {LEADERS.map((leader, i) => {
                  const first = leader.stages[0];
                  const [sx, sy] = leader.shift ?? [0, 0];
                  return (
                    <div
                      key={i}
                      ref={(node) => {
                        labelRefs.current[i] = node;
                      }}
                      style={{
                        left: `${leader.home[0] * 100}%`,
                        top: `${leader.home[1] * 100}%`,
                        opacity: 0,
                        // `shift` hangs the chip off its home in chip widths
                        transform: `translate(${-50 + sx * 100}%, ${
                          -50 + sy * 100
                        }%)`,
                        // The chip is sized in em so the delivered
                        // proportions hold; the clamp tracks the render,
                        // which runs ~60% of the viewport here
                        fontSize: leader.big
                          ? "clamp(12px, 1.1vw, 15px)"
                          : "clamp(10px, 0.85vw, 12px)",
                      }}
                      className="absolute"
                    >
                      {/* Chip styled after the delivered demo: white card
                          with a 1.5px ink stroke, product badge at 2x above
                          the bold name over a quiet spec line, left-aligned.
                          The background is driven imperatively (gold flash)
                          in moveAnnotations, so it lives in style, not a
                          class. */}
                      <span
                        ref={(node) => {
                          chipRefs.current[i] = node;
                        }}
                        style={{ background: "#fff" }}
                        className="flex flex-col items-start gap-[0.4em] whitespace-nowrap rounded border-[1.5px] border-[#1a1a1a] pb-[0.5em] pl-[0.6em] pr-[0.8em] pt-[0.5em] text-[#1a1a1a] transition-colors duration-[250ms]"
                      >
                        {leader.icon && (
                          /* Plain img: inside a canvas overlay, no sizing
                             pipeline needed for a small SVG badge */
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={leader.icon}
                            alt=""
                            className="h-[5.2em] w-[5.2em] shrink-0"
                          />
                        )}
                        <span>
                          <b
                            ref={(node) => {
                              titleRefs.current[i] = node;
                            }}
                            className="block font-bold leading-[1.15] tracking-[0.02em]"
                          >
                            {first.title}
                          </b>
                          <small
                            ref={(node) => {
                              subRefs.current[i] = node;
                            }}
                            className="block text-[0.82em] font-normal leading-[1.2] opacity-65"
                          >
                            {first.sub}
                          </small>
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
