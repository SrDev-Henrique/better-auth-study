/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { findIp } from "@arcjet/ip";
import arcjet, {
  type BotOptions,
  detectBot,
  type EmailOptions,
  protectSignup,
  type SlidingWindowRateLimitOptions,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

const ARCJET_MODE = (
  process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN"
) as "LIVE" | "DRY_RUN";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [
    shield({
      mode: ARCJET_MODE,
    }),
  ],
});

const botSettings = {
  mode: ARCJET_MODE,
  allow: [],
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: ARCJET_MODE,
  max: 10,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: ARCJET_MODE,
  max: 60,
  interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: ARCJET_MODE,
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request: Request) {
  const clonedRequest = request.clone();
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return Response.json(
        { message: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429 },
      );
    }
    if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "E-mail inválido";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "O domínio do e-mail é inválido";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "E-mail temporário não permitido";
      } else {
        message = "E-mail não permitido";
      }
      return Response.json(
        {
          message,
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          message: "Acesso bloqueado por proteção anti-bot",
        },
        { status: 400 },
      );
    }
  }

  return authHandlers.POST(clonedRequest);
}

async function checkArcjet(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userIdOrIp = session?.user?.id ?? (findIp(request) || "127.0.0.1");

  if (request.url.endsWith("/auth/sign-up")) {
    let body: unknown = null;

    try {
      body = (await request.json()) as unknown;
    } catch {
      // Some requests may not have a JSON body; ignore parse errors here
    }

    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          }),
        )
        .protect(request, { email: body.email, userIdOrIp });
    }
  } else {
    return aj
      .withRule(detectBot(botSettings))
      .withRule(slidingWindow(restrictiveRateLimitSettings))
      .protect(request, { userIdOrIp });
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp });
}
