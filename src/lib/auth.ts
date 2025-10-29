/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/drizzle/db";
import { sendResetPassword } from "./send-reset-password";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPassword({ user, url });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
