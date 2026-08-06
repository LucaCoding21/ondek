"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
import { CTA_LINKS } from "@/lib/nav";
import { TOLL_FREE } from "@/lib/contact";

/** The old site's own social profiles, unchanged */
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com/ondekvinylworx",
    // Simple brand marks drawn inline — the site carries no icon set for these
    path: "M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5H16.5V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V11H8v3h2.4v7h3.1Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCMGyzjU7r4_9TMjNOntRFVQ",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/ondek-vinyl-worx",
    path: "M6.5 8.8H3.6V21h2.9V8.8ZM5 7.4a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM20.4 14.3c0-3.1-1.6-5.7-4.6-5.7-1.5 0-2.5.8-3 1.6V8.8H9.9V21h2.9v-6.6c0-1.6.8-2.6 2.1-2.6 1.3 0 2.1 1 2.1 2.6V21h3.4v-6.7Z",
  },
  {
    label: "Pinterest",
    href: "https://pinterest.ca/ondekvinyl",
    path: "M12 3a9 9 0 0 0-3.4 17.3c-.1-.7-.2-1.9 0-2.7l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.8 0-2.5-1.8-4.3-4.4-4.3a4.6 4.6 0 0 0-4.8 4.6c0 .9.4 1.9.8 2.4a.3.3 0 0 1 .1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4.1 0-3.3 2.4-6.4 7-6.4 3.7 0 6.5 2.6 6.5 6.1 0 3.7-2.3 6.6-5.5 6.6-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9 9 0 1 0 12 3Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/ondekvinyl",
    path: "M12 4.3c2.5 0 2.8 0 3.8.1 2.5.1 3.7 1.3 3.8 3.8.1 1 .1 1.3.1 3.8s0 2.8-.1 3.8c-.1 2.5-1.3 3.7-3.8 3.8-1 .1-1.3.1-3.8.1s-2.8 0-3.8-.1c-2.5-.1-3.7-1.3-3.8-3.8-.1-1-.1-1.3-.1-3.8s0-2.8.1-3.8c.1-2.5 1.3-3.7 3.8-3.8 1-.1 1.3-.1 3.8-.1ZM12 2.7c-2.5 0-2.8 0-3.8.1-3.4.2-5.2 2-5.4 5.4-.1 1-.1 1.3-.1 3.8s0 2.8.1 3.8c.2 3.4 2 5.2 5.4 5.4 1 .1 1.3.1 3.8.1s2.8 0 3.8-.1c3.4-.2 5.2-2 5.4-5.4.1-1 .1-1.3.1-3.8s0-2.8-.1-3.8c-.2-3.4-2-5.2-5.4-5.4-1-.1-1.3-.1-3.8-.1Zm0 4.5a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-9.2a1.1 1.1 0 1 0 0 2.3 1.1 1.1 0 0 0 0-2.3Z",
  },
];

