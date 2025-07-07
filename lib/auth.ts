import { betterAuth } from "better-auth";
import { db } from "./database";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env/server";
import { sendVerificationEmail } from "@/services/auth";

export const auth = betterAuth({
  rateLimit: {
    window: 10,
    max: 100,
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.googleId,
      clientSecret: env.googleSecret,
    },
    github: {
      clientId: env.gitHubId,
      clientSecret: env.gitHubSecret,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(url);
      await sendVerificationEmail({
        reciever: user.email,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth${url}`,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  plugins: [nextCookies()],
});
