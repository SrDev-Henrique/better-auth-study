/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/drizzle/db";
import { sendResetPassword } from "../email/send-reset-password";
import { sendWelcomeEmail } from "../email/send-welcome-email";

export const auth = betterAuth({
  user: {
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true,
      },
    },
  },
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
      mapProfileToUser: () => {
        return {
          favoriteNumber: 0,
        };
      },
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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };
        if (user !== null) {
          await sendWelcomeEmail({ user: user });
        }
      }
    }),
  },
});
