import * as fs from "node:fs/promises";
import { synthesize as ttsSynthesize } from "../services/tts.service.js";
import { generateWebVtt } from "../utils/subtitle.js";
import { synthesizeSchema } from "../schemas/synthesize.schema.js";
import { ValidationError, SynthesisError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { readInput } from "../handlers/input.handler.js";

interface SynthesizeCommandOptions {
  readonly text?: string;
  readonly file?: string;
  readonly voice: string;
  readonly output: string;
  readonly writeSubtitles?: string;
  readonly rate: string;
  readonly volume: string;
  readonly pitch: string;
  readonly proxy?: string;
}

export async function synthesizeCommand(
  options: SynthesizeCommandOptions,
): Promise<void> {
  const inputText = await readInput(options.text, options.file);

  const parseResult = synthesizeSchema.safeParse({
    text: inputText,
    voice: options.voice,
    rate: options.rate,
    volume: options.volume,
    pitch: options.pitch,
    proxy: options.proxy,
  });

  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    throw new ValidationError(firstError.message);
  }

  const validated = parseResult.data;
  const result = await ttsSynthesize(validated);

  await fs.writeFile(options.output, result.audio);
  logger.info({ file: options.output, size: result.audio.length }, "Audio saved");

  if (options.writeSubtitles) {
    const vtt = generateWebVtt(result.wordBoundaries);
    await fs.writeFile(options.writeSubtitles, vtt);
    logger.info(
      { file: options.writeSubtitles, words: result.wordBoundaries.length },
      "Subtitles saved",
    );
  }
}
