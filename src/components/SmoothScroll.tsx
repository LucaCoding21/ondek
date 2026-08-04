"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide Lenis smooth scrolling, driven by GSAP's ticker so Lenis and
 * every ScrollTrigger animation read the same clock each frame — a separate
 * requestAnimationFrame loop would leave the scrubbed sections a frame
 * behind the scroll position.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Same opt-out policy as the global reduced-motion CSS: no inertia at
    // all, native scrolling untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ anchors: true });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      // gsap.ticker reports seconds, lenis.raf expects milliseconds
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    // Lag smoothing would pause GSAP's clock after a long frame while the
    // real scroll position kept moving, visibly desyncing the scrubs.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Lenis holds its own scroll position across route changes, overriding
    // Next's scroll-to-top, so new pages opened mid-scroll stayed mid-scroll.
    // Only reset on an actual navigation, never on the initial load, so
    // reload restoration and #hash landings keep their position.
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
