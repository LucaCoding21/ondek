"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Building2, Hammer, Home, Ruler } from "lucide-react";
import {
  DECK_SIZES,
  PERSONAS,
  PROJECT_TYPES,
  TIMELINES,
  type Persona,
} from "@/app/get-a-quote/options";
import {
  submitQuoteRequest,
  type QuotePayload,
} from "@/app/get-a-quote/actions";
import { GENERAL_EMAIL } from "@/lib/contact";

const TOTAL_STEPS = 4; // 0: who · 1: project · 2: contact · 3: success

const PERSONA_ICONS: Record<Persona, typeof Home> = {
  homeowner: Home,
  contractor: Hammer,
  "property-manager": Building2,
  designer: Ruler,
};

const INITIAL: QuotePayload = {
  persona: "",
  projectType: "",
  deckSize: "",
  timeline: "",
  name: "",
  email: "",
  phone: "",
  city: "",
  province: "",
  notes: "",
  website: "",
};

const SEND_ERROR = `Something went wrong sending your request. Try again, or email us at ${GENERAL_EMAIL}.`;

// Directional slide: forward slides content left, back slides it right
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

const inputClass =
  "w-full min-h-[44px] border border-foreground/20 bg-background px-4 py-3 outline-none transition-colors placeholder:text-foreground/35 focus:border-cta";

const ctaClass =
  "w-full min-h-[44px] cursor-pointer bg-cta py-3.5 font-bold text-foreground transition-[filter] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-30";

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold tablet:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/55">{sub}</p>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-foreground/50 transition-colors hover:text-foreground"
    >
      <ArrowLeft size={14} />
      Back
    </button>
  );
}

