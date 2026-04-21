import { describe, it, expect } from "vitest";
import { generateWebVtt } from "../../src/utils/subtitle.js";
import type { WordBoundary } from "../../src/types/tts.types.js";

describe("generateWebVtt", () => {
  it("should generate valid WebVTT header", () => {
    const vtt = generateWebVtt([]);
    expect(vtt.startsWith("WEBVTT")).toBe(true);
    expect(vtt).toContain("WEBVTT");
  });

  it("should generate cue entries from word boundaries", () => {
    const boundaries: ReadonlyArray<WordBoundary> = [
      { offset: 1000000, duration: 500000, text: "Hello" },
      { offset: 2000000, duration: 300000, text: "world" },
    ];

    const vtt = generateWebVtt(boundaries);
    const lines = vtt.split("\n");

    expect(lines[0]).toBe("WEBVTT");
    expect(lines).toContain("1");
    // 1000000 ticks = 100ms, 500000 ticks = 50ms, 2000000 ticks = 200ms, 300000 ticks = 30ms
    expect(lines).toContain("00:00:00.100 --> 00:00:00.150");
    expect(lines).toContain("Hello");
    expect(lines).toContain("2");
    expect(lines).toContain("00:00:00.200 --> 00:00:00.230");
    expect(lines).toContain("world");
  });

  it("should handle single boundary", () => {
    const boundaries: ReadonlyArray<WordBoundary> = [
      { offset: 1000000, duration: 500000, text: "Test" },
    ];

    const vtt = generateWebVtt(boundaries);
    expect(vtt).toContain("WEBVTT");
    expect(vtt).toContain("1");
    expect(vtt).toContain("Test");
  });
});
