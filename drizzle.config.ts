import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./env/server";

export default defineConfig({
  out: "./migrations",
  schema: "./repo/schema",
  dialect: "turso",
  dbCredentials: {
    url: env.dbUrl,
    authToken: env.dbAuthToken,
  },
});