function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <p className="mb-2.5 text-sm font-bold">
      {children}
      {optional ? (
        <span className="ml-1.5 font-medium text-foreground/40">
          (optional)
        </span>
      ) : (
        <span className="ml-0.5 text-red-700">*</span>
      )}
    </p>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`cursor-pointer border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors duration-200 ${
        selected
          ? "border-cta bg-cta/[0.06]"
          : "border-foreground/15 hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  optional,
  type = "text",
  inputMode,
  autoComplete,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  type?: string;
  inputMode?: "email" | "tel" | "text";
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 block text-sm font-bold">
        {label}
        {optional ? (
          <span className="ml-1.5 font-medium text-foreground/40">
            (optional)
          </span>
        ) : (
          <span className="ml-0.5 text-red-700">*</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </div>
  );
}

/** Pinned above the fold on mobile; sits inline in the flow from tablet up */
function StickyCta({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-foreground/10 bg-background px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] tablet:static tablet:mt-7 tablet:border-0 tablet:bg-transparent tablet:p-0">
      {children}
    </div>
  );
}

export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<QuotePayload>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Without this, mobile users land mid-step after every transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const updateField = (field: keyof QuotePayload, value: string) =>
    setData((current) => ({ ...current, [field]: value }));

  // Direction is set BEFORE the step changes so the exiting step reads it
  const next = () => {
    setDirection(1);
    setStep((current) => current + 1);
  };

  const back = () => {
    setDirection(-1);
    setStep((current) => current - 1);
  };

  // Picking a persona advances immediately — no Continue on step 0. A
  // different persona invalidates the project type picked for the old one.
  const pickPersona = (value: string) => {
    setData((current) =>
      value === current.persona
        ? current
        : { ...current, persona: value, projectType: "" },
    );
    setDirection(1);
    setStep(1);
  };

  const progress = submitted ? 100 : (step / (TOTAL_STEPS - 1)) * 100;

  const projectOptions = data.persona
    ? PROJECT_TYPES[data.persona as Persona]
    : [];

  const canProceedDetails = !!(data.projectType && data.timeline);
  const canSubmit = !!(
    data.name &&
    data.email &&
    data.phone &&
    data.city &&
    data.province
  );

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSendError(null);
    try {
      const result = await submitQuoteRequest(data);
      if (result.ok) {
        setSubmitted(true);
        setDirection(1);
        setStep(3);
      } else {
        setSendError(result.error ?? SEND_ERROR);
      }
    } catch {
      setSendError(SEND_ERROR);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-quote-page className="bg-background">
      <div className="mx-auto min-h-screen max-w-3xl px-6 pb-36 pt-28 tablet:pb-32 tablet:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-bold uppercase tracking-[0.2em] text-foreground"
        >
          Get a quote
        </motion.p>

        {/* Progress — 100% only once the request is actually in */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-foreground/50">
            <span>
              {submitted ? "Complete" : `Step ${step + 1} of ${TOTAL_STEPS - 1}`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-[2px] w-full overflow-hidden bg-stone-200">
            <motion.div
              className="h-full bg-cta"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="step-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <StepHeading
                  title="I am a…"
                  sub="Quotes look a little different depending on who is asking — this points yours the right way."
                />
                <div className="grid grid-cols-2 gap-2 tablet:gap-3">
                  {PERSONAS.map((persona) => {
                    const Icon = PERSONA_ICONS[persona.value];
                    const selected = data.persona === persona.value;
                    return (
                      <button
                        key={persona.value}
                        type="button"
                        onClick={() => pickPersona(persona.value)}
                        className={`group cursor-pointer border p-4 text-left transition-colors duration-200 tablet:p-5 ${
                          selected
                            ? "border-cta bg-cta/[0.06]"
                            : "border-foreground/15 hover:border-cta"
                        }`}
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.5}
                          className={`transition-colors duration-200 ${
                            selected
                              ? "text-foreground"
                              : "text-foreground/40 group-hover:text-foreground"
                          }`}
                        />
                        <span className="mt-3 block font-bold leading-snug">
                          {persona.label}
                        </span>
                        <span className="mt-1 hidden text-sm leading-snug text-foreground/55 tablet:block">
                          {persona.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <BackButton onClick={back} />
                <StepHeading
                  title="Tell us about the project."
                  sub="A rough idea is plenty — this is what shapes the quote."
                />

                <div className="space-y-8">
                  <div>
                    <FieldLabel>What kind of project is it?</FieldLabel>
                    <div className="grid grid-cols-1 gap-2 tablet:grid-cols-2">
                      {projectOptions.map((option) => (
                        <ChoiceButton
                          key={option.value}
                          selected={data.projectType === option.value}
                          onClick={() =>
                            updateField("projectType", option.value)
                          }
                        >
                          {option.label}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel optional>
                      Roughly how big is the deck area?
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {DECK_SIZES.map((option) => (
                        <ChoiceButton
                          key={option.value}
                          selected={data.deckSize === option.value}
                          onClick={() =>
                            // Optional single-select toggles off on re-click
                            updateField(
                              "deckSize",
                              data.deckSize === option.value
                                ? ""
                                : option.value,
                            )
                          }
                        >
                          {option.label}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>When do you want it done?</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINES.map((option) => (
                        <ChoiceButton
                          key={option.value}
                          selected={data.timeline === option.value}
                          onClick={() => updateField("timeline", option.value)}
                        >
                          {option.label}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                </div>

                <StickyCta>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canProceedDetails}
                    className={ctaClass}
                  >
                    Continue
                  </button>
                </StickyCta>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <BackButton onClick={back} />
                <StepHeading
                  title="How do we reach you?"
                  sub="Your quote goes straight to your inbox. We use these details for that and nothing else."
                />

                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid gap-5 tablet:grid-cols-2">
                    <TextField
                      id="name"
                      label="Name"
                      autoComplete="name"
                      value={data.name}
                      onChange={(value) => updateField("name", value)}
                      className="tablet:col-span-2"
                    />
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(value) => updateField("email", value)}
                    />
                    <TextField
                      id="phone"
                      label="Phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(value) => updateField("phone", value)}
                    />
                    <TextField
                      id="city"
                      label="Installation city / municipality"
                      autoComplete="address-level2"
                      value={data.city}
                      onChange={(value) => updateField("city", value)}
                    />
                    <TextField
                      id="province"
                      label="Province / state"
                      autoComplete="address-level1"
                      value={data.province}
                      onChange={(value) => updateField("province", value)}
                    />
                    <div className="tablet:col-span-2">
                      <label
                        htmlFor="notes"
                        className="mb-2.5 block text-sm font-bold"
                      >
                        Anything else
                        <span className="ml-1.5 font-medium text-foreground/40">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={data.notes}
                        onChange={(event) =>
                          updateField("notes", event.target.value)
                        }
                        placeholder="Measurements, photos you want to send later, questions about colours — whatever helps."
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>

                  {/* Honeypot — off-screen for people, filled in by bots */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={data.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                    />
                  </div>

                  <StickyCta>
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className={ctaClass}
                    >
                      {submitting ? "Submitting…" : "Get my quote"}
                    </button>
                    {sendError && (
                      <p
                        role="alert"
                        className="mt-3 text-sm font-bold text-red-700"
                      >
                        {sendError}
                      </p>
                    )}
                  </StickyCta>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="py-10 text-center"
              >
                {/* The one round thing on the page */}
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cta">
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

                <h2 className="mt-8 text-2xl font-bold">
                  Your quote request is received.
                </h2>
                <p className="mx-auto mt-4 max-w-sm leading-relaxed text-foreground/60">
                  {"We will put your quote together and get back to you within "}
                  <strong>one business day</strong>.
                </p>

                <Link
                  href="/"
                  className="mt-8 inline-block font-bold underline underline-offset-4 transition-colors hover:text-foreground/70"
                >
                  Back to the homepage
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
