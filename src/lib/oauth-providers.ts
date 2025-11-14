/** biome-ignore-all lint/style/noNonNullAssertion: <because> */

import GithubIcon from "@/components/icons/github-icon";
import GoogleIcon from "@/components/icons/google-icon";

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "google"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: () => React.JSX.Element }
> = {
  google: { name: "Google", Icon: GoogleIcon },
  github: { name: "GitHub", Icon: GithubIcon },
};
