/**
 * Sliding-window per-IP limiter for the generate route. In-memory on
 * purpose: renders cost ~15s each, so a scripted abuser is throttled long
 * before instance recycling matters, and Fluid Compute keeps instances
 * warm across requests. The durable backstop is the monthly cap in
 * usage.ts, which survives restarts.
 */

import { createHash } from "node:crypto";
import { LIMITS } from "@/config/visualizer";

const windows = new Map<string, number[]>();

/** IPs are only ever handled hashed — the raw address is never stored */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

/** Returns true when this request is allowed, and records it if so */
export function allowRequest(ipHash: string, now = Date.now()): boolean {
  const cutoff = now - LIMITS.ipWindowMs;
  const seen = (windows.get(ipHash) ?? []).filter((t) => t > cutoff);

  if (seen.length >= LIMITS.ipWindowMax) {
    windows.set(ipHash, seen);
    return false;
  }

  seen.push(now);
  windows.set(ipHash, seen);

  // Cheap housekeeping so the map can't grow without bound
  if (windows.size > 5000) {
    for (const [key, times] of windows) {
      if (times.every((t) => t <= cutoff)) windows.delete(key);
    }
  }

  return true;
}
