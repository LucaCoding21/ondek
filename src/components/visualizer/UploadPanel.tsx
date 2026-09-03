"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { LIMITS } from "@/config/visualizer";

// No HEIC on purpose: the prebuilt sharp binary can't decode it, and
// desktop browsers can't either. Leaving it out of `accept` also makes
// iOS Safari hand over a JPEG conversion when a HEIC is picked from the
// camera roll, so iPhone photos still work without any converter.
const ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Drop zone + file picker for the visitor's deck photo. Camera roll works
 * through the same input on mobile. Validation here is a courtesy — the
 * server re-checks everything.
 */
export default function UploadPanel({
  onFile,
  compact = false,
}: {
  onFile: (file: File) => void;
  /** Small "change photo" variant shown once a photo is in */
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handle(file: File | undefined | null) {
    if (!file) return;
    const heic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      /\.heic$|\.heif$/i.test(file.name ?? "");
    if (heic) {
      setError(
        "HEIC photos need converting first. Export it as JPEG (or screenshot it) and try again.",
      );
      return;
    }
    if (!LIMITS.uploadTypes.includes(file.type)) {
      setError("That file type won't work. JPEG, PNG, or WebP.");
      return;
    }
    if (file.size > LIMITS.uploadMaxBytes) {
      setError("That photo is over the 10MB limit. Try a smaller export.");
      return;
    }
    setError(null);
    onFile(file);
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="hidden"
      onChange={(event) => {
        handle(event.target.files?.[0]);
        event.target.value = "";
      }}
    />
  );

  if (compact) {
    return (
      <>
        {input}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer text-sm font-bold underline underline-offset-4 transition-colors hover:text-foreground/70"
        >
          Change photo
        </button>
        {error && (
          <p role="alert" className="mt-2 text-sm font-bold text-red-700">
            {error}
          </p>
        )}
      </>
    );
  }

  return (
    <div>
      {input}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          handle(event.dataTransfer.files?.[0]);
        }}
        className={`flex w-full cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-14 text-center transition-colors duration-200 ${
          dragOver
            ? "border-cta bg-cta/[0.06]"
            : "border-foreground/25 hover:border-cta"
        }`}
      >
        <ImagePlus
          size={28}
          strokeWidth={1.5}
          className="text-foreground/40"
          aria-hidden
        />
        <span className="mt-4 font-bold">Add a photo of your deck</span>
        <span className="mt-1.5 text-sm text-foreground/55">
          Drop it here or tap to browse. JPEG, PNG, or WebP up to 10MB.
        </span>
        <span className="mt-4 text-xs leading-relaxed text-foreground/45">
          Best results: daylight, the whole deck floor in frame, shot from
          standing height.
        </span>
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
