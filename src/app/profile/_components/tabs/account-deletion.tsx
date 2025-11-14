"use client";

import { toast } from "sonner";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import Toast from "@/components/toaster";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";

export default function AccountDeletion() {
  function handleAccountDeletion() {
    return authClient.deleteUser(
      {
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Email de confirmação para deletar conta enviado com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao enviar email de confirmação para deletar conta"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }
  return (
    <BetterAuthActionButton
      className="w-full"
      action={handleAccountDeletion}
      variant="destructive"
      requireAreYouSure={true}
      areYouSureDescription="Esta ação é irreversível e irá deletar sua conta permanentemente."
      areYouSureConfirmMessage="Deletar conta permanentemente"
    >
      Deletar conta permanentemente
    </BetterAuthActionButton>
  );
}
