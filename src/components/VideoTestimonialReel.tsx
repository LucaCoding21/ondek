"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface VideoTestimonial {
  name: string;
  role: string;
  video?: string;
  poster?: string;
  objectPosition?: string;
  fitMode?: "cover" | "contain";
}

const PLACEHOLDER_VIDEO = "/videos/testimonials/gabriel-northwest-railing.mp4";
const PLACEHOLDER_POSTER =
  "/videos/testimonials/gabriel-northwest-railing-poster.jpg";

/* PLACEHOLDER ENTRIES — every card plays the same sample clip and no name is
   a real attribution, following the site-wide "Placeholder name" convention.
   Swap in approved videos, posters, names, and roles before launch. */
const DEFAULT_TESTIMONIALS: VideoTestimonial[] = [
  { name: "Placeholder name", role: "Dealer / installer" },
  { name: "Placeholder name", role: "Homeowner" },
  { name: "Placeholder name", role: "Founder of Tuff Deck Lofts and Railings" },
  { name: "Placeholder name", role: "Dealer / installer" },
  { name: "Placeholder name", role: "Homeowner" },
  { name: "Placeholder name", role: "Dealer / installer" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CARD_GAP = 20;

/* Sizes the cards so exactly 4 fill the visible container width */
const CARD_WIDTH =
  "clamp(260px, min(calc((100vw - 108px) / 4), calc((50vw + 612px) / 4), 341px), 341px)";

function TestimonialCard({
  testimonial,
  index,
  active,
  unmuted,
  onToggleMute,
}: {
  testimonial: VideoTestimonial;
  index: number;
  active: boolean;
  unmuted: boolean;
  onToggleMute: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;
    if (visible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, active]);

  // React treats `muted` as a property and skips it during hydration, so the
  // element is driven directly here.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !unmuted;
    if (unmuted) video.play().catch(() => {});
  }, [unmuted]);

  // Lazy: no media URLs at all until the section approaches the viewport
  const src = active ? (testimonial.video ?? PLACEHOLDER_VIDEO) : undefined;
  const poster = active ? (testimonial.poster ?? PLACEHOLDER_POSTER) : undefined;
  const contain = testimonial.fitMode === "contain";

  return (
    <motion.div
      ref={cardRef}
      data-reel-card
      initial={{ opacity: 0, y: 28 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.1 }}
      className="relative flex-shrink-0 snap-start overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
      style={{ width: CARD_WIDTH, aspectRatio: "9 / 13" }}
    >
      {contain && poster && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden="true"
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover"
            style={{ filter: "blur(28px) saturate(1.1)" }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
        </>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full ${
          contain ? "object-contain" : "object-cover"
        }`}
        style={
          contain
            ? undefined
            : { objectPosition: testimonial.objectPosition ?? "center bottom" }
        }
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent"
      />

      <button
        type="button"
        aria-label={unmuted ? "Mute video" : "Unmute video"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleMute();
        }}
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/65"
      >
        {unmuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
          <div className="truncate font-heading text-sm font-bold leading-tight text-ink">
            {testimonial.name}
          </div>
          <div className="truncate font-body text-xs leading-tight text-stone-400">
            {testimonial.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoTestimonialReel({
  heading = "A word from our customers.",
  testimonials = DEFAULT_TESTIMONIALS,
}: {
  heading?: string;
  testimonials?: VideoTestimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const inView = useInView(sectionRef, { once: true, margin: "400px 0px" });

  // Heading rises out of its mask — the site's signature entrance. One mask
  // around the whole heading (it's a prop, so the line count isn't known
  // here); a multi-line heading rises as a unit. The cards keep their own
  // framer entrance: it's tied to `inView`, which also gates when the videos
  // start loading, so it stays untouched.
  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the heading static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".vtr-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".vtr-heading",
            start: "top 78%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // 4px tolerance absorbs sub-pixel rounding of scrollWidth/clientWidth
    setCanScrollLeft(scroller.scrollLeft > 4);
    setCanScrollRight(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateScrollState();
    scroller.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      scroller.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>("[data-reel-card]");
    const cardWidth = card?.offsetWidth ?? 320;
    scroller.scrollBy({
      left: direction * (cardWidth + CARD_GAP),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className="overflow-hidden bg-white pt-20 pb-12 tablet:pt-28 tablet:pb-16 desktop:pt-40 desktop:pb-20"
    >
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3rem)]">
        <div className="mb-12">
          {/* The pb/-mb pair leaves descenders room inside the mask */}
          <h2
            id={headingId}
            className="vtr-heading font-heading text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.08] text-ink"
          >
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="vtr-heading-line block">{heading}</span>
            </span>
          </h2>
        </div>

        {/* Negative right margins let the reel bleed past the container so the
           next card peeks in from the right edge */}
        <div
          ref={scrollerRef}
          className="no-scrollbar -mr-5 snap-x snap-mandatory overflow-x-auto overflow-y-hidden tablet:-mr-12 desktop:-mr-20"
        >
          <div className="flex gap-5 pr-5 tablet:pr-12 desktop:pr-20">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
                active={inView}
                unmuted={unmutedIndex === index}
                onToggleMute={() =>
                  setUnmutedIndex((current) =>
                    current === index ? null : index,
                  )
                }
              />
            ))}
            {/* Chrome/WebKit drop padding-right from scrollWidth on flex
               children inside an overflow scroller — a real spacer scrolls */}
            <div
              aria-hidden="true"
              className="w-5 flex-shrink-0 tablet:w-12 desktop:w-20"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            aria-label="Previous testimonials"
            disabled={!canScrollLeft}
            onClick={() => scrollByCard(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-ink transition-colors enabled:hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            disabled={!canScrollRight}
            onClick={() => scrollByCard(1)}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-ink transition-colors enabled:hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
