import { z } from "zod";

export const envSchema = z.object({
  baseUrl: z.string(),
});

export const env = envSchema.parse({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
});
