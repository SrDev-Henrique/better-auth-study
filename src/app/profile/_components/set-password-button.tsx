"use client";

import { useState } from "react";
import { toast } from "sonner";
import Toast from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";

export default function SetPasswordButton({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  async function handleSetPassword() {
    setIsLoading(true);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: "/auth/add-password",
      });
      toast.custom((t) => (
        <Toast
          message="Link de adição de senha enviado com sucesso"
          onClick={() => toast.dismiss(t)}
        />
      ));
      setIsLoading(false);
    } catch (error) {
      toast.custom((t) => (
        <Toast
          error={true}
          message="Erro ao adicionar senha"
          errorMessage={translateAuthError(
            error as unknown as { error?: { code?: string; message?: string } },
          )}
          onClick={() => toast.dismiss(t)}
        />
      ));
      setIsLoading(false);
    }
  }
  return (
    <Button className="w-full max-w-md" onClick={handleSetPassword}>
      {isLoading ? <Spinner /> : "Adicionar senha"}
    </Button>
  );
}
