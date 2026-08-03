"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import { FAQ_CATEGORIES, FAQ_COUNT } from "@/lib/faqs";

// The words people actually arrive with, as one-tap searches
const SHORTCUTS = ["Seams", "Warranty", "Cleaning", "Adhesive", "Winter"];

export default function FaqBrowser() {
  const [query, setQuery] = useState("");
  /** Keyed rather than indexed so filtering can't shift which one is open */
  const [open, setOpen] = useState<string | null>(`${FAQ_CATEGORIES[0].id}-0`);
  /** Search expands every match — you came here to read them — so the state
   *  it needs is the inverse: which of those you've since closed again. Reset
   *  on each keystroke, since the match set changes underneath it. */
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const searching = query.trim().length > 0;

  function handleQuery(value: string) {
    setQuery(value);
    setCollapsed([]);
  }

  function toggle(key: string, isOpen: boolean) {
    if (searching) {
      setCollapsed((current) =>
        isOpen ? [...current, key] : current.filter((k) => k !== key),
      );
    } else {
      setOpen(isOpen ? null : key);
    }
  }

  const categories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return FAQ_CATEGORIES;

    return FAQ_CATEGORIES.map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(needle) ||
          faq.a.toLowerCase().includes(needle),
      ),
    })).filter((category) => category.faqs.length > 0);
  }, [query]);

  const matchCount = categories.reduce(
    (total, category) => total + category.faqs.length,
    0,
  );

  return (
    <>
      {/* The hero owns the search: it is the way into the page, so it sits
          with the standfirst rather than waiting in the band below. Lives in
          this client component because the query state is here. */}
      <section
        data-hero
        className="relative min-h-dvh overflow-hidden bg-foreground"
      >
        <Image
          src="/images/projects/cedar-post-forest-deck.webp"
          alt="Vinyl deck with black railing looking out into forest"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

        <Reveal
          stagger=".hero-line"
          className="relative z-10 flex min-h-dvh flex-col px-5 md:px-8 lg:px-12 xl:px-16 pt-32 lg:pt-40 pb-14 lg:pb-20 text-white"
        >
          <div className="mt-auto">
            <h1 className="hero-line font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.5rem,6vw,6.5rem)] lg:whitespace-nowrap">
              Common questions
            </h1>

            <p className="hero-line mt-7 max-w-2xl text-lg text-white/75 leading-relaxed text-balance">
              {FAQ_COUNT} answers across {FAQ_CATEGORIES.length} areas: what the
              membrane is, how it goes down, what it stands up to, and what the
              warranty covers.
            </p>

            <div className="hero-line mt-10 max-w-3xl">
              <label htmlFor="faq-search" className="sr-only">
                Search the FAQs
              </label>

              <div className="flex items-stretch border border-white/30 bg-white/10 backdrop-blur-sm transition-colors focus-within:border-white">
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
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(event) => handleQuery(event.target.value)}
                  placeholder="Search the answers"
                  className="w-full bg-transparent px-5 py-3 text-base font-bold text-white outline-none placeholder:font-normal placeholder:text-white/55 sm:py-3.5 sm:text-lg"
                />

                {searching && (
                  <button
                    type="button"
                    onClick={() => handleQuery("")}
                    className="shrink-0 cursor-pointer px-5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold uppercase tracking-[0.1em] text-white/85">
                  Common
                </span>
                {SHORTCUTS.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleQuery(word.toLowerCase())}
                    className="cursor-pointer border border-white/50 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white/15"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Announced rather than silent — the results below can move a
                  long way up the page on a narrow match */}
              <p aria-live="polite" className="mt-4 text-sm text-white/60">
                {searching
                  ? `${matchCount} ${
                      matchCount === 1 ? "answer matches" : "answers match"
                    } “${query.trim()}”`
                  : " "}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-surface text-foreground">
        <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-16 lg:pt-24 pb-24 lg:pb-32">
          {matchCount === 0 ? (
            <div className="mx-auto mt-20 max-w-md text-center">
              <p className="text-xl font-bold">Nothing matched that.</p>
              <p className="mt-4 text-foreground/60 leading-relaxed">
                Try a shorter word, or ask us directly. There is a person on the
                other end of the contact form.
              </p>
            </div>
          ) : (
            <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-16 xl:gap-24 lg:items-start">
              {/* One index for the whole page instead of a heading repeated
                beside every group: counts included, sticky while you read */}
              <nav
                aria-label="FAQ categories"
                className="hidden lg:block lg:sticky lg:top-32"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/45">
                  Categories
                </p>
                <ul className="mt-6 border-t border-foreground/15">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <a
                        href={`#${category.id}`}
                        className="flex items-baseline justify-between gap-4 border-b border-foreground/15 py-3.5 text-sm transition-colors hover:text-foreground text-foreground/70"
                      >
                        {category.title}
                        <span className="text-xs tabular-nums text-foreground/40">
                          {category.faqs.length}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col gap-16 lg:gap-24">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-32"
                  >
                    <div className="flex items-baseline justify-between gap-6 border-b border-foreground/25 pb-4">
                      <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.5rem,2.6vw,2.25rem)]">
                        {category.title}
                      </h2>
                      <span className="shrink-0 text-xs font-bold tabular-nums text-foreground/45">
                        {category.faqs.length}
                      </span>
                    </div>

                    <p className="mt-5 max-w-2xl text-foreground/60 leading-relaxed">
                      {category.blurb}
                    </p>

                    {/* Same accordion as the warranty page: a grid row growing
                      from 0fr to 1fr is the one height transition that works
                      without measuring anything. One open at a time — clicking
                      the open question closes it. While a search is running
                      every match is open, because you came here to read them.
                      Rows share one plate now, divided by hairlines, so a
                      group reads as a list rather than as loose cards. */}
                    <div className="mt-8 divide-y divide-foreground/10 bg-background">
                      {category.faqs.map((faq, i) => {
                        const key = `${category.id}-${i}`;
                        const isOpen = searching
                          ? !collapsed.includes(key)
                          : open === key;

                        return (
                          <div key={faq.q}>
                            <h3>
                              <button
                                type="button"
                                onClick={() => toggle(key, isOpen)}
                                aria-expanded={isOpen}
                                id={`faq-question-${key}`}
                                aria-controls={`faq-answer-${key}`}
                                className="group flex w-full cursor-pointer items-center justify-between gap-6 p-6 text-left sm:px-8"
                              >
                                <span className="text-base sm:text-lg font-bold leading-snug">
                                  {faq.q}
                                </span>
                                <span
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                    isOpen
                                      ? "border-foreground bg-foreground text-background"
                                      : "border-foreground/20 group-hover:border-foreground/50"
                                  }`}
                                >
                                  <svg
                                    className={`size-3.5 transition-transform duration-300 ease-out ${
                                      isOpen ? "-rotate-180" : ""
                                    }`}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    aria-hidden
                                  >
                                    <path
                                      d="m4 6 4 4 4-4"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </h3>

                            <div
                              id={`faq-answer-${key}`}
                              role="region"
                              aria-labelledby={`faq-question-${key}`}
                              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <p className="max-w-2xl px-6 pb-6 sm:px-8 sm:pb-8 text-sm text-foreground/60 leading-relaxed">
                                  {faq.a}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
