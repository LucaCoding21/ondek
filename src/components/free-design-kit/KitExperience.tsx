"use client";

import { useState } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Hammer,
  Home,
  Package,
  Ruler,
  Truck,
  Zap,
} from "lucide-react";
import {
  submitKitRequest,
  type KitPayload,
} from "@/app/free-design-kit/actions";
import { GENERAL_EMAIL } from "@/lib/contact";
import SectionLabel from "@/components/SectionLabel";
import CommunityProof from "@/components/CommunityProof";

const TOTAL_STEPS = 4; // 0: who · 1: contact · 2: shipping · 3: success

/** The old site's own "I am a:" options, unchanged */
const ROLES = [
  {
    value: "Homeowner",
    icon: Home,
    description: "Planning or refreshing your own deck",
  },
  {
    value: "Contractor",
    icon: Hammer,
    description: "You build or waterproof decks",
  },
  { value: "Architect", icon: Ruler, description: "Specifying for a project" },
  {
    value: "Existing OnDek customer",
    icon: BadgeCheck,
    description: "Already working with OnDek",
  },
];

const COUNTRIES = ["Canada", "United States", "Other"];

/** From the old site's "Included in Your Design Kit" list. The newsletter
 *  and environmental-statement lines were dropped on the owner's call. */
const KIT_CONTENTS = [
  "Real samples of all available vinyl decking styles and colours",
  "Samples of the OnDek UltraFlash",
  "Samples of the OnDek UltraClip",
  "Information on the UltraSeam technology used in OnDek vinyl decking",
  "Selecting the Right Vinyl Decking checklist",
  "Warranty information on OnDek products",
];

/** The three reasons not to hesitate, kept to facts the old site publishes */
const TRUST_POINTS = [
  { icon: Truck, label: "Free shipping" },
  { icon: Zap, label: "Ships immediately" },
  { icon: Package, label: "Every style included" },
];

/** Grant Barlow's kit walkthrough — the same video the old kit page runs */
const KIT_VIDEO_SRC =
  "https://player.vimeo.com/video/521215844?title=0&byline=0&portrait=0&dnt=1&autoplay=1";

