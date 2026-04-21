import {
  Communicate,
  createVTT as edgeCreateVtt,
  type TTSChunk,
  type WordBoundary,
} from "edge-tts-universal";
import { SynthesisError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import type { SynthesizeOptions, SynthesizeResult } from "../types/tts.types.js";

/**
 * Synthesize text to audio using edge-tts-universal stream mode.
 * Returns audio buffer and word boundaries for subtitle generation.
 */
export async function synthesize(
  options: SynthesizeOptions,
): Promise<SynthesizeResult> {
  const { text, voice, rate, volume, pitch, proxy } = options;

  logger.info({ voice, rate, volume, pitch }, "Starting synthesis");

  const communicate = new Communicate(text, {
    voice,
    rate,
    volume,
    pitch,
    proxy,
  });

  const audioChunks: Buffer[] = [];
  const wordBoundaries: WordBoundary[] = [];

  try {
    for await (const chunk of communicate.stream()) {
      if (chunk.type === "audio" && chunk.data) {
        audioChunks.push(chunk.data);
      } else if (
        chunk.type === "WordBoundary" &&
        chunk.offset !== undefined &&
        chunk.duration !== undefined &&
        chunk.text !== undefined
      ) {
        wordBoundaries.push({
          offset: chunk.offset,
          duration: chunk.duration,
          text: chunk.text,
        });
      }
    }
  } catch (error) {
    throw new SynthesisError("TTS synthesis failed", error);
  }

  if (audioChunks.length === 0) {
    throw new SynthesisError("No audio data received from TTS engine");
  }

  logger.info(
    { audioSize: audioChunks.length, words: wordBoundaries.length },
    "Synthesis complete",
  );

  return {
    audio: Buffer.concat(audioChunks),
    wordBoundaries,
  };
}
