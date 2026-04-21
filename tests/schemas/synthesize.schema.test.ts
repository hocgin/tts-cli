import { describe, it, expect } from "vitest";
import { synthesizeSchema } from "../../src/schemas/synthesize.schema.js";

describe("synthesizeSchema", () => {
  const validInput = {
    text: "Hello world",
    voice: "en-US-AriaNeural",
    rate: "+0%",
    volume: "+0%",
    pitch: "+0Hz",
  };

  it("should accept valid input", () => {
    const result = synthesizeSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject empty text", () => {
    const result = synthesizeSchema.safeParse({ ...validInput, text: "" });
    expect(result.success).toBe(false);
  });

  it("should accept positive rate", () => {
    const result = synthesizeSchema.safeParse({ ...validInput, rate: "+50%" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid rate format", () => {
    const result = synthesizeSchema.safeParse({ ...validInput, rate: "50" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid pitch format", () => {
    const result = synthesizeSchema.safeParse({
      ...validInput,
      pitch: "+5",
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional proxy", () => {
    const result = synthesizeSchema.safeParse({
      ...validInput,
      proxy: "http://proxy.example.com:8080",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid proxy URL", () => {
    const result = synthesizeSchema.safeParse({
      ...validInput,
      proxy: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
