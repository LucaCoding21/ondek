"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Columns2,
  Download,
  History,
  RefreshCw,
} from "lucide-react";
import SiteImage from "@/components/SiteImage";
import GeneratingOverlay from "./GeneratingOverlay";
import CompareSlider from "./CompareSlider";
import SwatchStrip from "./SwatchStrip";
import LayoutSwitcher from "./LayoutSwitcher";
import UploadPanel from "./UploadPanel";
import QuoteDialog from "./QuoteDialog";
import HistoryPanel from "./HistoryPanel";
import ComparePicker, { type CompareItem } from "./ComparePicker";
import { getAvailableVinyls, getVinyl } from "@/config/vinyls";
import { GENERAL_EMAIL } from "@/lib/contact";
import {
  GENERATION_PROGRESS,
  getStockLayout,
  STOCK_LAYOUTS,
  stockComboPath,
} from "@/config/visualizer";
import { hasStockCombo } from "@/config/stockCombos";
import {
  getPhoto,
  getRender,
  hashBytes,
  listHistory,
  putPhoto,
  putRender,
  recordHistory,
  renderedSkus as cachedSkus,
  restoreLastPhoto,
  type HistoryEntry,
} from "@/lib/visualizer/clientCache";
import {
  compositeCompare,
  designFilename,
  downloadBlob,
  imageToJpeg,
  isPortraitUrl,
  shrinkUpload,
} from "@/lib/visualizer/clientImage";
import {
  readNdjson,
  STREAM_CONTENT_TYPE,
  type GenerateStreamMessage,
} from "@/lib/visualizer/stream";

type Mode = "stock" | "custom";

type Photo = {
  hash: string;
  /** Object URL of the (downscaled) upload — the stage's base image */
  url: string;
  /** What gets POSTed to the generate route */
  blob: Blob;
  /** Taller than wide — the stage swaps to a portrait frame */
  portrait: boolean;
};

const GENERIC_ERROR =
  "The render didn't come together this time. Try again, your photo is still here.";

