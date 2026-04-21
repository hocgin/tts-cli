export interface SynthesizeOptions {
  readonly text: string;
  readonly voice: string;
  readonly rate: string;
  readonly volume: string;
  readonly pitch: string;
  readonly proxy?: string;
}

export interface WordBoundary {
  readonly offset: number;
  readonly duration: number;
  readonly text: string;
}

export interface SynthesizeResult {
  readonly audio: Buffer;
  readonly wordBoundaries: ReadonlyArray<WordBoundary>;
}

export interface VoiceInfo {
  readonly name: string;
  readonly locale: string;
  readonly gender: string;
}

export type TtsChunk =
  | { readonly type: "audio"; readonly data: Buffer }
  | {
      readonly type: "WordBoundary";
      readonly offset: number;
      readonly duration: number;
      readonly text: string;
    };
