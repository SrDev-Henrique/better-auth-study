"use client";

import { KeyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import Toast from "@/components/toaster";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";

export default function PasskeyButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess: () => {
          refetch();
          router.push("/");
        },
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao usar passkey"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }, [router, refetch]);

  return (
    <BetterAuthActionButton
      variant="outline"
      className="w-full"
      action={() => {
        return authClient.signIn.passkey(undefined, {
          onSuccess: () => {
            refetch();
            router.push("/");
          },
          onError: (error) => {
            toast.custom((t) => (
              <Toast
                error={true}
                message="Erro ao usar passkey"
                errorMessage={translateAuthError(error)}
                onClick={() => toast.dismiss(t)}
              />
            ));
          },
        });
      }}
    >
      <KeyIcon /> Usar passkey
    </BetterAuthActionButton>
  );
}