/** OnDek's own sections in the reference footer's four-column frame */
const SECTIONS = [
  {
    title: "Vinyl decking",
    links: [
      { label: "Designs & colours", href: "/vinyl-decking/designs-colours" },
      { label: "The Ultra system", href: "/vinyl-decking/the-ultra-system" },
      { label: "Adhesive", href: "/vinyl-decking/adhesive" },
      { label: "Warranty", href: "/vinyl-decking/warranty" },
      { label: "Why vinyl", href: "/why-vinyl" },
    ],
  },
  {
    title: "Dealers",
    links: [
      { label: "Become a dealer", href: "/become-a-dealer" },
      { label: "Free design kit", href: "/free-design-kit" },
      { label: "Get a quote", href: "/get-a-quote" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/resources/blog" },
      { label: "FAQs", href: "/resources/faqs" },
      { label: "Documents", href: "/resources/documents" },
      { label: "Videos", href: "/resources/videos" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
];

/** Toll-free leads with the visible icon; the locals align under it via an
 *  invisible copy of the same icon (handoff spec) */
const PHONES = [
  { label: `Toll free ${TOLL_FREE.display}`, href: TOLL_FREE.href, lead: true },
  { label: "CAN 604-625-1159", href: "tel:+16046251159", lead: false },
  { label: "USA 216-389-2212", href: "tel:+12163892212", lead: false },
];

export default function Footer() {
  // Mobile accordion — one section open at a time
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <footer className="relative overflow-hidden bg-ink text-offwhite">
      {/* Full width on purpose — no max-w cap, so the columns run out to the
          same edges as the wordmark below and the nav row above. The padding
          scale is copied from Navbar so all three align. */}
      <div className="relative z-10 w-full px-4 pb-16 pt-12 tablet:px-20 tablet:pt-20 desktop:px-40">
        {/* Brand block — floated left at a fixed width on desktop so the
            link grid sits beside it */}
        <div className="pb-10 desktop:float-left desktop:mr-12 desktop:w-[360px] desktop:pb-0">
          <div className="mb-4 flex items-end gap-5">
            <Link href="/" className="shrink-0">
              <Image
                src="/images/ondek-logo-white.svg"
                alt="OnDek"
                width={214}
                height={100}
                className="h-10 w-auto"
              />
            </Link>

            {/* The mirror of the cross-promo on innovativealuminum.com,
                which points back here with "we also serve vinyl" and a
                ghosted OnDek logo. The dimming is opacity stacking — 70%
                label inside an 80% anchor — and hover restores only the
                anchor layer, brightening label and logo in one cheap
                composite-only transition. */}
            <a
              href="https://www.innovativealuminum.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Innovative Aluminum Systems — sister brand (opens in new tab)"
              className="inline-flex flex-col items-start opacity-80 transition-opacity hover:opacity-100"
            >
              <p className="mb-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                We also serve railing
              </p>
              <Image
                src="/images/innovative-aluminum-logo.svg"
                alt=""
                width={473}
                height={160}
                className="h-10 w-auto"
              />
            </a>
          </div>

          <p className="mb-4 max-w-[360px] font-body text-[15px] leading-[1.6] text-white/50">
            Waterproof vinyl decking membranes for decks, balconies, and roof
            decks across North America, part of the Innovative Group of
            Companies.
          </p>

          <div className="mb-6 flex flex-col gap-1.5">
            {PHONES.map((phone) => (
              <a
                key={phone.href + phone.label}
                href={phone.href}
                className={`inline-flex items-center gap-2 font-body text-[15px] transition-colors hover:text-gold ${
                  phone.lead ? "text-white/70" : "text-white/50"
                }`}
              >
                <Phone
                  size={14}
                  aria-hidden
                  className={phone.lead ? "" : "opacity-0"}
                />
                {phone.label}
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            <Link
              href={CTA_LINKS.quote.href}
              className="bg-accent px-4 py-2 font-body text-[11px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-accent-hover"
            >
              {CTA_LINKS.quote.label}
            </Link>
            <Link
              href={CTA_LINKS.designKit.href}
              className="border border-white/35 px-4 py-2 font-body text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:border-gold hover:text-gold"
            >
              {CTA_LINKS.designKit.label}
            </Link>
          </div>
        </div>

        {/* Link columns — desktop grid */}
        {/* Width-capped on purpose: the tracks are 1fr, so without a cap they
            absorb every pixel left over by the floated brand block and the
            columns drift apart on wide screens. The cap sets the gap, and
            ml-auto parks the capped block against the right edge — the grid
            establishes its own formatting context, so it clears the float
            rather than sliding under it. */}
        <div className="ml-auto hidden max-w-[720px] grid-cols-4 gap-x-8 pb-14 desktop:grid">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/80">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-[14px] text-white/70 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Link sections — mobile accordion, one open at a time */}
        <div className="desktop:hidden">
          {SECTIONS.map((section, i) => {
            const open = openSection === section.title;
            return (
              <div
                key={section.title}
                className={
                  i < SECTIONS.length - 1 ? "border-b border-white/8" : ""
                }
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenSection(open ? null : section.title)}
                  className="flex w-full items-center justify-between py-4"
                >
                  <span className="font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={14}
                    aria-hidden
                    className={`text-white/30 transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h-[400px] pb-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="font-body text-[15px] text-white/70 transition-colors hover:text-gold"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="clear-both hidden desktop:block" />

        {/* Copyright bar */}
        <div className="flex flex-col items-center gap-3 pb-4 text-center tablet:flex-row tablet:justify-between tablet:text-left desktop:border-t desktop:border-white/6 desktop:py-5">
          <div className="flex flex-col items-center gap-2 font-body text-[12px] text-white/30 tablet:flex-row tablet:items-baseline tablet:gap-5">
            <p>
              © {new Date().getFullYear()} OnDek Vinyl Worx Inc. All rights
              reserved.
            </p>

            {/* Studio credit: per-letter staggered wave on hover, CSS only.
                Letters are aria-hidden with the label on the anchor, so a
                screen reader hears one word, not eleven spans. The lift is
                desktop-gated so touch never strands a half-risen wave. */}
            <p>
              Built with care by{" "}
              <a
                href="https://cloverfield.studio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cloverfield"
                className="group inline-flex items-baseline align-baseline text-gold transition-colors"
              >
                {"Cloverfield".split("").map((char, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 desktop:group-hover:-translate-y-1"
                    style={{
                      transitionDelay: `${i * 30}ms`,
                      transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    {char}
                  </span>
                ))}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-[0.15em] h-[0.8em] w-[0.8em] self-center transition-transform duration-300 desktop:group-hover:-translate-y-0.5 desktop:group-hover:translate-x-0.5"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </p>
          </div>

          {/* OnDek carries socials + a contact link where the reference had
              Privacy / Terms */}
          <div className="flex items-center gap-5">
            <ul className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`OnDek on ${social.label}`}
                    className="block text-white/30 transition-colors hover:text-white/60"
                  >
                    <svg
                      className="size-[18px]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/company/contact"
              className="font-body text-[12px] text-white/30 transition-colors hover:text-white/60"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Massive brand wordmark — edge to edge, ghosted into the black,
          shown in full. Its height is locked to the page width by the SVG's
          aspect ratio, so shrinking the band means giving up the full-bleed
          width, not cropping. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-0 -mt-16 select-none overflow-hidden"
      >
        <motion.div
          initial={{ y: "20%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Plain img on purpose — a decorative full-bleed SVG needs no
              next/image pipeline */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ondek-wordmark.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="block h-auto w-full opacity-10"
          />
        </motion.div>
      </div>
    </footer>
  );
}
