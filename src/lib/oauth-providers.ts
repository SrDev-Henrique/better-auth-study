/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import GithubIcon from "@/components/icons/github-icon";
import GoogleIcon from "@/components/icons/google-icon";

export const SUPPORTED_OAUTH_PROVIDERS = ["google", "github"] as const;
export type SupportedOAuthProviders =
  (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS = [
  {
    name: "google",
    icon: GoogleIcon,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  {
    name: "github",
    icon: GithubIcon,
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
] as const;
