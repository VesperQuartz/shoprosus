import { z } from "zod";

export const envSchema = z.object({
  dbUrl: z.string(),
  dbAuthToken: z.string().optional(),
  authSecret: z.string(),
  jwtSecret: z.string(),
  googleId: z.string(),
  googleSecret: z.string(),
  gitHubId: z.string(),
  gitHubSecret: z.string(),
  mailPass: z.string(),
  mail: z.string(),
  payStackSecret: z.string(),
  neo4jUri: z.string(),
  neo4jUsername: z.string(),
  neo4jPassword: z.string(),
});

export const env = envSchema.parse({
  dbUrl: process.env.TURSO_DATABASE_URL || "",
  dbAuthToken: process.env.TURSO_AUTH_TOKEN,
  authSecret: process.env.BETTER_AUTH_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || "",
  googleId: process.env.GOOGLE_CLIENTID || "",
  googleSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  gitHubId: process.env.GITHUB_ID || "",
  gitHubSecret: process.env.GITHUB_SECRET || "",
  mailPass: process.env.MAIL_SECRET || "",
  mail: process.env.GMAIL || "",
  payStackSecret: process.env.PAYSTACK_SECRET || "",
  neo4jUri: process.env.NEO4J_URI || "",
  neo4jUsername: process.env.NEO4J_USERNAME || "",
  neo4jPassword: process.env.NEO4J_PASSWORD || "",
});
