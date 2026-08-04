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

  // The full-width photo panel, for the one nav item marked `mega`. The
  // compact dropdowns stay pure CSS; only the mega panel needs state.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const megaItem = NAV_ITEMS.find((item) => item.mega);
  const megaOpen = !!megaItem && openDropdown === megaItem.label;
  // Latch: the panel's card photos only mount after the first open, so the
  // closed (but laid-out, `invisible`) panel never downloads them.
  const megaEverOpened = useRef(false);
  if (megaOpen) megaEverOpened.current = true;

  // Hover-intent: opening waits a beat and is cancelled the moment the
  // cursor moves off the trigger, so an incidental pass-through never opens
  // the panel — only a deliberate hover does.
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelOpen = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };
  const scheduleOpen = (label: string) => {
    cancelOpen();
    openTimer.current = setTimeout(() => setOpenDropdown(label), 110);
  };
  // Moving along the bar to anything that isn't the mega trigger closes the
  // panel — hovering the sheet itself keeps it open, since the sheet carries
  // none of these handlers.
  const closeMega = () => {
    cancelOpen();
    setOpenDropdown(null);
  };
  useEffect(() => cancelOpen, []);

  // Close the panel on route change.
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

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
  // The open mobile panel is a solid sheet, so the bar has to match it — and
  // so is the open mega panel, which hangs off the bar's bottom edge.
  const clear = overHero && !mobileOpen && !megaOpen;

  return (
    <>
      {/* Page scrim: dims the page below the open mega panel so focus stays
          on the photo cards. Sits under the header (z-50), above content. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-40 hidden bg-black/50 transition-opacity duration-300 lg:block ${
          megaOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    <header
      onMouseLeave={() => {
        cancelOpen();
        setOpenDropdown(null);
      }}
      className={`fixed inset-x-0 top-0 z-50 px-[calc(var(--gutter)*5)] pt-[calc(var(--gutter)*2)] transition-transform duration-300 will-change-transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Mega menu — a full-bleed white sheet anchored to the very top of
          the viewport, spanning edge to edge behind the floating bar (the
          bar is `relative` and later in the DOM, so it paints on top). Open,
          the two read as one surface: nav on top, photo cards below. A DOM
          descendant of <header>, so the header's onMouseLeave keeps it open
          while the cursor travels from the trigger into the cards. */}
      {megaItem && (
        <div
          aria-hidden={!megaOpen}
          className={`absolute inset-x-0 top-0 hidden bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-editorial lg:block ${
            megaOpen
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          {/* Spacer matching the bar's footprint (top gutter + bar height)
              so the cards start just under the nav row */}
          <div className="h-[calc(var(--nav-bar-h)+var(--gutter)*2)]" />
          <div className="p-1.5">
            <ul className="grid grid-cols-4 gap-1.5">
              {(megaItem.children ?? []).map((card, i) => (
                <li
                  key={card.href}
                  // Cards cascade in left to right on open, snap out together
                  style={{ transitionDelay: megaOpen ? `${i * 60}ms` : "0ms" }}
                  className={`transition-all duration-500 ease-editorial ${
                    megaOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  }`}
                >
                  <Link
                    href={card.href}
                    onClick={() => setOpenDropdown(null)}
                    className="group/card block overflow-hidden bg-surface"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {megaEverOpened.current && card.image && (
                        <Image
                          src={card.image}
                          alt={card.label}
                          fill
                          sizes="(min-width: 1024px) 25vw, 0px"
                          className="object-cover transition-transform duration-700 ease-editorial group-hover/card:scale-[1.06]"
                        />
                      )}
                      {/* Darkening wash — only fades in on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 transition-opacity duration-300 ease-editorial group-hover/card:opacity-100" />
                      {/* Hover arrow badge: thin white outlined square that
                          fades in and slides up on card hover */}
                      <div className="absolute right-3.5 top-3.5 translate-y-2 border border-white p-1.5 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                          aria-hidden
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </div>
                      {/* Label always shows; the description grows the
                          bottom-anchored block on hover and pushes it up */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-2xl font-bold leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
                          {card.label}
                        </p>
                        {card.desc && (
                          <div className="grid grid-rows-[0fr] transition-all duration-[450ms] ease-editorial group-hover/card:mt-1 group-hover/card:grid-rows-[1fr]">
                            <p className="min-h-0 overflow-hidden text-xs text-white/85 opacity-0 transition-opacity duration-[450ms] ease-editorial group-hover/card:opacity-100">
                              {card.desc}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sits inside the hero's gutter frame, clear of the notched corner.
          No border — the blur and tint carry it, so it reads as a bar rather
          than an outlined box. */}
      <div
        className={`relative transition-colors duration-300 ${
          clear ? "bg-transparent" : "bg-white/85 backdrop-blur-xl"
        }`}
      >
        <div className="flex h-[var(--nav-bar-h)] items-center justify-between gap-x-4 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-x-8 px-5 sm:px-6 lg:px-8">
          {/* Logo — both marks stacked so the swap never waits on a fetch */}
          <Link
            href="/"
            onMouseEnter={closeMega}
            className="relative shrink-0 xl:justify-self-start"
          >
            <Image
              src="/images/ondek-logo-black.svg"
              alt="OnDek"
              width={214}
              height={100}
              priority
              className={`h-9 w-auto transition-opacity duration-300 ${clear ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/images/ondek-logo-white.svg"
              alt=""
              aria-hidden
              width={214}
              height={100}
              priority
              className={`absolute inset-0 h-9 w-auto transition-opacity duration-300 ${clear ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:justify-self-center">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group"
                // Only the mega item runs hover intent; every other item
                // closes the panel on entry so it never lingers while the
                // cursor browses the rest of the bar
                onMouseEnter={
                  item.mega ? () => scheduleOpen(item.label) : closeMega
                }
                onMouseLeave={item.mega ? cancelOpen : undefined}
              >
                <Link
                  href={item.children ? item.children[0].href : item.href}
                  aria-haspopup={item.mega ? "menu" : undefined}
                  aria-expanded={item.mega ? megaOpen : undefined}
                  onFocus={
                    item.mega
                      ? () => {
                          cancelOpen();
                          setOpenDropdown(item.label);
                        }
                      : undefined
                  }
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors ${
                    clear
                      ? "text-white/85 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                      : "text-foreground/70 hover:text-foreground hover:bg-cta/25"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      className={`size-3 mt-0.5 opacity-50 transition-transform ${
                        item.mega
                          ? megaOpen
                            ? "rotate-180"
                            : ""
                          : "group-hover:rotate-180"
                      }`}
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
                {item.children && !item.mega && (
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
          <div
            onMouseEnter={closeMega}
            className="flex items-center gap-2 xl:justify-self-end"
          >
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href={CTA_LINKS.designKit.href}
                className={`flex h-10 items-center whitespace-nowrap border px-3.5 xl:px-4 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors ${
                  clear
                    ? "border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                    : "border-foreground text-foreground/80 hover:text-foreground hover:bg-cta/25"
                }`}
              >
                {CTA_LINKS.designKit.label}
              </Link>
              <Link
                href={CTA_LINKS.quote.href}
                className="flex h-10 items-center whitespace-nowrap px-3.5 xl:px-4 text-[13px] font-bold uppercase tracking-[0.06em] btn-wipe text-foreground "
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
        <div className="lg:hidden mt-2 bg-white max-h-[calc(100dvh-var(--nav-bar-h)-var(--gutter)*4)] overflow-y-auto">
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
    </>
  );
}
