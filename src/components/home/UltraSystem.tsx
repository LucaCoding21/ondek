"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 96;
const frameSrc = (i: number) =>
  `/images/ultra-exploded/frame-${String(i + 1).padStart(3, "0")}.jpg`;

export default function UltraSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.width = 960;
      canvas.height = 540;

      const images: HTMLImageElement[] = [];
      const playhead = { frame: 0 };

      const render = () => {
        const img = images[Math.round(playhead.frame)];
        if (img?.complete && img.naturalWidth) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        if (i === 0) img.onload = render;
        images.push(img);
      }

      const mm = gsap.matchMedia();

      // Reduced motion: skip the scrub, show the assembled system
      mm.add("(prefers-reduced-motion: reduce)", () => {
        playhead.frame = FRAME_COUNT - 1;
        const last = images[FRAME_COUNT - 1];
        if (last.complete) render();
        else last.onload = render;
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

          // fromTo (not from): matchMedia tweens escape useGSAP's auto-revert,
          // so a StrictMode remount must not capture mid-tween values as targets
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
                  // Scroll-locked: pin the section and scrub through the frames
                  trigger: sectionRef.current,
                  start: "top top",
                  end: "+=160%",
                  pin: true,
                  scrub: 0.5,
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

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid w-full items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <h2 className="ultra-fade text-4xl sm:text-5xl font-bold leading-tight">
              More than a membrane. A complete{" "}
              <span className="bg-cta box-decoration-clone px-1.5">
                waterproofing system.
              </span>
            </h2>

          </div>

          <div className="ultra-fade relative lg:ml-16 lg:-mr-16 lg:mt-40">
            <span
              aria-hidden
              className="absolute -top-2.5 -left-2.5 h-5 w-5 border-t-2 border-l-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -top-2.5 -right-2.5 h-5 w-5 border-t-2 border-r-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-2 border-l-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-2 border-r-2 border-foreground/30"
            />
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Exploded view of the Ultra waterproofing system assembling layer by layer"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 lg:pb-36 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="relative mt-4 lg:mt-8">
          {/* registration corners, echoing a technical drawing */}
          <span
            aria-hidden
            className="absolute -top-2.5 -left-2.5 h-5 w-5 border-t-2 border-l-2 border-foreground/30"
          />
          <span
            aria-hidden
            className="absolute -top-2.5 -right-2.5 h-5 w-5 border-t-2 border-r-2 border-foreground/30"
          />
          <span
            aria-hidden
            className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-2 border-l-2 border-foreground/30"
          />
          <span
            aria-hidden
            className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-2 border-r-2 border-foreground/30"
          />

          <div className="ultra-fade bg-surface p-6 sm:p-8">
            <h3 className="text-xl font-bold">Engineered and warrantied as one</h3>
            <p className="mt-3 text-foreground/70 leading-relaxed">
              Multi-layer vinyl membrane, heat-welded seams, and
              system-matched adhesive — designed together to form one
              continuous waterproof surface that stands up to sun, rain,
              and heavy foot traffic year-round.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
