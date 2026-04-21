import { z } from "zod";

const rateSchema = z
  .string()
  .regex(
    /^[+-]\d+%$/,
    'Rate must be in format "+50%" or "-20%"',
  );

const volumeSchema = z
  .string()
  .regex(
    /^[+-]\d+%$/,
    'Volume must be in format "+50%" or "-20%"',
  );

const pitchSchema = z
  .string()
  .regex(
    /^[+-]\d+Hz$/,
    'Pitch must be in format "+5Hz" or "-5Hz"',
  );

export const synthesizeSchema = z.object({
  text: z.string().min(1, "Text is required"),
  voice: z.string().min(1, "Voice is required"),
  rate: rateSchema,
  volume: volumeSchema,
  pitch: pitchSchema,
  proxy: z.string().url().optional(),
});

export type SynthesizeSchemaInput = z.input<typeof synthesizeSchema>;