export default function VisualizerExperience({
  initialVinylSku,
  initialLayoutId,
}: {
  initialVinylSku?: string;
  initialLayoutId?: string;
}) {
  const vinyls = useMemo(() => getAvailableVinyls(), []);

  const [mode, setMode] = useState<Mode>("stock");
  const [sku, setSku] = useState(
    () =>
      (initialVinylSku && getVinyl(initialVinylSku)?.sku) ?? vinyls[0]?.sku,
  );
  const [layoutId, setLayoutId] = useState(
    () =>
      (initialLayoutId && getStockLayout(initialLayoutId)?.id) ??
      STOCK_LAYOUTS[0].id,
  );

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [renders, setRenders] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  /** The sku whose render is in flight right now (spinner + overlay key) */
  const [generatingSku, setGeneratingSku] = useState<string | null>(null);
  /** One pick made while a render was in flight — starts the moment the
   *  current render finishes. Last tap wins. */
  const [queuedSku, setQueuedSkuState] = useState<string | null>(null);
  /** Progress-bar floor backed by real stream events (partial frames) */
  const [progressFloor, setProgressFloor] = useState(0);
  /** Streamed preview of the render in flight: a tiny frame shown as a
   *  colour wash over the photo until the finished image replaces it */
  const [partial, setPartial] = useState<{
    hash: string;
    sku: string;
    src: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionDone, setSessionDone] = useState(false);
  const [customUnavailable, setCustomUnavailable] = useState(false);

  /** What the slider is showing. Any two images can be a pair: two vinyls,
   *  two past renders from history, or the original photo vs a render. */
  const [comparePair, setComparePair] = useState<{
    a: { src: string; label: string };
    b: { src: string; label: string };
  } | null>(null);
  const [split, setSplit] = useState(0.5);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  // One render in flight at a time; a second request would double-spend
  const inFlight = useRef(false);
  // The photo currently on deck, readable from async callbacks — guards a
  // render finishing after the visitor switched photos
  const photoRef = useRef<Photo | null>(null);
  useEffect(() => {
    photoRef.current = photo;
  }, [photo]);
  // Mirrors read inside generate()'s finally block, which runs before
  // React has re-rendered — state there would be stale
  const queuedRef = useRef<string | null>(null);
  const setQueued = useCallback((value: string | null) => {
    queuedRef.current = value;
    setQueuedSkuState(value);
  }, []);
  const rendersRef = useRef(renders);
  useEffect(() => {
    rendersRef.current = renders;
  }, [renders]);
  const limitsRef = useRef({ sessionDone: false, customUnavailable: false });

  const vinyl = getVinyl(sku) ?? vinyls[0];
  const layout = getStockLayout(layoutId) ?? STOCK_LAYOUTS[0];

  // ── Cache hydration ─────────────────────────────────────────────────

  const hydrateRenders = useCallback(async (photoHash: string) => {
    const skus = await cachedSkus(photoHash);
    const entries: Record<string, string> = {};
    for (const cachedSku of skus) {
      const blob = await getRender(photoHash, cachedSku);
      if (blob) entries[cachedSku] = URL.createObjectURL(blob);
    }
    setRenders((previous) => {
      // The old photo's URLs are dead weight now; already-painted images
      // keep displaying, only future loads are cut off
      for (const url of Object.values(previous)) URL.revokeObjectURL(url);
      return entries;
    });
  }, []);

  // A refresh mid-session picks the photo and its renders back up
  useEffect(() => {
    let cancelled = false;
    restoreLastPhoto().then(async (restored) => {
      if (!restored || cancelled) return;
      const url = URL.createObjectURL(restored.blob);
      const portrait = await isPortraitUrl(url);
      if (cancelled) return;
      setPhoto({ hash: restored.hash, url, blob: restored.blob, portrait });
      hydrateRenders(restored.hash);
    });
    listHistory().then((entries) => {
      if (!cancelled) setHistoryCount(entries.length);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrateRenders]);

  // Stock combos for the current layout, warmed so switching never flickers
  useEffect(() => {
    for (const v of vinyls) {
      if (hasStockCombo(layout.id, v.sku)) {
        new Image().src = stockComboPath(layout.id, v.sku);
      }
    }
  }, [layout.id, vinyls]);

  // ── Generation ──────────────────────────────────────────────────────

  const generate = useCallback(
    async function generateRun(
      targetSku: string,
      targetPhoto: Photo,
    ): Promise<string | null> {
      if (inFlight.current) return null;
      inFlight.current = true;
      setGenerating(true);
      setGeneratingSku(targetSku);
      setProgressFloor(0);
      setError(null);
      try {
        const form = new FormData();
        form.set("photo", targetPhoto.blob, "deck.jpg");
        form.set("sku", targetSku);
        const response = await fetch("/api/visualizer/generate", {
          method: "POST",
          body: form,
        });

        const fail = (code?: string, message?: string) => {
          // The ref updates too so the queue check in `finally` (which
          // runs before React re-renders) sees the cutoff immediately
          if (code === "session_limit") {
            limitsRef.current.sessionDone = true;
            setSessionDone(true);
          } else if (code === "monthly_cap") {
            limitsRef.current.customUnavailable = true;
            setCustomUnavailable(true);
          } else setError(message ?? GENERIC_ERROR);
          return null;
        };

        // Rejected before generation started: plain JSON with a status
        const streamed = response.headers
          .get("content-type")
          ?.includes(STREAM_CONTENT_TYPE);
        if (!streamed) {
          const payload = await response.json().catch(() => null);
          return fail(payload?.error, payload?.message);
        }

        // Generation is running: previews trickle in, then done or error
        const outcome: {
          done: { image: string; remaining: number } | null;
          error: { error: string; message: string } | null;
        } = { done: null, error: null };
        await readNdjson<GenerateStreamMessage>(response, (message) => {
          if (message.type === "partial") {
            // A partial frame is a REAL checkpoint — snap the bar forward
            setProgressFloor(
              GENERATION_PROGRESS.floors[
                Math.min(message.index, GENERATION_PROGRESS.floors.length - 1)
              ] ?? 0,
            );
            // Only for the photo still on stage — same guard as the final
            if (photoRef.current?.hash === targetPhoto.hash) {
              setPartial({
                hash: targetPhoto.hash,
                sku: targetSku,
                src: message.image,
              });
            }
          } else if (message.type === "done") {
            outcome.done = message;
          } else if (message.type === "error") {
            outcome.error = message;
          }
        });
        if (outcome.error) return fail(outcome.error.error, outcome.error.message);
        if (!outcome.done) return fail();
        const payload = outcome.done;

        if (payload.remaining <= 0) {
          limitsRef.current.sessionDone = true;
          setSessionDone(true);
        }

        const blob = await (await fetch(payload.image)).blob();
        await putRender(targetPhoto.hash, targetSku, blob);
        recordHistory(targetPhoto.hash, targetSku);
        listHistory().then((entries) => setHistoryCount(entries.length));
        const url = URL.createObjectURL(blob);
        // Only surface it if the visitor is still on this photo — a render
        // finishing after a photo switch must not land on the wrong deck
        // (the blob is cached under its own photo either way)
        if (photoRef.current?.hash === targetPhoto.hash) {
          setRenders((current) => {
            const previous = current[targetSku];
            // Delayed revoke: the before/after wipe may still be showing
            // the old URL as its underlay
            if (previous) {
              setTimeout(() => URL.revokeObjectURL(previous), 5000);
            }
            return { ...current, [targetSku]: url };
          });
        }
        return url;
      } catch {
        setError(GENERIC_ERROR);
        return null;
      } finally {
        inFlight.current = false;
        setGenerating(false);
        setGeneratingSku(null);
        setPartial(null);
        setProgressFloor(0);
        // A colour picked while this render was in flight starts now
        const next = queuedRef.current;
        queuedRef.current = null;
        setQueuedSkuState(null);
        const nextPhoto = photoRef.current;
        if (
          next &&
          nextPhoto &&
          !rendersRef.current[next] &&
          !limitsRef.current.sessionDone &&
          !limitsRef.current.customUnavailable
        ) {
          void generateRun(next, nextPhoto);
        }
      }
    },
    [],
  );

  const selectVinyl = useCallback(
    (nextSku: string) => {
      setSku(nextSku);
      setError(null);
      if (
        mode !== "custom" ||
        !photo ||
        renders[nextSku] ||
        sessionDone ||
        customUnavailable
      ) {
        return;
      }
      if (inFlight.current) {
        // A render is running: don't lose the tap, queue it. Tapping the
        // in-flight colour again just clears any queued pick.
        setQueued(nextSku === generatingSku ? null : nextSku);
      } else {
        generate(nextSku, photo);
      }
    },
    [
      mode,
      photo,
      renders,
      sessionDone,
      customUnavailable,
      generatingSku,
      generate,
      setQueued,
    ],
  );

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setComparePair(null);
      setQueued(null); // a queued pick belonged to the previous photo
      const originalBytes = await file.arrayBuffer();
      const hash = await hashBytes(originalBytes);
      // Pre-shrink in the browser when it can decode the format; otherwise
      // the original goes up and the server downscales instead
      const shrunk = await shrinkUpload(file);
      const blob = shrunk ?? file;
      const url = URL.createObjectURL(blob);
      const nextPhoto: Photo = {
        hash,
        url,
        blob,
        portrait: await isPortraitUrl(url),
      };
      if (photoRef.current && photoRef.current.hash !== hash) {
        URL.revokeObjectURL(photoRef.current.url);
      }
      setPhoto(nextPhoto);
      setMode("custom");
      putPhoto(hash, blob);
      // Same photo re-uploaded finds its old renders instantly. No render
      // fires here: uploading just shows the photo, and the first render
      // starts when the visitor picks a colour.
      await hydrateRenders(hash);
    },
    [hydrateRenders, setQueued],
  );

  // Bring a past design straight back from the cache — no API call
  const openFromHistory = useCallback(
    async (entry: HistoryEntry) => {
      const photoBlob = await getPhoto(entry.hash);
      if (!photoBlob) return;
      setHistoryOpen(false);
      setComparePair(null);
      setQueued(null);
      setError(null);
      if (photo?.hash !== entry.hash) {
        const url = URL.createObjectURL(photoBlob);
        setPhoto({
          hash: entry.hash,
          url,
          blob: photoBlob,
          portrait: await isPortraitUrl(url),
        });
        // Keep the restore pointer on whatever was viewed last
        putPhoto(entry.hash, photoBlob);
        await hydrateRenders(entry.hash);
      }
      setSku(entry.sku);
      setMode("custom");
    },
    [photo, hydrateRenders, setQueued],
  );

  // ── Compare ─────────────────────────────────────────────────────────
  // One button, one picker: everything comparable becomes a card — the
  // original photo, every past render (any photo), or stock combos.

  const loadCompareItems = useCallback(async (): Promise<CompareItem[]> => {
    if (mode === "stock") {
      const items: CompareItem[] = [
        {
          id: `stock:${layout.id}:original`,
          src: layout.photoPath,
          label: "Original photo",
        },
      ];
      for (const v of vinyls) {
        if (hasStockCombo(layout.id, v.sku)) {
          items.push({
            id: `stock:${layout.id}:${v.sku}`,
            src: stockComboPath(layout.id, v.sku),
            previewSrc: v.swatchPath,
            label: v.name,
            rendered: true,
          });
        }
      }
      // An original with nothing to compare against is no comparison
      return items.length > 1 ? items : [];
    }

    const items: CompareItem[] = [];
    if (photo) {
      items.push({
        id: `orig:${photo.hash}`,
        src: photo.url,
        label: "Original photo",
        group: "This photo",
      });
      // Every colour is on the table, shown as its swatch: a checkmark
      // means it's already rendered (instant), the rest render when picked
      const canRender = !sessionDone && !customUnavailable;
      for (const v of vinyls) {
        const rendered = !!renders[v.sku];
        if (!rendered && !canRender) continue;
        items.push({
          id: `${photo.hash}:${v.sku}`,
          src: v.swatchPath,
          previewSrc: v.swatchPath,
          label: v.name,
          sublabel: rendered ? undefined : "New render",
          group: "This photo",
          sku: v.sku,
          rendered,
        });
      }
    }
    // Renders made on other photos, in their own section
    for (const entry of await listHistory()) {
      if (photo && entry.hash === photo.hash) continue;
      const name = getVinyl(entry.sku)?.name;
      if (!name) continue;
      const blob = await getRender(entry.hash, entry.sku);
      if (blob) {
        items.push({
          id: `${entry.hash}:${entry.sku}`,
          src: URL.createObjectURL(blob),
          label: name,
          group: "Earlier photos",
          ephemeral: true,
        });
      }
    }
    return items;
  }, [mode, layout, vinyls, photo, renders, sessionDone, customUnavailable]);

  const startCompare = useCallback(
    async (a: CompareItem, b: CompareItem) => {
      setPickerOpen(false);
      // Before/after reads left to right: when one side is the untouched
      // photo, it takes the left no matter the pick order
      const isOriginal = (item: CompareItem) =>
        item.id.startsWith("orig:") || item.id.endsWith(":original");
      if (isOriginal(b) && !isOriginal(a)) {
        [a, b] = [b, a];
      }
      // A side picked as a bare colour renders now, progress theater and
      // all; if it fails, generate() has already surfaced the error state
      const sides: { src: string; label: string }[] = [];
      for (const item of [a, b]) {
        // A colour card resolves to its render on the current photo,
        // generating first when there isn't one yet
        if (item.sku && mode === "custom") {
          if (!photo) return;
          const url = renders[item.sku] ?? (await generate(item.sku, photo));
          if (!url) return;
          sides.push({ src: url, label: item.label });
        } else {
          sides.push({ src: item.src, label: item.label });
        }
      }
      setSplit(0.5);
      setComparePair({ a: sides[0], b: sides[1] });
    },
    [mode, photo, renders, generate],
  );

  // Re-roll the render on stage: image models are not deterministic, so a
  // render that came out wrong deserves a second take. Overwrites the
  // cache and history entry for this photo + vinyl.
  const regenerate = useCallback(() => {
    if (!photo) return;
    setComparePair(null);
    generate(sku, photo); // generate() itself refuses while one is in flight
  }, [photo, sku, generate]);

  // Compare pairs images of one photo/layout; changing either exits it
  const switchMode = useCallback(
    (nextMode: Mode) => {
      setMode(nextMode);
      setError(null);
      setComparePair(null);
      // Leaving Custom Mode drops any queued render; the in-flight one
      // still finishes into the cache
      setQueued(null);
    },
    [setQueued],
  );

  const switchLayout = useCallback((nextLayoutId: string) => {
    setLayoutId(nextLayoutId);
    setComparePair(null);
  }, []);

  // ── Stage + downloads ───────────────────────────────────────────────

  const stockCombo = hasStockCombo(layout.id, sku)
    ? stockComboPath(layout.id, sku)
    : null;
  const stageSrc =
    mode === "stock" ? (stockCombo ?? layout.photoPath) : (renders[sku] ?? photo?.url ?? null);
  const stagePending = mode === "stock" ? !stockCombo : !renders[sku];

  const showCompare = comparePair !== null;

  // Before/after wipe: when the stage lands on a finished render in
  // Custom Mode, it wipes in left to right over what was there before
  // (the bare photo, or the previous colour). Derived synchronously so
  // the incoming element mounts already knowing it should wipe.
  const reduceMotion = useReducedMotion();
  const [prevStage, setPrevStage] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{ from: string; to: string } | null>(
    null,
  );
  if (stageSrc !== prevStage) {
    setPrevStage(stageSrc);
    setReveal(
      !reduceMotion &&
        mode === "custom" &&
        stageSrc &&
        prevStage &&
        !prevStage.startsWith("/") && // only within the same photo context
        renders[sku] === stageSrc
        ? { from: prevStage, to: stageSrc }
        : null,
    );
  }

  // The streamed preview only belongs over the photo + vinyl it was made for
  const previewSrc =
    mode === "custom" &&
    generating &&
    partial &&
    partial.hash === photo?.hash &&
    partial.sku === sku &&
    !showCompare
      ? partial.src
      : null;

  const currentDesignSrc = mode === "stock" ? stockCombo : (renders[sku] ?? null);

  const getQuoteImage = useCallback(async (): Promise<Blob | null> => {
    if (comparePair) {
      return compositeCompare(
        comparePair.a.src,
        comparePair.b.src,
        comparePair.a.label,
        comparePair.b.label,
        split,
      );
    }
    return currentDesignSrc ? imageToJpeg(currentDesignSrc) : null;
  }, [comparePair, split, currentDesignSrc]);

  const canDownload = showCompare || !!currentDesignSrc;

  const handleDownload = useCallback(async () => {
    if (comparePair) {
      const blob = await compositeCompare(
        comparePair.a.src,
        comparePair.b.src,
        comparePair.a.label,
        comparePair.b.label,
        split,
      );
      if (blob) {
        downloadBlob(
          blob,
          designFilename(`${comparePair.a.label}-vs-${comparePair.b.label}`),
        );
      }
      return;
    }
    if (currentDesignSrc && vinyl) {
      const blob = await imageToJpeg(currentDesignSrc);
      if (blob) downloadBlob(blob, designFilename(vinyl.name));
    }
  }, [comparePair, split, currentDesignSrc, vinyl]);

  const busy = generating;

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 pt-24 tablet:pb-24 tablet:pt-28">
      <p className="text-xs font-bold uppercase tracking-[0.2em]">
        Deck visualizer
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 border-b border-foreground/10 pb-5">
        <h1 className="text-2xl font-bold leading-tight tablet:text-4xl">
          See your deck in OnDek vinyl.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-foreground/60">
          Try the lineup on our decks or upload a photo of yours. Compare
          favourites, download the look, send it with a quote request.
        </p>
      </div>

      {/* Mode tabs + render history */}
      <div className="mt-6 flex items-end justify-between border-b border-foreground/10">
        <div className="flex gap-6">
          {(
            [
              ["stock", "Our decks"],
              ["custom", "Your deck"],
            ] as [Mode, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => switchMode(value)}
              aria-pressed={mode === value}
              className={`-mb-px cursor-pointer border-b-2 pb-3 text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
                mode === value
                  ? "border-cta text-foreground"
                  : "border-transparent text-foreground/45 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {historyCount > 0 && (
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 pb-3 text-sm font-bold text-foreground/60 transition-colors hover:text-foreground"
          >
            <History size={15} />
            <span className="hidden min-[420px]:inline">My designs</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-cta text-[11px] font-bold text-foreground">
              {historyCount}
            </span>
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-8 desktop:grid-cols-[1fr_340px]">
        {/* ── Stage ── */}
        <div>
          <div
            className={`relative overflow-hidden bg-stone-100 desktop:aspect-auto desktop:min-h-[360px] ${
              mode === "custom" && photo?.portrait
                ? "h-[52vh] desktop:h-[72vh]"
                : "aspect-[4/3] desktop:h-[54vh]"
            }`}
          >
            {comparePair ? null : mode === "custom" && !photo ? (
              <div className="flex h-full items-center justify-center p-6">
                <div className="w-full max-w-md">
                  <UploadPanel onFile={handleUpload} />
                </div>
              </div>
            ) : null}
            {comparePair ? (
              <CompareSlider
                srcA={comparePair.a.src}
                srcB={comparePair.b.src}
                labelA={comparePair.a.label}
                labelB={comparePair.b.label}
                split={split}
                onSplitChange={setSplit}
              />
            ) : (
              stageSrc && (
                <AnimatePresence initial={false}>
                  <motion.div
                    key={stageSrc}
                    initial={
                      reveal?.to === stageSrc ? { opacity: 1 } : { opacity: 0 }
                    }
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    {/* The photo is never cropped: it sits contained at
                        its own aspect, and a blurred copy of itself fills
                        whatever the frame has left over (same URL, so the
                        browser fetches it once) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stageSrc}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
                    />
                    {stageSrc.startsWith("/") ? (
                      <SiteImage
                        src={stageSrc}
                        alt={`${layout.name} in ${vinyl?.name ?? "vinyl"}`}
                        fill
                        sizes="(max-width: 1025px) 100vw, 60vw"
                        preload
                        className="object-contain"
                      />
                    ) : reveal?.to === stageSrc ? (
                      // Before/after wipe: the previous view sits under
                      // the new render, which clips in left to right
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reveal.from}
                          alt=""
                          aria-hidden
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                        <motion.span
                          initial={{ clipPath: "inset(0 100% 0 0)" }}
                          animate={{ clipPath: "inset(0 0% 0 0)" }}
                          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute inset-0"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={stageSrc}
                            alt={`Your deck in ${vinyl?.name ?? "vinyl"}`}
                            className="h-full w-full object-contain"
                          />
                        </motion.span>
                      </>
                    ) : (
                      // Renders and uploads live in blob: URLs — outside
                      // the optimizer's reach, a plain img is correct
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={stageSrc}
                        alt={
                          renders[sku]
                            ? `Your deck in ${vinyl?.name ?? "vinyl"}`
                            : "Your deck photo"
                        }
                        className="relative h-full w-full object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )
            )}

            {/* Streamed preview: a 96px frame blown up and blurred, so
                the deck visibly takes on the colour ~12s in while the
                sheen keeps sweeping. Same box as the stage image, so the
                wash lands exactly on the photo. */}
            <AnimatePresence>
              {previewSrc && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 overflow-hidden"
                  aria-hidden
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt=""
                    className="h-full w-full scale-[1.03] object-contain blur-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overlay only where the visitor is actually waiting: on the
                sku being rendered (or one queued behind it). Viewing an
                already-cached colour mid-render gets the swatch spinner
                instead of a blocking overlay. Keyed per render so the
                progress bar restarts for a queued follow-up. */}
            {generating &&
              mode === "custom" &&
              !showCompare &&
              (stagePending || sku === generatingSku) && (
                <GeneratingOverlay
                  key={generatingSku ?? "render"}
                  refining={previewSrc !== null}
                  progressFloor={progressFloor}
                />
              )}

            {/* Stock combo not approved yet — say so instead of pretending */}
            {mode === "stock" && stagePending && !busy && (
              <span className="absolute bottom-3 left-3 bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white">
                {vinyl?.name} preview is being prepared. Showing the
                original deck for now
              </span>
            )}

            {mode === "custom" && photo && stagePending && !busy && !showCompare && (
              <span className="absolute bottom-3 left-3 bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white">
                Pick a vinyl to lay it on your deck
              </span>
            )}
          </div>

          {/* Mobile: the colour strip lives right under the photo */}
          <div className="mt-4 desktop:hidden">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-sm font-bold">Vinyl</p>
              <span className="text-xs text-foreground/45">{vinyl?.name}</span>
            </div>
            <SwatchStrip
              vinyls={vinyls}
              selectedSku={sku}
              onSelect={selectVinyl}
              pendingSkus={
                mode === "custom"
                  ? [generatingSku, queuedSku].filter(
                      (pending): pending is string => pending !== null,
                    )
                  : []
              }
            />
          </div>

          {/* Deck scenes — the three stock locations, under the main photo */}
          {mode === "stock" && (
            <div className="mt-4">
              <LayoutSwitcher selectedId={layoutId} onSelect={switchLayout} />
            </div>
          )}

          {/* Under-stage row: railing promo / photo controls + actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {mode === "stock" ? (
              <a
                href={layout.railing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground"
              >
                Interested in this railing? {layout.railing.name}
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ) : photo ? (
              <div className="flex items-center gap-4">
                <UploadPanel onFile={handleUpload} compact />
                {renders[sku] && !sessionDone && !customUnavailable && (
                  <button
                    type="button"
                    onClick={regenerate}
                    disabled={busy}
                    title="Not quite right? Take another pass at this colour"
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold underline underline-offset-4 transition-colors hover:text-foreground/70 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <RefreshCw size={13} />
                    Regenerate
                  </button>
                )}
              </div>
            ) : (
              <span />
            )}

            <div className="hidden items-center gap-2 tablet:flex">
              {showCompare ? (
                <button
                  type="button"
                  onClick={() => setComparePair(null)}
                  className="cursor-pointer border border-foreground/20 px-4 py-2.5 text-sm font-bold transition-colors hover:border-foreground"
                >
                  Back to single view
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  disabled={busy}
                  className="inline-flex cursor-pointer items-center gap-2 border border-foreground/20 px-4 py-2.5 text-sm font-bold transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Columns2 size={15} />
                  Compare
                </button>
              )}

              <button
                type="button"
                onClick={handleDownload}
                disabled={!canDownload}
                className="inline-flex cursor-pointer items-center gap-2 border border-foreground/20 px-4 py-2.5 text-sm font-bold transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Download size={15} />
                Download
              </button>

              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="btn-wipe cursor-pointer px-5 py-2.5 text-sm font-bold text-foreground"
              >
                Get a quote
              </button>
            </div>
          </div>

          {/* Friendly failure states */}
          {error && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border border-red-700/25 bg-red-700/[0.04] px-4 py-3">
              <p role="alert" className="text-sm font-semibold text-red-800">
                {error}
              </p>
              {mode === "custom" && photo && (
                <button
                  type="button"
                  onClick={() => photo && generate(sku, photo)}
                  className="cursor-pointer text-sm font-bold underline underline-offset-4"
                >
                  Try again
                </button>
              )}
              <span className="text-sm text-foreground/55">
                Or skip the wait:{" "}
                <button
                  type="button"
                  onClick={() => setQuoteOpen(true)}
                  className="cursor-pointer font-bold underline underline-offset-4 text-foreground"
                >
                  request a quote
                </button>{" "}
                and we&apos;ll design it with you.
              </span>
            </div>
          )}

          {sessionDone && mode === "custom" && (
            <div className="mt-4 border border-foreground/15 bg-surface px-4 py-3 text-sm leading-relaxed text-foreground/70">
              Looks like you&apos;ve been designing up a storm today. Your
              renders are saved, and more unlock tomorrow. Want to talk it
              through with an expert instead?{" "}
              <a
                href={`mailto:${GENERAL_EMAIL}`}
                className="font-bold underline underline-offset-4"
              >
                {GENERAL_EMAIL}
              </a>{" "}
              or{" "}
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="cursor-pointer font-bold underline underline-offset-4"
              >
                request a quote
              </button>
              .
            </div>
          )}

          {customUnavailable && mode === "custom" && (
            <div className="mt-4 border border-foreground/15 bg-surface px-4 py-3 text-sm leading-relaxed text-foreground/70">
              Custom previews are temporarily unavailable. The stock decks
              still work, or{" "}
              <Link
                href="/get-a-quote"
                className="font-bold underline underline-offset-4"
              >
                request a quote
              </Link>{" "}
              and we&apos;ll render your deck for you.
            </div>
          )}
        </div>

        {/* ── Controls column (desktop; mobile has its strip under the stage) ── */}
        <div className="hidden space-y-8 desktop:block">
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-sm font-bold">Vinyl</p>
              <span className="text-xs text-foreground/45">
                {vinyl?.name}
              </span>
            </div>
            <SwatchStrip
              vinyls={vinyls}
              selectedSku={sku}
              onSelect={selectVinyl}
              pendingSkus={
                mode === "custom"
                  ? [generatingSku, queuedSku].filter(
                      (pending): pending is string => pending !== null,
                    )
                  : []
              }
            />
            {vinyl?.blurb && (
              <p className="mt-3 text-sm leading-relaxed text-foreground/55">
                {vinyl.blurb}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile action bar — pinned like the quote wizard's CTA, with the
          money button always one thumb away */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-foreground/10 bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] tablet:hidden">
        {showCompare ? (
          <button
            type="button"
            onClick={() => setComparePair(null)}
            className="min-h-[44px] flex-1 cursor-pointer border border-foreground/20 px-3 text-sm font-bold"
          >
            Back to single view
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={busy}
            aria-label="Compare"
            className="flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 border border-foreground/20 px-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Columns2 size={16} />
            Compare
          </button>
        )}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!canDownload}
          aria-label="Download image"
          className="flex min-h-[44px] cursor-pointer items-center justify-center border border-foreground/20 px-3.5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Download size={16} />
        </button>
        <button
          type="button"
          onClick={() => setQuoteOpen(true)}
          className="btn-wipe min-h-[44px] flex-1 cursor-pointer px-3 text-sm font-bold text-foreground"
        >
          Get a quote
        </button>
      </div>

      <ComparePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        loadItems={loadCompareItems}
        preselectedId={
          mode === "stock"
            ? stockCombo
              ? `stock:${layout.id}:${sku}`
              : null
            : photo && renders[sku]
              ? `${photo.hash}:${sku}`
              : null
        }
        onCompare={startCompare}
      />

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onPick={openFromHistory}
        currentKey={
          mode === "custom" && photo && renders[sku]
            ? `${photo.hash}:${sku}`
            : null
        }
      />

      <QuoteDialog
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        vinylName={vinyl?.name ?? ""}
        context={{ vinylSku: sku, mode, layoutId }}
        getImage={getQuoteImage}
      />
    </div>
  );
}
