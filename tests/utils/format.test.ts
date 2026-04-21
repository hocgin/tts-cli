import { describe, it, expect } from "vitest";
import { ticksToMs, formatVttTime, formatVoiceRow } from "../../src/utils/format.js";

describe("ticksToMs", () => {
  it("should convert 100-nanosecond ticks to milliseconds", () => {
    expect(ticksToMs(10000)).toBe(1);
    expect(ticksToMs(100000)).toBe(10);
    expect(ticksToMs(0)).toBe(0);
    expect(ticksToMs(5000)).toBe(1); // rounds up
  });
});

describe("formatVttTime", () => {
  it("should format zero milliseconds", () => {
    expect(formatVttTime(0)).toBe("00:00:00.000");
  });

  it("should format time with all components", () => {
    expect(formatVttTime(3661500)).toBe("01:01:01.500");
  });

  it("should format sub-second time", () => {
    expect(formatVttTime(475)).toBe("00:00:00.475");
  });

  it("should format minutes only", () => {
    expect(formatVttTime(60000)).toBe("00:01:00.000");
  });
});

describe("formatVoiceRow", () => {
  it("should format voice info into aligned columns", () => {
    const row = formatVoiceRow({
      name: "en-US-AriaNeural",
      locale: "en-US",
      gender: "Female",
    });
    expect(row).toContain("en-US-AriaNeural");
    expect(row).toContain("en-US");
    expect(row).toContain("Female");
  });
});
