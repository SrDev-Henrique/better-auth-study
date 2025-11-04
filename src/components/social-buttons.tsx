"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { SUPPORTED_OAUTH_PROVIDERS_DETAILS } from "@/lib/oauth-providers";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

export default function SocialButtons({ signIn }: { signIn?: boolean }) {
  const [isSubmitting, startTransition] = useTransition();
  const [signingInWith, setSigningInWith] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2 w-full">
      {SUPPORTED_OAUTH_PROVIDERS_DETAILS.map((provider, index) => {
        const icon = provider.icon();
        return (
          <Button
            key={provider.name}
            className={cn(
              index % 2 === 0
                ? "bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90"
                : "bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90",
            )}
            onClick={() =>
              startTransition(async () => {
                setSigningInWith(provider.name);
                authClient.signIn.social({
                  provider: provider.name,
                  callbackURL: "/",
                });
              })
            }
            disabled={isSubmitting}
          >
            <span className="pointer-events-none me-2 flex-1">
              {icon as React.ReactNode}
            </span>
            {signIn ? (
              signingInWith === provider.name ? (
                <Spinner />
              ) : (
                `Entrar com ${provider.name}`
              )
            ) : signingInWith === provider.name ? (
              <Spinner />
            ) : (
              `Criar conta com ${provider.name}`
            )}
          </Button>
        );
      })}
    </div>
  );
}
