"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GENERAL_EMAIL, HOURS, OFFICES, TEAM_GROUPS } from "@/lib/contact";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Everything under the contact screen is reference: two addresses, a handful of
 * numbers, five people. Shown at once it was ~25 values competing for the same
 * attention, which no amount of spacing fixes — so it collapses, and you open
 * only the one you came for.
 *
 * Same accordion as the FAQ and warranty pages: a grid row growing from 0fr to
 * 1fr is the one height transition that works without measuring anything. All
 * closed on arrival, one open at a time.
 *
 * The hours were repeated identically inside both office blocks; they are a
 * property of the company, not of a location, so they are stated once above.
 */

const CUSTOMER_SERVICE = TEAM_GROUPS.filter((group) => group.id !== "sales");
const SALES = TEAM_GROUPS.find((group) => group.id === "sales")!;

/** Roles already say "Office Manager", "President", "Customer Service
 *  Representative", so merging the two groups behind one row loses nothing */
const PANELS = [
  { id: "offices", title: "Offices", count: OFFICES.length },
  { id: "sales", title: "Sales inquiries", count: SALES.people.length },
  {
    id: "team",
    title: "Customer service & front office",
    count: CUSTOMER_SERVICE.reduce(
      (total, group) => total + group.people.length,
      0,
    ),
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`size-4 shrink-0 transition-transform duration-300 ease-out ${
        open ? "-rotate-180" : ""
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
  );
}

function PersonCard({
  person,
}: {
  person: (typeof TEAM_GROUPS)[number]["people"][number];
}) {
  return (
    <div>
      <p className="font-bold leading-tight">{person.name}</p>
      <p className="mt-1.5 text-sm text-foreground/55 leading-relaxed">
        {person.role}
      </p>

      {person.phone && (
        <a
          href={person.phone.href}
          className="mt-3 block text-sm font-bold transition-colors hover:text-foreground/55"
        >
          {person.phone.display}
        </a>
      )}

      <a
        href={`mailto:${person.email}`}
        className="mt-1 block break-all text-sm text-foreground/60 underline decoration-1 underline-offset-4 decoration-foreground/25 transition-colors hover:text-foreground hover:decoration-foreground"
      >
        {person.email}
      </a>
    </div>
  );
}

export default function ContactDirectory() {
  const [open, setOpen] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The heading rises out of its mask, the two facts follow through.
        gsap.from(".cd-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".cd-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".cd-meta > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: {
            trigger: ".cd-heading",
            start: "top 78%",
            once: true,
          },
        });

        // Row wrappers only — the accordion animates its own grid-rows
        // inside them and stays untouched.
        gsap.from(".cd-row", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".cd-rows", start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-24 lg:py-32">
        <SectionLabel>Where to find us</SectionLabel>

        <div className="mt-10 max-w-3xl">
          {/* One thought, one mask. The pb/-mb pair leaves the descender in
              "people." room inside the mask. */}
          <h2 className="cd-heading mt-7 font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.875rem,3.5vw,2.75rem)]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="cd-heading-line block">
                Offices and people
              </span>
            </span>
          </h2>

          {/* The two things that are true regardless of which row you open */}
          <div className="cd-meta">
          {/* The old contact page's own line about the team, en dash swapped
              for a colon */}
          <p className="mt-6 max-w-2xl text-foreground/60 leading-relaxed">
            Great products alone don&apos;t position us at the forefront of
            the industry: it&apos;s our qualified staff that set us apart from
            the competition.
          </p>
          <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-foreground/60">
            <span className="font-bold text-foreground">
              {HOURS.days}, {HOURS.time}
            </span>
            <span className="text-foreground/25" aria-hidden>
              ·
            </span>
            <a
              href={`mailto:${GENERAL_EMAIL}`}
              className="break-all underline decoration-1 underline-offset-4 decoration-foreground/25 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              {GENERAL_EMAIL}
            </a>
          </p>

          <p className="mt-2 text-sm text-foreground/45">{HOURS.note}</p>
          </div>
        </div>

        <div className="cd-rows mt-12 lg:mt-16">
          {PANELS.map((panel) => {
            const isOpen = open === panel.id;

            return (
              <div
                key={panel.id}
                className="cd-row border-t border-foreground/20 last:border-b"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : panel.id)}
                    aria-expanded={isOpen}
                    id={`directory-${panel.id}`}
                    aria-controls={`directory-panel-${panel.id}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left transition-colors hover:text-foreground/60"
                  >
                    <span className="text-lg font-bold sm:text-xl">
                      {panel.title}
                    </span>

                    <span className="flex items-center gap-4 text-foreground/45">
                      <span className="text-sm tabular-nums">
                        {panel.count}
                      </span>
                      <Chevron open={isOpen} />
                    </span>
                  </button>
                </h3>

                <div
                  id={`directory-panel-${panel.id}`}
                  role="region"
                  aria-labelledby={`directory-${panel.id}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-9">
                      {/* No rules, no small-caps micro-labels, no country
                          eyebrow — the postcode lines already say Canada and
                          USA. Three phone numbers don't need a ruled table. */}
                      {panel.id === "offices" && (
                        // gap-0 with symmetric padding instead of a gap, so the
                        // rule lands centred between the columns rather than
                        // hard against the left edge of the second one
                        <div className="grid gap-10 sm:grid-cols-2 sm:gap-0">
                          {OFFICES.map((office, i) => (
                            <div
                              key={office.id}
                              className={
                                i > 0
                                  ? "sm:border-l sm:border-foreground/15 sm:pl-12"
                                  : "sm:pr-12"
                              }
                            >
                              <p className="font-bold leading-tight">
                                {office.city}
                              </p>

                              <address className="mt-3 not-italic text-foreground/55 leading-relaxed">
                                {office.address.map((line) => (
                                  <span key={line} className="block">
                                    {line}
                                  </span>
                                ))}
                              </address>

                              <dl className="mt-5 space-y-1.5 text-sm">
                                {office.phones.map((phone) => (
                                  <div key={phone.label} className="flex gap-4">
                                    <dt className="w-16 shrink-0 text-foreground/40">
                                      {phone.label}
                                    </dt>
                                    <dd className="font-bold">
                                      <a
                                        href={phone.href}
                                        className="transition-colors hover:text-foreground/55"
                                      >
                                        {phone.display}
                                      </a>
                                    </dd>
                                  </div>
                                ))}

                                {office.fax && (
                                  <div className="flex gap-4">
                                    <dt className="w-16 shrink-0 text-foreground/40">
                                      Fax
                                    </dt>
                                    <dd className="text-foreground/55">
                                      {office.fax}
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                          ))}
                        </div>
                      )}

                      {panel.id === "sales" && (
                        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                          {SALES.people.map((person) => (
                            <PersonCard key={person.email} person={person} />
                          ))}
                        </div>
                      )}

                      {panel.id === "team" && (
                        <div className="grid gap-10 sm:grid-cols-3 sm:gap-12">
                          {CUSTOMER_SERVICE.flatMap((group) =>
                            group.people.map((person) => (
                              <PersonCard key={person.email} person={person} />
                            )),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
