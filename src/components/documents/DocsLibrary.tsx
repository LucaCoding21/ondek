"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  DOCUMENTS,
  DOC_CATEGORIES,
  DOC_CATEGORY_BLURBS,
  DOC_CATEGORY_LABELS,
  type DocCategory,
  type OndekDocument,
} from "@/lib/documents";

/** Groups keep source order — the drawings are numbered and read best that
 *  way, and a stray Map lookup is cheaper than sorting them back */
function groupByCategory(docs: OndekDocument[]) {
  return DOC_CATEGORIES.map((category) => {
    const inCategory = docs.filter((doc) => doc.category === category);
    const groups = new Map<string, OndekDocument[]>();

    for (const doc of inCategory) {
      const key = doc.group ?? "";
      const existing = groups.get(key);
      if (existing) existing.push(doc);
      else groups.set(key, [doc]);
    }

    return { category, count: inCategory.length, groups: [...groups] };
  }).filter((section) => section.count > 0);
}

export default function DocsLibrary() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<DocCategory | "all">("all");

  const searching = query.trim().length > 0;

  /** The contents rail is for reading position, so it stays out of the way
   *  until you have actually started down the list */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = DOCUMENTS.filter((doc) => {
      if (active !== "all" && doc.category !== active) return false;
      if (!needle) return true;
      return [doc.title, doc.blurb, doc.group, doc.code]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle));
    });

    return groupByCategory(filtered);
  }, [query, active]);

  const matchCount = sections.reduce(
    (total, section) => total + section.count,
    0,
  );

  return (
    <section className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-6 lg:pt-8 pb-24 lg:pb-32">
        <Reveal>
          {/* Search and filters ride together at the top of the grey band —
              35 documents is more than anyone scrolls for */}
          <label htmlFor="doc-search" className="sr-only">
            Search documents
          </label>
          {/* Same field as the FAQs: a boxed control with the icon on the
              CTA, rather than an underline that reads as page furniture */}
          <div className="flex items-stretch border border-foreground/20 bg-background transition-colors focus-within:border-foreground">
            <span
              aria-hidden
              className="grid w-12 shrink-0 place-items-center bg-cta text-foreground sm:w-14"
            >
              <svg className="size-5" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m13.5 13.5 3 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              id="doc-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search: drain, post, adhesive, 118…"
              className="w-full bg-transparent px-5 py-3 text-base font-bold outline-none placeholder:font-normal placeholder:text-foreground/35 sm:py-3.5 sm:text-lg"
            />

            {searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 cursor-pointer px-5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-foreground/45 transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <div
              role="group"
              aria-label="Filter documents by type"
              className="flex flex-wrap gap-2"
            >
              {(["all", ...DOC_CATEGORIES] as const).map((category) => {
                const isActive = active === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActive(category)}
                    aria-pressed={isActive}
                    // Outlined: on the grey band a plain white fill barely
                    // registered as a control
                    className={`cursor-pointer border px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/25 bg-background text-foreground/80 hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {category === "all"
                      ? "All documents"
                      : DOC_CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>

            <p aria-live="polite" className="text-sm text-foreground/50">
              {matchCount} {matchCount === 1 ? "document" : "documents"}
            </p>
          </div>
        </Reveal>

        {matchCount === 0 ? (
          <div className="mx-auto mt-24 max-w-md text-center">
            <p className="text-xl font-bold">No document matched that.</p>
            <p className="mt-4 text-foreground/60 leading-relaxed">
              Drawings can be searched by number as well as by name. If what you
              need isn&apos;t here, ask us for it.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-16 xl:gap-24 lg:items-start">
            {/* Table of contents for the whole library, pinned while you read
                down it: every category with its count, instead of the same
                heading block repeated beside each set */}
            <nav
              aria-label="Document categories"
              className={`hidden lg:block lg:sticky lg:top-32 transition-all duration-300 ${
                scrolled
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/45">
                Contents
              </p>
              <ul className="mt-6 flex flex-col gap-1 border-t border-foreground/15 pt-4">
                {sections.map((section) => (
                  <li key={section.category}>
                    <a
                      href={`#${section.category}`}
                      className="flex items-baseline justify-between gap-4 py-1.5 text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {DOC_CATEGORY_LABELS[section.category]}
                      <span className="text-xs tabular-nums text-foreground/40">
                        {section.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-16 lg:gap-24">
              {sections.map((section) => (
                <div
                  key={section.category}
                  id={section.category}
                  className="scroll-mt-40"
                >
                  {/* Heading runs across the top of its own set now that the
                    toolbar carries the navigation: title and count on one
                    rule, blurb under it, list full width */}
                  <div className="flex items-baseline justify-between gap-6 border-b border-foreground/25 pb-4">
                    <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.5rem,2.6vw,2.25rem)]">
                      {DOC_CATEGORY_LABELS[section.category]}
                    </h2>
                    <span className="shrink-0 text-xs font-bold tabular-nums text-foreground/45">
                      {section.count}
                    </span>
                  </div>

                  <p className="mt-5 max-w-2xl text-foreground/60 leading-relaxed">
                    {DOC_CATEGORY_BLURBS[section.category]}
                  </p>

                  <div className="mt-10 flex flex-col gap-12">
                    {section.groups.map(([group, docs]) => (
                      <div key={group || section.category}>
                        {group && (
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/75">
                            {group}
                          </p>
                        )}

                        {/* Rows, not cards: thirty-odd of the big bordered
                          panels the adhesive page uses would be a wall, and a
                          hairline list is what you scan a drawing set in */}
                        <ul
                          className={`divide-y divide-foreground/10 ${group ? "mt-5" : ""}`}
                        >
                          {docs.map((doc) => {
                            // Only the warranty overview is on this site; the
                            // rest are published documents, and Link carries an
                            // external href the same way AdhesiveGuides does
                            const external = doc.href.startsWith("http");

                            return (
                              <li key={doc.href}>
                                <Link
                                  href={doc.href}
                                  target={external ? "_blank" : undefined}
                                  rel={external ? "noopener" : undefined}
                                  className="group flex items-center gap-5 py-5 transition-colors hover:bg-background sm:gap-8 sm:px-4"
                                >
                                  {/* The drawing number is the thing installers
                                    call these by, so it leads the row */}
                                  <span className="w-11 shrink-0 text-sm font-bold tabular-nums text-foreground/35 group-hover:text-foreground/70 transition-colors">
                                    {doc.code ?? (
                                      <svg
                                        className="size-4"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden
                                      >
                                        <path
                                          d="M3.5 1.5h6L13 5v9.5H3.5z"
                                          stroke="currentColor"
                                          strokeWidth="1.4"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M9.25 1.75V5.25H12.75"
                                          stroke="currentColor"
                                          strokeWidth="1.4"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </span>

                                  <span className="min-w-0 flex-1">
                                    <span className="block font-bold leading-snug">
                                      {doc.title}
                                    </span>
                                    {doc.blurb && (
                                      <span className="mt-1.5 block max-w-xl text-sm text-foreground/55 leading-relaxed">
                                        {doc.blurb}
                                      </span>
                                    )}
                                  </span>

                                  <span className="hidden shrink-0 border border-foreground/20 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-foreground/50 sm:block">
                                    {doc.format}
                                  </span>

                                  <span className="shrink-0 text-foreground/40 transition-colors group-hover:text-foreground">
                                    {doc.format === "PDF" ? (
                                      <svg
                                        className="size-4"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden
                                      >
                                        <path
                                          d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13h11"
                                          stroke="currentColor"
                                          strokeWidth="1.6"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden
                                      >
                                        <path
                                          d="M4 12L12 4M12 4H6M12 4V10"
                                          stroke="currentColor"
                                          strokeWidth="1.8"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </span>

                                  {external && (
                                    <span className="sr-only">
                                      , {doc.format === "PDF" ? "PDF, " : ""}
                                      opens in a new tab
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
