import { formatVttTime, ticksToMs } from "./format.js";
import type { WordBoundary } from "../types/tts.types.js";

/**
 * Generate WebVTT content from word boundary data.
 */
export function generateWebVtt(
  wordBoundaries: ReadonlyArray<WordBoundary>,
): string {
  const lines: string[] = ["WEBVTT", ""];

  for (let i = 0; i < wordBoundaries.length; i++) {
    const boundary = wordBoundaries[i];
    const startMs = ticksToMs(boundary.offset);
    const endMs = startMs + ticksToMs(boundary.duration);
    const startTime = formatVttTime(startMs);
    const endTime = formatVttTime(endMs);

    lines.push(String(i + 1));
    lines.push(`${startTime} --> ${endTime}`);
    lines.push(boundary.text);
    lines.push("");
  }

  return lines.join("\n");
}
