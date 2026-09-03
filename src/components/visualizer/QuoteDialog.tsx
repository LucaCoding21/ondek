"use client";

import { useCallback, useEffect, useState } from "react";
import { useScrollLock } from "./useScrollLock";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  submitVisualizerQuote,
  type VisualizerQuoteResult,
} from "@/app/visualizer/actions";
import { GENERAL_EMAIL } from "@/lib/contact";

const inputClass =
  "w-full min-h-[44px] border border-foreground/20 bg-background px-4 py-3 outline-none transition-colors placeholder:text-foreground/35 focus:border-cta";

const SEND_ERROR = `Something went wrong sending your request. Try again, or email us at ${GENERAL_EMAIL}.`;

/**
 * Checkout-style quote form over the visualizer. The current design ships
 * with the submission as a JPEG (fetched lazily via getImage, so opening
 * the dialog costs nothing).
 */
export default function QuoteDialog({
  open,
  onClose,
  vinylName,
  context,
  getImage,
}: {
  open: boolean;
  onClose: () => void;
  vinylName: string;
  /** Selection details the email needs: sku, mode, layoutId */
  context: { vinylSku: string; mode: "stock" | "custom"; layoutId: string };
  /** The currently visible design as a JPEG, or null when none is up */
  getImage: () => Promise<Blob | null>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The page holds still while this overlay is up
  useScrollLock(open);

  // Closing clears any stale error. Closing from the success screen also
  // resets it, so the next open is a fresh form: a visitor who switches
  // vinyls can send a second request instead of staring at the old
  // "request is in". Contact details stay filled; only the note clears.
  const close = useCallback(() => {
    setError(null);
    if (done) {
      setDone(false);
      setNote("");
    }
    onClose();
  }, [done, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const canSubmit = !!(name.trim() && email.trim() && location.trim());

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("name", name);
      form.set("email", email);
      form.set("location", location);
      form.set("note", note);
      form.set("website", website);
      form.set("vinylSku", context.vinylSku);
      form.set("mode", context.mode);
      form.set("layoutId", context.layoutId);
      const image = await getImage();
      if (image) form.set("image", image, "design.jpg");

      const result: VisualizerQuoteResult =
        await submitVisualizerQuote(form);
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error ?? SEND_ERROR);
      }
    } catch {
      setError(SEND_ERROR);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-0 tablet:items-center tablet:p-6"
          onClick={close}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Request a quote"
            data-lenis-prevent
            className="max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain bg-background p-6 tablet:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">
                  Get a quote
                </p>
                {!done && (
                  <h2 className="mt-3 text-xl font-bold tablet:text-2xl">
                    Love the {vinylName} look?
                  </h2>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-m-2 cursor-pointer p-2 text-foreground/50 transition-colors hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {done ? (
              <div className="py-10 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 13,
                    delay: 0.1,
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
                <h2 className="mt-7 text-2xl font-bold">
                  Your request is in.
                </h2>
                <p className="mx-auto mt-3 max-w-sm leading-relaxed text-foreground/60">
                  The design you built came along with it. The team will
                  reach out soon to talk through your deck.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-7 cursor-pointer font-bold underline underline-offset-4 transition-colors hover:text-foreground/70"
                >
                  Back to the visualizer
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="mt-6">
                <p className="text-sm leading-relaxed text-foreground/55">
                  Your selected design rides along with the request, so the
                  team sees exactly what you have in mind.
                </p>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label
                      htmlFor="viz-name"
                      className="mb-2.5 block text-sm font-bold"
                    >
                      Name<span className="ml-0.5 text-red-700">*</span>
                    </label>
                    <input
                      id="viz-name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-5 tablet:grid-cols-2">
                    <div>
                      <label
                        htmlFor="viz-email"
                        className="mb-2.5 block text-sm font-bold"
                      >
                        Email<span className="ml-0.5 text-red-700">*</span>
                      </label>
                      <input
                        id="viz-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="viz-location"
                        className="mb-2.5 block text-sm font-bold"
                      >
                        City &amp; province / ZIP
                        <span className="ml-0.5 text-red-700">*</span>
                      </label>
                      <input
                        id="viz-location"
                        autoComplete="address-level2"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="viz-note"
                      className="mb-2.5 block text-sm font-bold"
                    >
                      Anything else
                      <span className="ml-1.5 font-medium text-foreground/40">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="viz-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Deck size, timeline, questions."
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </div>

                {/* Honeypot — off-screen for people, filled in by bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="viz-website">Website</label>
                  <input
                    id="viz-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="btn-wipe mt-7 w-full min-h-[44px] cursor-pointer py-3.5 font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {submitting ? "Sending…" : "Request my quote"}
                </button>
                {error && (
                  <p role="alert" className="mt-3 text-sm font-bold text-red-700">
                    {error}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
