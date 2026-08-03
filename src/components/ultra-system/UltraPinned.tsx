"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

/**
 * The exploded parts. All three share one 1672×941 camera, so stacking them at
 * a fixed vertical pitch is all the explosion takes — the pieces stay in
 * register with each other exactly as they were modelled.
 *
 * Coordinates are percentages of the wrapper, which carries the combined
 * 2142×1941 aspect: `width`/`left` against its width, `top` against its height.
 *
 * `z` is set rather than left to DOM order, which would paint the substrate
 * last and so on top of everything above it — the exact inverse of the stack.
 */
const LEFT = "21.9%";

const STACK = [
  {
    src: "/images/ultra-layers/membrane.webp",
    part: "membrane",
    top: "0%",
    // Moved off the shared edge by the same amount as the underlayment, so
    // the two upper layers stay in step with each other over the substrate
    left: "11.4%",
    z: 30,
  },
  {
    // Versioned filename, not a same-path overwrite — these re-renders differ
    // subtly enough that a stale cache is indistinguishable from a failed swap.
    // Scaled to 72% about the part's own centre and baked back onto the shared
    // 1672×941 frame, so it sits smaller than the layers around it without
    // needing its own offsets here.
    src: "/images/ultra-layers/underlayment-v6.webp",
    part: "underlayment",
    top: "25.8%",
    // The one layer off the shared left edge — nudged out from under the
    // membrane so the shrunk part does not read as centred beneath it
    left: "11.4%",
    z: 20,
  },
  {
    // Scaled to 112% the same way — resized in the asset rather than here, so
    // every layer keeps one shared width and only the artwork differs
    src: "/images/ultra-layers/substrate-v2.webp",
    part: "substrate",
    top: "51.5%",
    left: LEFT,
    z: 10,
  },
];

/** Order the parts arrive in on scroll — not the order they are painted in */
const ARRIVAL = ["membrane", "underlayment", "rod", "substrate"];

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
  const stackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only this branch hides anything. Reduced-motion users never enter it,
      // so they get the whole assembly standing — same for anyone without JS,
      // since nothing in the markup is hidden to begin with.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            // The stack, not the section. The section starts with the title
            // block, so triggering off it began the build while the artwork
            // was still a screen below the fold — by the time it came into
            // view the assembly had already finished.
            trigger: stackRef.current,
            // Holds off until the artwork is properly in frame — at "top 90%"
            // the build ran while the stack was still a sliver above the fold
            // and was over before it was worth looking at. The distance is a
            // slice of the viewport rather than the stack's own height, so the
            // build takes the same amount of scrolling whatever size the
            // artwork renders at, finishing as the stack settles on screen.
            start: "top 70%",
            end: "+=60%",
            scrub: 0.8,
          },
        });

        // fromTo, so the hidden start state is written at creation — before
        // the first paint — rather than after the first scroll tick
        ARRIVAL.forEach((part, i) => {
          tl.fromTo(
            `[data-part="${part}"]`,
            { autoAlpha: 0, yPercent: -6 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
            },
            // Overlapping rather than strictly sequential: a part starts
            // settling while the one before it is still arriving, so the
            // assembly builds continuously instead of ticking part by part
            i * 0.75,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-surface overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-16 lg:py-24">
        <Reveal>
          <p className="text-sm font-bold">The layers</p>
          <div className="mt-5 border-b border-foreground/10" />
          {/* TODO: replace with approved marketing copy */}
          <h2 className="mt-10 text-3xl sm:text-4xl font-bold leading-tight max-w-2xl">
            Pull an Ultra deck apart and every layer is doing one job.
          </h2>
        </Reveal>

        <Reveal stagger=".ultra-fade" className="mt-14 lg:mt-20">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,3fr)] lg:gap-12">
            {/* Left annotations */}
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-8 lg:grid-cols-1 lg:gap-16">
              {LEFT_LABELS.map((label) => (
                <LayerLabel key={label.title} {...label} />
              ))}
            </div>

            {/* The exploded system. The pieces are laid out rather than baked
                into one flat image so each can arrive on its own. */}
            <div className="order-1 lg:order-2">
              {/* One label for the whole illustration — the parts carry
                  empty alts so a screen reader hears a single picture rather
                  than four disconnected fragments of one */}
              <div
                ref={stackRef}
                role="img"
                aria-label="Exploded view of the Ultra system: vinyl membrane, underlayment, deck substrate, and the heat-weld rod that seals the seams"
                className="relative w-full aspect-[2142/1941]"
              >
                {STACK.map((part) => (
                  <Image
                    key={part.src}
                    src={part.src}
                    alt=""
                    data-part={part.part}
                    width={1672}
                    height={941}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="absolute h-auto"
                    style={{
                      width: "78.1%",
                      left: part.left,
                      top: part.top,
                      zIndex: part.z,
                    }}
                  />
                ))}

                {/* Weld rod, off to the left of the stack and running to the
                    deck edge it seals. Sits above the substrate so its tip
                    reads as pointing out towards the viewer where the two
                    just touch. */}
                <Image
                  src="/images/ultra-layers/weld-rod.webp"
                  alt=""
                  data-part="rod"
                  width={1842}
                  height={854}
                  sizes="(min-width: 1024px) 28vw, 56vw"
                  className="absolute h-auto"
                  style={{
                    width: "44.7%",
                    left: "-1.4%",
                    top: "51.5%",
                    zIndex: 15,
                  }}
                />
              </div>
            </div>

            {/* Right annotations */}
            <div className="order-3 grid grid-cols-2 gap-8 lg:grid-cols-1 lg:gap-16">
              {RIGHT_LABELS.map((label) => (
                <LayerLabel key={label.title} {...label} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
