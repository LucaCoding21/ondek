/**
 * Server-side generation ledger. One JSON line per attempt, so monthly
 * spend vs the included allotment is checkable with `wc -l` or a spreadsheet,
 * and the monthly hard cap has something durable to count against.
 *
 * Storage is a local JSONL file (.data/visualizer/usage.jsonl — gitignored).
 * On serverless hosting the filesystem is ephemeral, so before launch this
 * should point at a durable store; every read/write goes through the two
 * functions below, so that swap touches only this file.
 */

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { LIMITS } from "@/config/visualizer";

const LOG_DIR = path.join(process.cwd(), ".data", "visualizer");
const LOG_FILE = path.join(LOG_DIR, "usage.jsonl");

export type UsageEntry = {
  /** ISO timestamp */
  at: string;
  /** sha256 prefix of the caller's IP — never the raw address */
  ip: string;
  sku: string;
  /** "custom" or a stock layout id (the stock-combo script logs too) */
  source: string;
  success: boolean;
  latencyMs: number;
  error?: string;
};

export async function logGeneration(entry: UsageEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, JSON.stringify(entry) + "\n");
  } catch (error) {
    // A logging failure must never take down a render
    console.error("[visualizer] usage log write failed:", error);
  }
}

/** Successful renders so far in the given month (defaults to now) */
export async function monthlyCount(now = new Date()): Promise<number> {
  const prefix = now.toISOString().slice(0, 7); // "2026-08"
  try {
    const raw = await readFile(LOG_FILE, "utf8");
    let count = 0;
    for (const line of raw.split("\n")) {
      if (!line) continue;
      try {
        const entry = JSON.parse(line) as UsageEntry;
        if (entry.success && entry.at.startsWith(prefix)) count++;
      } catch {
        // a torn line never blocks the count
      }
    }
    return count;
  } catch {
    return 0; // no log yet
  }
}

/** True when the monthly hard cap has been reached */
export async function monthlyCapReached(): Promise<boolean> {
  return (await monthlyCount()) >= LIMITS.monthlyCap;
}
