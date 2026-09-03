"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    /** Set by SmoothScroll so overlays can freeze the page behind them */
    __lenis?: { stop: () => void; start: () => void };
  }
}

/**
 * Freezes page scroll while an overlay is open: stops Lenis (which would
 * otherwise keep smooth-scrolling the page under the modal) and locks
 * native overflow as the fallback for reduced-motion visitors, where
 * Lenis never starts.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    window.__lenis?.stop();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
      window.__lenis?.start();
    };
  }, [locked]);
}
