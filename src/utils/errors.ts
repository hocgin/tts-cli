export class TtsCliError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "TtsCliError";
  }
}

export class ValidationError extends TtsCliError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class InputError extends TtsCliError {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

export class SynthesisError extends TtsCliError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "SynthesisError";
  }
}
