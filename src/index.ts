import { Command } from "commander";
import { listVoicesCommand } from "./commands/list-voices.command.js";
import { synthesizeCommand } from "./commands/synthesize.command.js";
import { logger } from "./utils/logger.js";
import { TtsCliError } from "./utils/errors.js";

const program = new Command();

program
  .name("tts")
  .description("TTS CLI tool powered by Edge TTS")
  .version("1.0.0");

program
  .option("--text <text>", "Text to synthesize")
  .option("--file <file>", "Read text from file")
  .option("--voice <voice>", "Voice name", "en-US-AriaNeural")
  .option("-o, --output <file>", "Output audio file path")
  .option("--write-subtitles <file>", "Output WebVTT subtitle file")
  .option("--rate <rate>", "Speech rate (e.g. +50%, -20%)", "+0%")
  .option("--volume <volume>", "Volume (e.g. +50%, -20%)", "+0%")
  .option("--pitch <pitch>", "Pitch (e.g. +5Hz, -5Hz)", "+0Hz")
  .option("--proxy <url>", "Proxy server URL")
  .option("--list-voices [locale]", "List available voices")
  .option("-v, --verbose", "Verbose logging");

program.action(async (options) => {
  if (options.verbose) {
    logger.level = "debug";
  }

  try {
    if (options.listVoices !== undefined) {
      await listVoicesCommand(
        typeof options.listVoices === "string" ? options.listVoices : undefined,
        options.proxy,
      );
      return;
    }

    if (!options.output) {
      program.error("Option --output is required for synthesis");
      return;
    }

    await synthesizeCommand({
      text: options.text,
      file: options.file,
      voice: options.voice,
      output: options.output,
      writeSubtitles: options.writeSubtitles,
      rate: options.rate,
      volume: options.volume,
      pitch: options.pitch,
      proxy: options.proxy,
    });
  } catch (error) {
    if (error instanceof TtsCliError) {
      process.stderr.write(`Error: ${error.message}\n`);
      process.exit(1);
    }
    throw error;
  }
});

program.parse();
