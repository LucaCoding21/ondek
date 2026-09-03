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
 * Courtesy check on a picked deck photo, the server re-checks everything.
 * Returns the message to show, or null when the file is fine.
 */
function validateDeckPhoto(file: File): string | null {
  const heic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.heic$|\.heif$/i.test(file.name ?? "");
  if (heic) {
    return "HEIC photos need converting first. Export it as JPEG (or screenshot it) and try again.";
  }
  if (!LIMITS.uploadTypes.includes(file.type)) {
    return "That file type won't work. JPEG, PNG, or WebP.";
  }
  if (file.size > LIMITS.uploadMaxBytes) {
    return "That photo is over the 10MB limit. Try a smaller export.";
  }
  return null;
}

/**
 * The dashed box at the right end of the scene row: opens the picker, or
 * takes a drop. Always there, so another photo is one tap away.
 */
export default function UploadBox({
  label,
  onFile,
  className = "",
}: {
  label: string;
  onFile: (file: File) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handle(file: File | undefined | null) {
    if (!file) return;
    const problem = validateDeckPhoto(file);
    setError(problem);
    if (!problem) onFile(file);
  }

  return (
    <div className={className}>
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
        className={`flex w-full cursor-pointer flex-col border border-dashed text-left transition-colors duration-200 ${
          dragOver
            ? "border-cta bg-cta/[0.06]"
            : "border-foreground/30 hover:border-cta"
        }`}
      >
        <span className="flex aspect-[4/3] w-full items-center justify-center">
          <ImagePlus
            size={22}
            strokeWidth={1.5}
            className="text-foreground/40"
            aria-hidden
          />
        </span>
        <span className="block truncate px-2 py-2 text-[11px] font-bold leading-tight text-foreground/70 tablet:text-xs">
          {label}
        </span>
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs font-bold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
