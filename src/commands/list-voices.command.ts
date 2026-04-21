import { fetchVoices } from "../services/voice.service.js";
import { formatVoiceRow } from "../utils/format.js";
import { SynthesisError } from "../utils/errors.js";

export async function listVoicesCommand(
  locale?: string,
  proxy?: string,
): Promise<void> {
  const voices = await fetchVoices(proxy, locale);

  if (voices.length === 0) {
    const msg = locale
      ? `No voices found for locale: ${locale}`
      : "No voices available";
    throw new SynthesisError(msg);
  }

  const header = formatVoiceRow({
    name: "Name",
    locale: "Locale",
    gender: "Gender",
  });
  const separator = "-".repeat(header.length);

  const rows = voices.map((voice) => formatVoiceRow(voice));
  console.log(header);
  console.log(separator);
  for (const row of rows) {
    console.log(row);
  }
  console.log(`\nTotal: ${voices.length} voices`);
}
