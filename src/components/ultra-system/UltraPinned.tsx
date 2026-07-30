"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 96;
const frameSrc = (i: number) =>
  `/images/ultra-exploded/frame-${String(i + 1).padStart(3, "0")}.jpg`;

const LEFT_LABELS = [
  {
    title: "Textured wear layer",
    text: "Slip-resistant surface that stands up to sun, rain, and heavy foot traffic.",
  },
  {
    title: "Printed colour layer",
    text: "UV-stable inks sealed deep in the vinyl, not painted on top.",
  },
];

const RIGHT_LABELS = [
  {
    title: "Waterproof core",
    text: "Multi-layer membrane with heat-welded seams forming one continuous surface.",
  },
  {
    title: "System-matched adhesive",
    text: "Bonds the membrane to the deck so everything performs as a single system.",
  },
];

function LayerLabel({ title, text }: { title: string; text: string }) {
  return (
    <div className="ultra-fade">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-1.5 text-xs text-foreground/60 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

export default function UltraPinned() {
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
    <section ref={sectionRef} className="bg-surface overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,3fr)] lg:gap-12">
          {/* Left annotations */}
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-8 lg:grid-cols-1 lg:gap-16">
            {LEFT_LABELS.map((label) => (
              <LayerLabel key={label.title} {...label} />
            ))}
          </div>

          {/* The exploded system, scrubbed frame by frame on scroll */}
          <div className="ultra-fade order-1 lg:order-2">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Exploded view of the Ultra waterproofing system assembling layer by layer"
              className="w-full h-auto"
            />
          </div>

          {/* Right annotations */}
          <div className="order-3 grid grid-cols-2 gap-8 lg:grid-cols-1 lg:gap-16">
            {RIGHT_LABELS.map((label) => (
              <LayerLabel key={label.title} {...label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