const INITIAL: KitPayload = {
  role: "",
  name: "",
  email: "",
  phone: "",
  street: "",
  address2: "",
  city: "",
  postal: "",
  country: "",
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SEND_ERROR = `Something went wrong sending your request. Try again, or email us at ${GENERAL_EMAIL}.`;

// Directional slide: forward slides content left, back slides it right
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

const stepTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

const inputClass =
  "w-full min-h-[44px] border border-foreground/20 bg-background px-4 py-3 outline-none transition-colors placeholder:text-foreground/35 focus:border-cta";

const ctaClass =
  "w-full min-h-[44px] cursor-pointer btn-wipe py-3.5 font-bold text-foreground  disabled:cursor-not-allowed disabled:opacity-30";

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
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
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
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

function KitWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<KitPayload>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const updateField = (field: keyof KitPayload, value: string) =>
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

  // Picking who you are advances immediately — no Continue on step 0
  const pickRole = (value: string) => {
    updateField("role", value);
    setDirection(1);
    setStep(1);
  };

  const progress = submitted ? 100 : (step / (TOTAL_STEPS - 1)) * 100;

  const canProceedContact = !!(
    data.name &&
    EMAIL.test(data.email) &&
    data.phone.replace(/\D/g, "").length >= 10
  );
  const canSubmit = !!(data.street && data.city && data.postal && data.country);

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSendError(null);
    try {
      const result = await submitKitRequest(data);
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
    <div className="border border-foreground bg-background p-6 sm:p-8">
      {/* Progress — 100% only once the request is actually in */}
      <div>
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

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              <StepHeading
                title="I am a…"
                sub="One tap. This just tells us which info to pack with your samples."
              />
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const selected = data.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => pickRole(role.value)}
                      className={`group cursor-pointer border p-4 text-left transition-colors duration-200 ${
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
                      <span className="mt-3 block text-sm font-bold leading-snug sm:text-base">
                        {role.value}
                      </span>
                      <span className="mt-1 hidden text-sm leading-snug text-foreground/55 sm:block">
                        {role.description}
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
              transition={stepTransition}
            >
              <BackButton onClick={back} />
              <StepHeading
                title="Where can we reach you?"
                sub="For the shipping confirmation, and in case we have a question about your order."
              />

              <div className="grid gap-5">
                <TextField
                  id="name"
                  label="Name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(value) => updateField("name", value)}
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
              </div>

              <button
                type="button"
                onClick={next}
                disabled={!canProceedContact}
                className={`${ctaClass} mt-7`}
              >
                Continue
              </button>
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
              transition={stepTransition}
            >
              <BackButton onClick={back} />
              <StepHeading
                title="Where do we ship it?"
                sub="The kit is a real box with real samples, so it needs a real mailbox."
              />

              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="street"
                    label="Street address"
                    autoComplete="address-line1"
                    value={data.street}
                    onChange={(value) => updateField("street", value)}
                    className="sm:col-span-2"
                  />
                  <TextField
                    id="address2"
                    label="Address line 2"
                    optional
                    autoComplete="address-line2"
                    value={data.address2}
                    onChange={(value) => updateField("address2", value)}
                    className="sm:col-span-2"
                  />
                  <TextField
                    id="city"
                    label="City"
                    autoComplete="address-level2"
                    value={data.city}
                    onChange={(value) => updateField("city", value)}
                  />
                  <TextField
                    id="postal"
                    label="Postal / ZIP code"
                    autoComplete="postal-code"
                    value={data.postal}
                    onChange={(value) => updateField("postal", value)}
                  />
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-bold"
                    >
                      Country
                      <span className="ml-0.5 text-red-700">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        value={data.country}
                        onChange={(event) =>
                          updateField("country", event.target.value)
                        }
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
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
                    </div>
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

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className={`${ctaClass} mt-7`}
                >
                  {submitting ? "Sending…" : "Ship my free kit"}
                </button>

                {sendError && (
                  <p role="alert" className="mt-3 text-sm font-bold text-red-700">
                    {sendError}
                  </p>
                )}

                <p className="mt-4 text-xs text-foreground/50 leading-relaxed">
                  Free of charge. We&apos;ll also stay in touch with occasional
                  email newsletters on new designs and product news.
                </p>
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
              transition={stepTransition}
              className="py-8 text-center"
            >
              {/* The payoff beat gets the overshoot: the badge springs in
                  past full size and settles */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 13,
                  delay: 0.15,
                }}
                className="mx-auto flex size-14 items-center justify-center rounded-full bg-cta"
              >
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
              </motion.span>

              <h2 className="mt-8 text-2xl font-bold">
                {`Thanks, ${data.name.split(" ")[0] || "friend"}. Your kit is on its way.`}
              </h2>
              <p className="mx-auto mt-4 max-w-sm leading-relaxed text-foreground/60">
                We&apos;ll get it shipped out to you immediately. While you
                wait, browse the designs it covers.
              </p>

              <Link
                href="/vinyl-decking/designs-colours"
                className="mt-8 inline-block font-bold underline underline-offset-4 transition-colors hover:text-foreground/70"
              >
                See the designs &amp; colours
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function KitExperience() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      {/* The fold: the offer on the left, the way to claim it on the right.
          On mobile the wizard comes before the photo, so the ask is never a
          screen away from the pitch. */}
      <section className="bg-background">
        <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-32 lg:pt-40 pb-20 lg:pb-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 xl:gap-x-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-start-1 lg:row-start-1"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
                Free design kit
              </p>
              <h1 className="mt-5 max-w-xl font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2.5rem,5vw,4rem)]">
                Get your free sample kit
              </h1>
              <p className="mt-6 max-w-lg text-lg text-foreground/60 leading-relaxed">
                Real samples of every vinyl style and colour we offer, shipped
                straight to your door. No cost, no obligation.
              </p>

              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {TRUST_POINTS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-sm font-bold"
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.75}
                      className="text-foreground/60"
                    />
                    {label}
                  </li>
                ))}
              </ul>

              <CommunityProof className="mt-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-end"
            >
              {/* The kit itself: box, brochures, membrane samples, trims */}
              <div className="notch-frame relative mt-2 aspect-square w-full max-w-xl overflow-hidden lg:mt-10">
                <Image
                  src="/images/design-kit-box.jpg"
                  alt="The OnDek design kit unboxed: shipping box, brochures, vinyl membrane samples, and trim pieces on a counter"
                  fill
                  preload
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2"
            >
              <div className="lg:sticky lg:top-28">
                <KitWizard />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The proof: what's actually in the box, and Grant showing it */}
      <section className="bg-surface">
        <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 pt-16 lg:pt-24 pb-24 lg:pb-32">
          <SectionLabel>What&apos;s in the box</SectionLabel>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 lg:items-center">
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-[#26282a]">
                {playing ? (
                  <iframe
                    src={KIT_VIDEO_SRC}
                    title="The OnDek design kit walkthrough"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label="Play video: the OnDek design kit walkthrough"
                    className="group absolute inset-0 block h-full w-full cursor-pointer"
                  >
                    <Image
                      src="/images/design-kit-box.jpg"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/20" />
                    <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center bg-cta text-foreground transition-transform duration-300 group-hover:scale-110">
                      <svg className="size-6" viewBox="0 0 16 16" aria-hidden>
                        <path d="M5 3.5v9l7.5-4.5L5 3.5Z" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
              <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
                Grant Barlow walks through the kit: what happens when you
                order, and what arrives in the box.
              </p>
            </div>

            <div>
              <h2 className="max-w-md text-3xl sm:text-4xl font-bold leading-tight">
                Everything you need to choose with confidence
              </h2>
              <ul className="mt-8 max-w-xl space-y-3.5">
                {KIT_CONTENTS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3.5 text-foreground/70 leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="mt-2 block size-2.5 shrink-0 bg-cta"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-10 max-w-xl border-t border-foreground/15 pt-6 text-sm text-foreground/60 leading-relaxed">
                Immediate questions? Call us in Canada toll-free at{" "}
                <a
                  href="tel:+18669666335"
                  className="font-bold text-foreground hover:text-foreground/60 transition-colors"
                >
                  1-866-966-6335
                </a>{" "}
                or in the USA at{" "}
                <a
                  href="tel:+12163892212"
                  className="font-bold text-foreground hover:text-foreground/60 transition-colors"
                >
                  216-389-2212
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
