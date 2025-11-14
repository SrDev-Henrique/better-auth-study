import { headers } from "next/headers";
import ChangePasswordForm from "@/components/forms/change-password-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import SetPasswordButton from "../set-password-button";
import TwoFactorAuth from "../two-factor-auth";

export default async function SecurityTab({
  email,
  isTwoFactorEnabled,
}: {
  email: string;
  isTwoFactorEnabled: boolean;
}) {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const hasPasswordAccount = accounts.some(
    (account) => account.providerId === "credential",
  );
  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle className="w-full max-w-md mx-auto">
              Mudar senha
            </CardTitle>
            <CardDescription className="w-full max-w-md mx-auto">
              Mude sua senha para proteger sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="w-full max-w-md mx-auto">
              Adicionar senha
            </CardTitle>
            <CardDescription className="w-full max-w-md mx-auto">
              Adicione uma senha para proteger sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center">
              <SetPasswordButton email={email} />
            </div>
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <Card>
          <CardHeader className="flex items-center justify-between gap-2 w-full max-w-md mx-auto px-0">
            <CardTitle>Autenticação de dois fatores</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "outline"}>
              {isTwoFactorEnabled ? "Ativado" : "Desativado"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
