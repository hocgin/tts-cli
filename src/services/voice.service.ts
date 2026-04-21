import { listVoices } from "edge-tts-universal";
import { SynthesisError } from "../utils/errors.js";
import type { VoiceInfo } from "../types/tts.types.js";

/**
 * Fetch all available voices from the Edge TTS service.
 */
export async function fetchVoices(
  proxy?: string,
  locale?: string,
): Promise<ReadonlyArray<VoiceInfo>> {
  try {
    const voices = await listVoices(proxy);

    let filtered = voices;
    if (locale) {
      const normalizedLocale = locale.toLowerCase();
      filtered = voices.filter((v) =>
        v.Locale.toLowerCase().startsWith(normalizedLocale),
      );
    }

    return filtered.map((v) => ({
      name: v.ShortName,
      locale: v.Locale,
      gender: v.Gender,
    }));
  } catch (error) {
    throw new SynthesisError("Failed to fetch voice list", error);
  }
}
