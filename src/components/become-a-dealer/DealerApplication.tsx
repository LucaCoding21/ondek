"use client";

import { useActionState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  submitDealerApplication,
  type DealerFormState,
} from "@/app/become-a-dealer/actions";
import SectionLabel from "@/components/SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INITIAL_STATE: DealerFormState = { ok: false, errors: {}, message: "" };

// Canada first — OnDek is Canadian and so is most of the dealer base — then
// the two catch-alls rather than 50 more options nobody scrolls through.
const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
  "United States",
  "Other",
];

const TRADES = [
  "Deck builder",
  "General contractor",
  "Renovation contractor",
  "Roofing contractor",
  "Retail / building supply",
  "Other",
];

const VOLUMES = ["1 – 5", "6 – 20", "21 – 50", "More than 50", "Not sure yet"];

const inputBase =
  "w-full border bg-background px-4 py-3 text-base leading-normal outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground";

function borderFor(error?: string) {
  return error ? "border-red-700" : "border-foreground/20";
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Field({ id, label, error, optional, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-foreground/50"
      >
        {label}
        {optional && (
          <span className="ml-2 font-medium normal-case tracking-normal text-foreground/35">
            optional
          </span>
        )}
      </label>

      <div className="relative mt-2">{children}</div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-xs font-bold text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** The chevron for the selects — appearance-none strips the native one */
function SelectChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-foreground/50"
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

export default function DealerApplication() {
  const [state, formAction, pending] = useActionState(
    submitDealerApplication,
    INITIAL_STATE,
  );

  const { errors } = state;
  const describedBy = (id: string) => (errors[id] ? `${id}-error` : undefined);

  // React resets an uncontrolled form once the action returns, so every field
  // reads its value back out of the state the action echoed
  const valueOf = (id: string) => state.values?.[id] ?? "";

  // The form unmounts on success and takes the focused submit button with it.
  // Moving focus to the confirmation both lands the keyboard somewhere real
  // and gets the message announced — a role="status" that mounts with its own
  // content doesn't reliably announce.
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.ok) successRef.current?.focus();
  }, [state.ok]);

  // Entrance only — the tweens touch the heading's mask spans, the intro
  // copy, and the card's outer shell, never the form or its fields. The
  // sticky column is left untransformed so position: sticky stays intact.
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // GSAP writes inline styles, so the global reduced-motion CSS can't
      // stop it — reduced-motion users get the section static and visible.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — the same signature move
        // as the rest of the site.
        gsap.from(".da-heading-line", {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".da-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".da-sub", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".da-heading",
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".da-card", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".da-card",
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    // scroll-mt clears the fixed nav when the hero's Apply button jumps here
    <section
      ref={sectionRef}
      id="apply"
      className="bg-surface scroll-mt-28 lg:scroll-mt-32"
    >
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-28 lg:pt-40 pb-28 lg:pb-40">
        <SectionLabel>Application</SectionLabel>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
          <div>
            {/* Sticks alongside the form on tall screens so the heading stays
                in view while the fields scroll past it */}
            <div className="lg:sticky lg:top-32">
              {/* Each line in its own overflow mask, rising out on scroll */}
              <h2 className="da-heading max-w-md font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.5rem)]">
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="da-heading-line block">Apply to become</span>
                </span>
                <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <span className="da-heading-line block">a dealer</span>
                </span>
              </h2>

              <p className="da-sub mt-8 max-w-md text-foreground/60 leading-relaxed">
                Nine fields, two of them optional. Tell us who you are, where
                you work, and the kind of jobs you take on, and we will pick it
                up from there.
              </p>
            </div>
          </div>

          <div>
            <div className="da-card border border-foreground bg-background p-6 sm:p-8 lg:p-10">
              {state.ok ? (
                // The form is gone once it succeeds — nothing left to resubmit
                <div className="py-8 text-center sm:py-16">
                  <span className="mx-auto flex size-14 items-center justify-center bg-cta">
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>

                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="mt-8 text-2xl font-bold outline-none sm:text-3xl"
                  >
                    {state.message}
                  </h3>

                  <p className="mx-auto mt-5 max-w-sm text-foreground/60 leading-relaxed">
                    Someone from OnDek will follow up with you directly. In the
                    meantime, the warranty and the spec sheets are all on the
                    documents page.
                  </p>
                </div>
              ) : (
                <form action={formAction} noValidate>
                  <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                    <Field id="name" label="Your name" error={errors.name}>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        defaultValue={valueOf("name")}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={describedBy("name")}
                        className={`${inputBase} ${borderFor(errors.name)}`}
                      />
                    </Field>

                    <Field id="company" label="Company" error={errors.company}>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        defaultValue={valueOf("company")}
                        required
                        aria-invalid={!!errors.company}
                        aria-describedby={describedBy("company")}
                        className={`${inputBase} ${borderFor(errors.company)}`}
                      />
                    </Field>

                    <Field id="email" label="Email" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        defaultValue={valueOf("email")}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={describedBy("email")}
                        className={`${inputBase} ${borderFor(errors.email)}`}
                      />
                    </Field>

                    <Field id="phone" label="Phone" error={errors.phone}>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        defaultValue={valueOf("phone")}
                        required
                        aria-invalid={!!errors.phone}
                        aria-describedby={describedBy("phone")}
                        className={`${inputBase} ${borderFor(errors.phone)}`}
                      />
                    </Field>

                    <Field id="city" label="City" error={errors.city}>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        defaultValue={valueOf("city")}
                        required
                        aria-invalid={!!errors.city}
                        aria-describedby={describedBy("city")}
                        className={`${inputBase} ${borderFor(errors.city)}`}
                      />
                    </Field>

                    <Field
                      id="province"
                      label="Province / state"
                      error={errors.province}
                    >
                      <select
                        id="province"
                        name="province"
                        autoComplete="address-level1"
                        required
                        defaultValue={valueOf("province")}
                        aria-invalid={!!errors.province}
                        aria-describedby={describedBy("province")}
                        className={`${inputBase} ${borderFor(errors.province)} appearance-none pr-10`}
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </Field>

                    <Field
                      id="trade"
                      label="What you build"
                      error={errors.trade}
                    >
                      <select
                        id="trade"
                        name="trade"
                        required
                        defaultValue={valueOf("trade")}
                        aria-invalid={!!errors.trade}
                        aria-describedby={describedBy("trade")}
                        className={`${inputBase} ${borderFor(errors.trade)} appearance-none pr-10`}
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {TRADES.map((trade) => (
                          <option key={trade} value={trade}>
                            {trade}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </Field>

                    <Field id="volume" label="Decks per year" optional>
                      <select
                        id="volume"
                        name="volume"
                        defaultValue={valueOf("volume")}
                        className={`${inputBase} ${borderFor()} appearance-none pr-10`}
                      >
                        <option value="">Select one</option>
                        {VOLUMES.map((volume) => (
                          <option key={volume} value={volume}>
                            {volume}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </Field>

                    <Field
                      id="notes"
                      label="Anything else"
                      optional
                      className="sm:col-span-2"
                    >
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        defaultValue={valueOf("notes")}
                        placeholder="The areas you cover, what you install today, questions you want answered on the call."
                        className={`${inputBase} ${borderFor()} resize-y`}
                      />
                    </Field>
                  </div>

                  {/* Only ever the summary line — the specifics sit under the
                      fields they belong to */}
                  {state.message && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-10 border-l-2 border-red-700 pl-4 text-sm font-bold text-red-700"
                    >
                      {state.message}
                    </p>
                  )}

                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <button
                      type="submit"
                      disabled={pending}
                      className="group inline-flex cursor-pointer items-center gap-3 btn-wipe px-7 py-3.5 font-bold  disabled:cursor-wait disabled:opacity-60"
                    >
                      {pending ? "Sending…" : "Send application"}
                      <svg
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M4 12L12 4M12 4H6M12 4V10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <p className="text-xs text-foreground/50 leading-relaxed">
                      We use these details to get in touch about becoming a
                      dealer. Nothing else.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
