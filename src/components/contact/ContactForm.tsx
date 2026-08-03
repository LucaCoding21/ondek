"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  submitContactMessage,
  type ContactFormState,
} from "@/app/company/contact/actions";

const INITIAL_STATE: ContactFormState = { ok: false, errors: {}, message: "" };

/** Enough to route the enquiry, and nothing that could be asked on the reply.
 *  The dealer and warranty options both have a better home on this site, which
 *  the note under the button points at. */
const TOPICS = [
  "A new deck",
  "Pricing or a quote",
  "Becoming a dealer",
  "A technical or spec question",
  "Warranty or a claim",
  "Something else",
];

/** Rules, not boxes: on the dark panel a bordered input reads as a stack of
 *  grey slabs, and the underline is what keeps the column quiet. */
const inputBase =
  "w-full border-b bg-transparent py-3 text-base leading-normal text-white outline-none transition-colors placeholder:text-white/40";

function borderFor(error?: string) {
  return error
    ? "border-red-400 focus:border-red-400"
    : "border-white/25 focus:border-white";
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    INITIAL_STATE,
  );

  const { errors } = state;
  const describedBy = (id: string) => (errors[id] ? `${id}-error` : undefined);

  // React resets an uncontrolled form once the action returns, so every field
  // reads its value back out of the state the action echoed
  const valueOf = (id: string) => state.values?.[id] ?? "";

  // The form unmounts on success and takes the focused submit button with it.
  // Moving focus to the confirmation both lands the keyboard somewhere real
  // and gets the message announced.
  const successRef = useRef<HTMLParagraphElement>(null);

  // The select is uncontrolled like the rest, but its placeholder option has to
  // read as dimmed and the chosen one as white — without this the dim class is
  // decided once at mount and never lifts
  const [topicChosen, setTopicChosen] = useState(false);

  useEffect(() => {
    if (state.ok) successRef.current?.focus();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="border-t border-white/25 pt-10">
        <p
          ref={successRef}
          tabIndex={-1}
          className="text-2xl font-bold outline-none sm:text-3xl"
        >
          {state.message}
        </p>
        <p className="mt-5 max-w-md text-white/55 leading-relaxed">
          We answer inside business hours, Monday to Friday. If it can&apos;t
          wait, the phone reaches us faster than the inbox does.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {/* Placeholders carry the wording, the way the reference does; the real
          labels stay in the markup for anyone not looking at it */}
      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="sr-only">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Name*"
            defaultValue={valueOf("name")}
            required
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={`${inputBase} ${borderFor(errors.name)}`}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-xs font-bold text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email*"
            defaultValue={valueOf("email")}
            required
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={`${inputBase} ${borderFor(errors.email)}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-xs font-bold text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="relative sm:col-span-2">
          <label htmlFor="topic" className="sr-only">
            Type of inquiry
          </label>
          <select
            id="topic"
            name="topic"
            required
            defaultValue={valueOf("topic")}
            onChange={(event) => setTopicChosen(event.target.value !== "")}
            aria-invalid={!!errors.topic}
            aria-describedby={describedBy("topic")}
            // Empty value stays dimmed like a placeholder; the options
            // themselves need explicit colours or the native dropdown inherits
            // white-on-white from the dark select
            className={`${inputBase} ${borderFor(errors.topic)} appearance-none pr-10 ${
              topicChosen || valueOf("topic") ? "" : "text-white/40"
            }`}
          >
            <option value="" disabled className="bg-background text-foreground">
              Choose type of inquiry*
            </option>
            {TOPICS.map((topic) => (
              <option
                key={topic}
                value={topic}
                className="bg-background text-foreground"
              >
                {topic}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-1 top-6 size-3.5 -translate-y-1/2 text-white/50"
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

          {errors.topic && (
            <p id="topic-error" className="mt-2 text-xs font-bold text-red-400">
              {errors.topic}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="sr-only">
            Your message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Type in your message"
            defaultValue={valueOf("message")}
            required
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            className={`${inputBase} ${borderFor(errors.message)} resize-y`}
          />
          {errors.message && (
            <p
              id="message-error"
              className="mt-2 text-xs font-bold text-red-400"
            >
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Only ever the summary line — the specifics sit under the fields they
          belong to */}
      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-8 border-l-2 border-red-400 pl-4 text-sm font-bold text-red-400"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex cursor-pointer items-center gap-3 bg-cta px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-foreground transition-[filter] hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send"}
      </button>

      {/* Two of the topics have a real destination on this site, so the note
          stays — but plain, on one line. The yellow rule and yellow links were
          pulling focus off the send button. */}
      <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/50">
        Applying to sell OnDek? Use the{" "}
        <Link
          href="/become-a-dealer"
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-white"
        >
          dealer application
        </Link>
        . Making a warranty claim? Start on the{" "}
        <Link
          href="/vinyl-decking/warranty"
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-white"
        >
          warranty page
        </Link>
        .
      </p>
    </form>
  );
}
