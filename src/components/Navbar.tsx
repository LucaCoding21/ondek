"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, CTA_LINKS } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Transparent while the bar sits over a hero. Seeded from the route so the
  // first paint on the homepage isn't a flash of the solid bar.
  const [overHero, setOverHero] = useState(pathname === "/");
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const hasHero = !!document.querySelector("[data-hero]");

    // Clear only at rest at the very top; any scroll commits to the solid bar
    const measure = () => setOverHero(hasHero && window.scrollY <= 12);
    measure();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        // Ignore jitter and rubber-band overscroll
        if (Math.abs(delta) > 6 && y >= 0) {
          // Always visible near the top of the page
          setHidden(delta > 0 && y > 96);
          lastY.current = y;
        }

        measure();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Never hide the bar while the mobile menu is open
  const isHidden = hidden && !mobileOpen;
  // The open mobile panel is a solid sheet, so the bar has to match it
  const clear = overHero && !mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-[calc(var(--gutter)*2)] pt-[calc(var(--gutter)*2)] transition-transform duration-300 will-change-transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`border transition-colors duration-300 ${
          clear
            ? "bg-transparent border-transparent"
            : "bg-white/85 backdrop-blur-xl border-black/5"
        }`}
      >
        <div className="flex h-[var(--nav-bar-h)] items-center justify-between xl:grid xl:grid-cols-[1fr_auto_1fr] pl-5 pr-5 sm:pl-7 lg:pl-8">
          {/* Logo — both marks stacked so the swap never waits on a fetch */}
          <Link href="/" className="relative shrink-0 xl:justify-self-start">
            <Image
              src="/images/ondek-logo-black.svg"
              alt="OnDek"
              width={214}
              height={100}
              priority
              className={`h-8 w-auto transition-opacity duration-300 ${clear ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/images/ondek-logo-white.svg"
              alt=""
              aria-hidden
              width={214}
              height={100}
              priority
              className={`absolute inset-0 h-8 w-auto transition-opacity duration-300 ${clear ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:justify-self-center">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.children ? item.children[0].href : item.href}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors ${
                    clear
                      ? "text-white/85 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      className="size-3 mt-0.5 opacity-50 transition-transform group-hover:rotate-180"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 4.5L6 8l3.5-3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Link>
                {item.children && (
                  <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150">
                    <div className="min-w-60 bg-white border border-black/5 py-2.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2.5 text-[14px] font-semibold text-foreground/70 hover:text-foreground hover:bg-surface border-l-2 border-transparent hover:border-cta transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right cluster — one grid cell so the nav can center against it */}
          <div className="flex items-center gap-2 xl:justify-self-end">
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href={CTA_LINKS.designKit.href}
                className={`flex h-10 items-center px-3.5 xl:px-4 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors ${
                  clear
                    ? "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                    : "text-foreground/80 hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                {CTA_LINKS.designKit.label}
              </Link>
              <Link
                href={CTA_LINKS.quote.href}
                className="flex h-10 items-center px-3.5 xl:px-4 text-[13px] font-bold uppercase tracking-[0.06em] bg-cta text-foreground hover:brightness-95 transition-[filter]"
              >
                {CTA_LINKS.quote.label}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden -mr-2 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 transition-all ${clear ? "bg-white" : "bg-foreground"} ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
                />
                <span
                  className={`block h-0.5 w-6 transition-all ${clear ? "bg-white" : "bg-foreground"} ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 w-6 transition-all ${clear ? "bg-white" : "bg-foreground"} ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — a solid sheet below the bar */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 bg-white border border-black/5 max-h-[calc(100dvh-var(--nav-bar-h)-var(--gutter)*4)] overflow-y-auto">
          <div className="px-5 py-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <div className="pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-foreground/40">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 font-semibold text-foreground/80"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-foreground/80"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-4 pb-2">
              <Link
                href={CTA_LINKS.designKit.href}
                onClick={() => setMobileOpen(false)}
                className="flex-1 px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.06em] bg-surface"
              >
                {CTA_LINKS.designKit.label}
              </Link>
              <Link
                href={CTA_LINKS.quote.href}
                onClick={() => setMobileOpen(false)}
                className="flex-1 px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.06em] bg-cta"
              >
                {CTA_LINKS.quote.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
