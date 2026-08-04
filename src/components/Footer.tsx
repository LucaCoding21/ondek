import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, CTA_LINKS } from "@/lib/nav";
import { GENERAL_EMAIL, TOLL_FREE } from "@/lib/contact";

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

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-10">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/ondek-logo-white.svg"
                  alt="OnDek"
                  width={214}
                  height={100}
                  className="h-14 w-auto"
                />
              </Link>

              {/* The mirror of the cross-promo on innovativealuminum.com,
                  which points back here with "we also serve vinyl" and a
                  ghosted OnDek logo. The dimming is opacity stacking — 70%
                  label inside an 80% anchor — and hover restores only the
                  anchor layer, brightening label and logo in one cheap
                  composite-only transition. The colour asset is used as-is —
                  a flat white recolour collapses this mark's stacked layers
                  into a blob, so a real knockout would need a designed asset. */}
              <a
                href="https://www.innovativealuminum.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Innovative Aluminum Systems — sister brand (opens in new tab)"
                className="inline-flex flex-col items-start opacity-80 transition-opacity hover:opacity-100"
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
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
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              Waterproof vinyl decking membranes for decks, balconies, and
              roof decks across North America. Part of the Innovative Group
              of Companies.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href={CTA_LINKS.quote.href}
                className="px-4 py-2.5 text-sm font-bold btn-wipe-light text-foreground "
              >
                {CTA_LINKS.quote.label}
              </Link>
              <Link
                href={CTA_LINKS.designKit.href}
                className="px-4 py-2.5 text-sm font-bold border border-white/25 hover:border-white/60 transition-colors"
              >
                {CTA_LINKS.designKit.label}
              </Link>
            </div>
          </div>

          {NAV_ITEMS.filter((i) => i.children).map((item) => (
            <div key={item.label}>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                {item.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {item.children!.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* The old footer's contact block, from the same source of truth
              as the contact page */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">
              Contact
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href={TOLL_FREE.href}
                  className="hover:text-white transition-colors"
                >
                  Toll free {TOLL_FREE.display}
                </a>
              </li>
              <li>
                <a
                  href="tel:+16046251159"
                  className="hover:text-white transition-colors"
                >
                  CAN 604-625-1159
                </a>
              </li>
              <li>
                <a
                  href="tel:+12163892212"
                  className="hover:text-white transition-colors"
                >
                  USA 216-389-2212
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${GENERAL_EMAIL}`}
                  className="break-all hover:text-white transition-colors"
                >
                  {GENERAL_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The old footer's dealer recruiting line, verbatim */}
        <div className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-white/10 pt-8 text-sm text-white/60">
          <p className="max-w-2xl leading-relaxed">
            OnDek Vinyl Worx is seeking builders, developers, and general
            contractors working in the new construction and renovation markets
            across North America.
          </p>
          <Link
            href="/become-a-dealer"
            className="font-bold text-white/80 underline decoration-1 underline-offset-4 transition-colors hover:text-white"
          >
            Become a dealer
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p>
              © {new Date().getFullYear()} OnDek Vinyl Worx Inc. All rights
              reserved.
            </p>

            {/* Studio credit: per-letter staggered wave on hover, CSS only.
                Letters are aria-hidden with the label on the anchor, so a
                screen reader hears one word, not eleven spans. The lift is
                desktop-gated so touch never strands a half-risen wave. */}
            <p className="text-[11px] text-white/30">
              Built with care by{" "}
              <a
                href="https://cloverfield.studio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cloverfield"
                className="group inline-flex items-baseline align-baseline text-cta transition-colors"
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

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`OnDek on ${social.label}`}
                    className="block text-white/40 hover:text-white transition-colors"
                  >
                    <svg
                      className="size-4"
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
              className="hover:text-white/70 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
