/**
 * Convert 100-nanosecond ticks to milliseconds.
 */
export function ticksToMs(ticks: number): number {
  return Math.round(ticks / 10000);
}

/**
 * Format milliseconds to WebVTT timestamp (HH:MM:SS.mmm).
 */
export function formatVttTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;

  const pad = (n: number, digits: number = 2): string =>
    String(n).padStart(digits, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`;
}

/**
 * Format a voice info into a display row.
 */
export function formatVoiceRow(voice: {
  readonly name: string;
  readonly locale: string;
  readonly gender: string;
}): string {
  const name = voice.name.padEnd(40);
  const locale = voice.locale.padEnd(10);
  const gender = voice.gender.padEnd(10);
  return `${name} ${locale} ${gender}`;
}
