import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/repo/schema/schema";
import * as authschema from "@/repo/schema/auth.schema";
import { env } from "@/env/server";

const client = createClient({
  url: env.dbUrl,
  authToken: env.dbAuthToken,
});

export const db = drizzle({
  client,
  logger: true,
  schema: { ...authschema, ...schema },
});
