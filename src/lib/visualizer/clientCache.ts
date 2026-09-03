/**
 * Client-side render cache for Custom Mode. Renders are Blobs keyed by
 * `hash(uploadedPhotoBytes):sku` in IndexedDB — large enough for images,
 * survives vinyl switching AND a page refresh. The uploaded photo itself
 * is stored under the same hash so a refreshed page can pick up exactly
 * where the visitor left off.
 *
 * Every call degrades to a no-op when storage is unavailable (private
 * windows, blocked site data): a cache miss just means one more render.
 */

const DB_NAME = "ondek-visualizer";
const STORE = "renders";
const LAST_PHOTO_KEY = "odk-viz-last-photo";

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function idbGet(key: string): Promise<Blob | null> {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) return resolve(null);
        try {
          const request = db
            .transaction(STORE, "readonly")
            .objectStore(STORE)
            .get(key);
          request.onsuccess = () =>
            resolve(request.result instanceof Blob ? request.result : null);
          request.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      }),
  );
}

function idbPut(key: string, value: Blob): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) return resolve();
        try {
          const tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).put(value, key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      }),
  );
}

function idbDelete(key: string): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) return resolve();
        try {
          const tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).delete(key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      }),
  );
}

function idbKeys(): Promise<string[]> {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) return resolve([]);
        try {
          const request = db
            .transaction(STORE, "readonly")
            .objectStore(STORE)
            .getAllKeys();
          request.onsuccess = () =>
            resolve(request.result.filter((k): k is string => typeof k === "string"));
          request.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      }),
  );
}

/**
 * Hex digest of the uploaded photo's bytes — the cache key's first half.
 * SHA-256 via WebCrypto where it exists. `crypto.subtle` is only defined
 * on secure origins (https or localhost), so a plain http:// page (a phone
 * on the LAN hitting the dev server, a misconfigured proxy) falls back to
 * a 64-bit FNV-1a: plenty for keying one device's own uploads, and it
 * keeps the upload working instead of throwing before anything shows.
 */
export async function hashBytes(bytes: ArrayBuffer): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Two 32-bit FNV-1a lanes with different seeds → 16 hex chars, which
  // is what listHistory()'s key regex expects (hex only, no prefix)
  const view = new Uint8Array(bytes);
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < view.length; i++) {
    a = Math.imul(a ^ view[i], 0x01000193);
    b = Math.imul(b ^ view[i], 0x0100019b);
  }
  return (
    (a >>> 0).toString(16).padStart(8, "0") +
    (b >>> 0).toString(16).padStart(8, "0")
  );
}

export function getRender(photoHash: string, sku: string) {
  return idbGet(`render:${photoHash}:${sku}`);
}

export function putRender(photoHash: string, sku: string, blob: Blob) {
  return idbPut(`render:${photoHash}:${sku}`, blob);
}

/** Skus already rendered for this photo — powers the swatch checkmarks */
export async function renderedSkus(photoHash: string): Promise<Set<string>> {
  const prefix = `render:${photoHash}:`;
  const keys = await idbKeys();
  return new Set(
    keys.filter((k) => k.startsWith(prefix)).map((k) => k.slice(prefix.length)),
  );
}

// ── Render history ──────────────────────────────────────────────────────
// The ordered list behind the "My designs" panel. Blobs live in IndexedDB;
// this is just the ordering and timestamps, so localStorage is enough.

const HISTORY_KEY = "odk-viz-history";

export type HistoryEntry = {
  hash: string;
  sku: string;
  /** ms epoch; 0 for renders that predate history tracking */
  at: number;
};

export function recordHistory(hash: string, sku: string) {
  try {
    const list = readHistoryList().filter(
      (entry) => !(entry.hash === hash && entry.sku === sku),
    );
    list.push({ hash, sku, at: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(-60)));
  } catch {
    // storage blocked — the render itself still cached in IndexedDB
  }
  // Blobs whose history entry aged out get cleaned up in the background
  void pruneCache();
}

/**
 * Deletes render blobs no longer referenced by the history list, and photo
 * blobs referenced by nothing. Safe to call any time; listHistory() has
 * persisted legacy renders into the list before this ever runs.
 */
async function pruneCache() {
  try {
    const list = readHistoryList();
    const keepRenders = new Set(
      list.map((entry) => `render:${entry.hash}:${entry.sku}`),
    );
    const keepHashes = new Set([
      ...list.map((entry) => entry.hash),
      ...readPhotoList(),
    ]);
    const last = localStorage.getItem(LAST_PHOTO_KEY);
    if (last) keepHashes.add(last);
    for (const key of await idbKeys()) {
      if (key.startsWith("render:") && !keepRenders.has(key)) {
        await idbDelete(key);
      } else if (key.startsWith("photo:") && !keepHashes.has(key.slice(6))) {
        await idbDelete(key);
      }
    }
  } catch {
    // pruning is best-effort
  }
}

function readHistoryList(): HistoryEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Every render the visitor has, newest first. Renders stored before
 *  history tracking existed are backfilled from the IndexedDB keys and
 *  persisted into the list, so pruning always sees them as referenced. */
export async function listHistory(): Promise<HistoryEntry[]> {
  const list = readHistoryList();
  let backfilled = false;
  for (const key of await idbKeys()) {
    const match = key.match(/^render:([0-9a-f]+):(.+)$/);
    if (
      match &&
      !list.some((entry) => entry.hash === match[1] && entry.sku === match[2])
    ) {
      list.push({ hash: match[1], sku: match[2], at: 0 });
      backfilled = true;
    }
  }
  if (backfilled) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(-60)));
    } catch {
      // storage blocked — backfill just repeats next time
    }
  }
  return list.sort((a, b) => b.at - a.at);
}

// ── The visitor's photos ────────────────────────────────────────────────
// Every upload is kept (blob in IndexedDB, order in localStorage) so the
// scene row can show them all, and a refresh lands back on the last one.

const PHOTOS_KEY = "odk-viz-photos";
/** Oldest uploads fall off the list past this; their blobs get pruned
 *  unless a history render still points at them */
const MAX_PHOTOS = 12;

function readPhotoList(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PHOTOS_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((h): h is string => typeof h === "string")
      : [];
  } catch {
    return [];
  }
}

export function getPhoto(photoHash: string) {
  return idbGet(`photo:${photoHash}`);
}

/** Marks a photo as the one on stage, for refresh survival */
export function setLastPhoto(photoHash: string) {
  try {
    localStorage.setItem(LAST_PHOTO_KEY, photoHash);
  } catch {
    // storage blocked — refresh survival off, everything else still works
  }
}

export function lastPhotoHash(): string | null {
  try {
    return localStorage.getItem(LAST_PHOTO_KEY);
  } catch {
    return null;
  }
}

/** Stores a photo and appends it to the list (re-uploads move to the end) */
export function putPhoto(photoHash: string, blob: Blob) {
  setLastPhoto(photoHash);
  try {
    const list = readPhotoList().filter((h) => h !== photoHash);
    list.push(photoHash);
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(list.slice(-MAX_PHOTOS)));
  } catch {
    // storage blocked — the photo still shows for this visit
  }
  return idbPut(`photo:${photoHash}`, blob);
}

/** Every photo the visitor has uploaded, oldest first */
export async function listPhotos(): Promise<{ hash: string; blob: Blob }[]> {
  const photos: { hash: string; blob: Blob }[] = [];
  for (const hash of readPhotoList()) {
    const blob = await idbGet(`photo:${hash}`);
    if (blob) photos.push({ hash, blob });
  }
  return photos;
}
