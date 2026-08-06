"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NAV_ITEMS, CTA_LINKS } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Top-of-page state (scrollY ≤ 40) drives the roomier padding; transparent
  // additionally requires a hero under the bar so white text stays readable.
  const [atTop, setAtTop] = useState(true);
  // Seeded from the route so the first paint on the homepage isn't a flash
  // of the solid bar.
  const [overHero, setOverHero] = useState(pathname === "/");
  const lastY = useRef(0);

  // One open menu at a time — the mega photo panel or a compact dropdown,
  // keyed by nav label.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // A clicked compact dropdown locks open until click-outside or item click.
  // The ref mirrors the state for reads inside timers and stale closures;
  // both are only ever written through setLocked below.
  const [locked, setLockedState] = useState<string | null>(null);
  const lockedRef = useRef<string | null>(null);
  const setLocked = (value: string | null) => {
    lockedRef.current = value;
    setLockedState(value);
  };

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
  // Compact dropdowns close on a short delay so the cursor can cross the
  // 16px gap between trigger and panel without dropping it.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Moving along the bar to anything that isn't a menu trigger closes the
  // open menu — unless it's a click-locked dropdown. Hovering the mega sheet
  // itself keeps it open, since the sheet carries none of these handlers.
  const closeMenus = () => {
    cancelOpen();
    setOpenDropdown((cur) => (cur && cur === lockedRef.current ? cur : null));
  };
  const enterDropdown = (label: string) => {
    cancelOpen();
    cancelClose();
    if (lockedRef.current && lockedRef.current !== label) setLocked(null);
    setOpenDropdown(label);
  };
  const leaveDropdown = (label: string) => {
    if (lockedRef.current === label) return;
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenDropdown((cur) => (cur === label ? null : cur));
    }, 120);
  };
  const toggleLock = (label: string) => {
    if (lockedRef.current === label) {
      setLocked(null);
      setOpenDropdown(null);
    } else {
      setLocked(label);
      setOpenDropdown(label);
    }
  };
  const closeAll = () => {
    cancelOpen();
    cancelClose();
    setLocked(null);
    setOpenDropdown(null);
  };

  useEffect(
    () => () => {
      cancelOpen();
      cancelClose();
    },
    [],
  );

  // Close everything on route change.
  useEffect(() => {
    setLocked(null);
    setOpenDropdown(null);
  }, [pathname]);

  // Click-outside releases a locked dropdown.
  useEffect(() => {
    if (!locked) return;
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setLocked(null);
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [locked]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const hasHero = !!document.querySelector("[data-hero]");

    const measure = () => {
      const y = window.scrollY;
      setAtTop(y <= 40);
      setOverHero(hasHero && y <= 40);
    };
    measure();

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y <= 40) {
        // Always visible in the top state
        setHidden(false);
      } else if (delta > 0 && y > 100) {
        // Scrolling down past 100px hides the bar — take any open menu with
        // it, or a wheel-scroll (no mouseleave) strands the panel on screen
        setHidden(true);
        cancelOpen();
        setLocked(null);
        setOpenDropdown(null);
      } else if (delta < 0) {
        // Any scroll up reveals it, in the scrolled (cream) state
        setHidden(false);
      }

      measure();
      if (y >= 0) lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Never hide the bar while the mobile menu is open
  const isHidden = hidden && !mobileOpen;
  // The open mobile panel and the open mega panel are solid sheets, so the
  // bar has to match them rather than stay transparent.
  const clear = overHero && !mobileOpen && !megaOpen;

  return (
    <>
      {/* Page scrim: dims the page below the open mega panel so focus stays
          on the photo cards. Sits under the header, above content. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-40 hidden bg-black/50 transition-opacity duration-300 desktop:block ${
          megaOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <header
        ref={headerRef}
        onMouseLeave={closeMenus}
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 will-change-transform ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${atTop ? "py-5" : "py-3"} ${
          clear
            ? "border-b border-transparent bg-transparent"
            : megaOpen || mobileOpen
              ? "border-b border-transparent bg-cream/90 backdrop-blur-xl"
              : "border-b border-stone-200 bg-cream/90 backdrop-blur-xl"
        }`}
      >
        {/* Mega menu — a full-bleed white sheet anchored to the very top of
            the viewport, spanning edge to edge behind the bar (the nav is
            `relative` and later in the DOM, so it paints on top). Open, the
            two read as one surface: nav on top, photo cards below. A DOM
            descendant of <header>, so the header's onMouseLeave keeps it open
            while the cursor travels from the trigger into the cards. */}
        {megaItem && (
          <div
            aria-hidden={!megaOpen}
            className={`absolute inset-x-0 top-0 hidden bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-editorial desktop:block ${
              megaOpen
                ? "visible translate-y-0 opacity-100"
                : "pointer-events-none invisible -translate-y-2 opacity-0"
            }`}
          >
            {/* Spacer matching the bar's footprint (44px row + vertical
                padding) so the cards start just under the nav row */}
            <div
              className={`transition-[height] duration-500 ${atTop ? "h-[84px]" : "h-[68px]"}`}
            />
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
                      onClick={closeAll}
                      className="group/card block overflow-hidden bg-surface"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {megaEverOpened.current && card.image && (
                          <Image
                            src={card.image}
                            alt={card.label}
                            fill
                            sizes="(min-width: 1025px) 25vw, 0px"
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

        <nav className="relative flex w-full items-center justify-between px-4 tablet:px-20 desktop:px-32">
          {/* Logo — both marks stacked so the swap never waits on a fetch */}
          <Link href="/" onMouseEnter={closeMenus} className="relative flex-shrink-0">
            <Image
              src="/images/ondek-logo-black.svg"
              alt="OnDek"
              width={214}
              height={100}
              preload
              className={`h-10 w-auto transition-opacity duration-300 ${clear ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/images/ondek-logo-white.svg"
              alt=""
              aria-hidden
              width={214}
              height={100}
              preload
              className={`absolute inset-0 h-10 w-auto transition-opacity duration-300 ${clear ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-6 desktop:flex">
            {NAV_ITEMS.map((item) => {
              const open = openDropdown === item.label;
              const linkColor = clear
                ? "text-white"
                : "text-ink hover:text-accent";
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={
                    item.mega
                      ? () => scheduleOpen(item.label)
                      : item.children
                        ? () => enterDropdown(item.label)
                        : closeMenus
                  }
                  onMouseLeave={
                    item.mega
                      ? cancelOpen
                      : item.children
                        ? () => leaveDropdown(item.label)
                        : undefined
                  }
                >
                  {item.mega ? (
                    <Link
                      href={item.children ? item.children[0].href : item.href}
                      aria-haspopup="menu"
                      aria-expanded={open}
                      onFocus={() => {
                        cancelOpen();
                        setOpenDropdown(item.label);
                      }}
                      className={`nav-link flex items-center gap-1.5 ${linkColor}`}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </Link>
                  ) : item.children ? (
                    <>
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => toggleLock(item.label)}
                        onFocus={() => enterDropdown(item.label)}
                        className={`nav-link flex items-center gap-1.5 ${linkColor}`}
                      >
                        {item.label}
                        <ChevronDown
                          size={12}
                          className={`mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: -6, x: "-50%" }}
                            transition={{ duration: 0.16, ease: "easeOut" }}
                            className="absolute left-1/2 top-full mt-4 w-72 border border-[#E5E5E5] border-t-2 border-t-accent bg-white shadow-xl shadow-black/10"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={closeAll}
                                className="group/dd relative block px-6 py-3 font-heading text-[0.7rem] font-bold uppercase tracking-[0.2em] text-black transition-colors duration-150 hover:bg-[#F5F5F5] hover:text-accent"
                              >
                                <span
                                  aria-hidden
                                  className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity duration-150 group-hover/dd:opacity-100"
                                />
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`nav-link block ${linkColor}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right cluster: CTA pair on desktop, hamburger below it */}
          <div onMouseEnter={closeMenus} className="flex items-center gap-3">
            <div className="hidden items-center gap-3 desktop:flex">
              <Link
                href={CTA_LINKS.designKit.href}
                className={`flex min-h-11 items-center whitespace-nowrap px-5 py-2.5 font-body text-[0.8125rem] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  clear
                    ? "bg-white/10 text-white hover:bg-white/16 hover:text-gold"
                    : "bg-black/6 text-ink hover:bg-black/10 hover:text-gold"
                }`}
              >
                {CTA_LINKS.designKit.label}
              </Link>
              <Link
                href={CTA_LINKS.quote.href}
                className="group/cta relative flex min-h-11 items-center overflow-hidden whitespace-nowrap bg-accent px-5 py-2.5 font-body text-[0.8125rem] font-bold uppercase tracking-[0.2em]"
              >
                {/* Left-origin wipe: white over the transparent header (label
                    stays black), ink when scrolled (label flips to white) */}
                <span
                  aria-hidden
                  className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-x-100 ${
                    clear ? "bg-white" : "bg-ink"
                  }`}
                />
                <span
                  className={`relative transition-colors duration-500 ${
                    clear ? "text-black" : "text-black group-hover/cta:text-white"
                  }`}
                >
                  {CTA_LINKS.quote.label}
                </span>
              </Link>
            </div>

            {/* Mobile hamburger: 24×20px icon, three 2px bars, the middle one
                16px wide and right-aligned */}
            <button
              className="flex min-h-11 min-w-11 items-center justify-end desktop:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className="flex h-5 w-6 flex-col items-end justify-between">
                <span
                  className={`block h-0.5 w-6 rounded-full transition-all ${clear ? "bg-white" : "bg-ink"} ${mobileOpen ? "translate-y-[9px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-0.5 w-4 rounded-full transition-all ${clear ? "bg-white" : "bg-ink"} ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 w-6 rounded-full transition-all ${clear ? "bg-white" : "bg-ink"} ${mobileOpen ? "-translate-y-[9px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile menu — a solid sheet below the bar */}
        {mobileOpen && (
          <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-stone-200 bg-white desktop:hidden">
            <div className="space-y-1 px-5 py-5">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <div className="pb-1 pt-3 text-xs font-bold uppercase tracking-widest text-foreground/40">
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
                      className="block pb-1 pt-3 text-xs font-bold uppercase tracking-widest text-foreground/80"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex gap-3 pb-2 pt-4">
                <Link
                  href={CTA_LINKS.designKit.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 bg-surface px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.06em]"
                >
                  {CTA_LINKS.designKit.label}
                </Link>
                <Link
                  href={CTA_LINKS.quote.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 bg-cta px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.06em]"
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
