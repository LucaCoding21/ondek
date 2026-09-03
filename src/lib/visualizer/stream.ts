/**
 * The wire format between /api/visualizer/generate and the stage when a
 * render streams: newline-delimited JSON, one message per line. Shared by
 * the route (writer) and VisualizerExperience (reader); nothing here is
 * server-only.
 */

export type GenerateStreamMessage =
  | {
      /** A shrunken intermediate frame — a colour wash, not a design */
      type: "partial";
      /** data: URL, tiny (96px WebP) */
      image: string;
      index: number;
    }
  | {
      type: "done";
      /** data: URL of the finished render (WebP) */
      image: string;
      /** Renders left in today's session */
      remaining: number;
    }
  | {
      type: "error";
      /** Same codes the JSON failure path uses */
      error: string;
      message: string;
    };

export const STREAM_CONTENT_TYPE = "application/x-ndjson";

/**
 * Reads an NDJSON body message by message. Lines that don't parse are
 * skipped rather than fatal — a torn line at a dropped connection should
 * surface as "no done message", not as a JSON exception.
 */
export async function readNdjson<T>(
  response: Response,
  onMessage: (message: T) => void | Promise<void>,
): Promise<void> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const flush = async (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parsed: T;
    try {
      parsed = JSON.parse(trimmed) as T;
    } catch {
      return;
    }
    await onMessage(parsed);
  };
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      await flush(line);
    }
  }
  await flush(buffer);
}
