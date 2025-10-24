"use client";

import { Button } from "@/components/ui/button";
import { SUPPORTED_OAUTH_PROVIDERS_DETAILS } from "@/lib/oauth-providers";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Toast from "./toaster";
import { useTransition } from "react";

export default function SocialButtons({ signIn }: { signIn?: boolean }) {
  const [isSubmitting, startTransition] = useTransition();
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
                : "bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90"
            )}
            onClick={() =>
              startTransition(async () => {
                authClient.signIn.social(
                  {
                    provider: provider.name,
                    callbackURL: "/",
                  },
                  {
                    onSuccess: () => {
                      toast.custom((t) => (
                        <Toast
                          message={
                            signIn
                              ? "Entrou com sucesso"
                              : "Conta criada com sucesso"
                          }
                          onClick={() => toast.dismiss(t)}
                        />
                      ));
                    },
                  }
                );
              })
            }
            disabled={isSubmitting}
          >
            <span className="pointer-events-none me-2 flex-1">
              {icon as React.ReactNode}
            </span>
            {signIn
              ? `Entrar com ${provider.name}`
              : `Criar conta com ${provider.name}`}
          </Button>
        );
      })}
    </div>
  );
}
