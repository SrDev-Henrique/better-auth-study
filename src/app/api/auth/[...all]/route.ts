/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { findIp } from "@arcjet/ip";
import arcjet, {
  type BotOptions,
  type EmailOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

const botSettings = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "10min",
} satisfies SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1min",
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request: Request) {
  const clonedRequest = request.clone();
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response("Rate limited", { status: 429 });
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
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          message: "Erro desconhecido",
        },
        { status: 400 }
      );
    }
  }

  return authHandlers.POST(clonedRequest);
}

async function checkArcjet(request: Request) {
  const body = (await request.json()) as unknown;

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userIdOrIp = session?.user?.id ?? (findIp(request) || "127.0.0.1");

  if (request.url.endsWith("/auth/sign-up")) {
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
          })
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
