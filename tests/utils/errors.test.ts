import { describe, it, expect } from "vitest";
import {
  TtsCliError,
  ValidationError,
  InputError,
  SynthesisError,
} from "../../src/utils/errors.js";

describe("TtsCliError", () => {
  it("should set name and message", () => {
    const error = new TtsCliError("test error");
    expect(error.name).toBe("TtsCliError");
    expect(error.message).toBe("test error");
  });

  it("should store cause", () => {
    const cause = new Error("inner");
    const error = new TtsCliError("outer", cause);
    expect(error.cause).toBe(cause);
  });
});

describe("ValidationError", () => {
  it("should be instance of TtsCliError", () => {
    const error = new ValidationError("invalid");
    expect(error).toBeInstanceOf(TtsCliError);
    expect(error.name).toBe("ValidationError");
  });
});

describe("InputError", () => {
  it("should be instance of TtsCliError", () => {
    const error = new InputError("missing input");
    expect(error).toBeInstanceOf(TtsCliError);
    expect(error.name).toBe("InputError");
  });
});

describe("SynthesisError", () => {
  it("should be instance of TtsCliError", () => {
    const error = new SynthesisError("failed");
    expect(error).toBeInstanceOf(TtsCliError);
    expect(error.name).toBe("SynthesisError");
  });
});
