import { env } from "@/env/client";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: env.baseUrl,
});
