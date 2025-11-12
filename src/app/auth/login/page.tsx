"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ForgotPasswordForm from "@/components/forgot-password";
import SignInForm from "@/components/forms/sign-in-form";
import SignUpForm from "@/components/forms/sign-up-form";
import SocialButtons from "@/components/social-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";

type Tab = "signIn" | "signUp" | "forgot-password";

export default function LoginPage() {
  const router = useRouter();

  const { data: session, isPending: loading } = authClient.useSession();

  const [selectedTab, setSelectedTab] = useState<Tab>("signIn");

  useEffect(() => {
    if (!loading && session !== null) {
      router.replace("/");
    }
  }, [loading, session, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      {session !== null || loading ? (
        <Spinner />
      ) : (
        <div className="max-w-md w-full mx-auto">
          <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as Tab)}
          >
            {(selectedTab === "signIn" || selectedTab === "signUp") && (
              <TabsList>
                <TabsTrigger value="signIn">Entrar</TabsTrigger>
                <TabsTrigger value="signUp">Criar conta</TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="signIn">
              <Card>
                <CardHeader className="text-2xl font-bold">
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>Faça login para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                  <SignInForm
                    openForgotPasswordTab={() =>
                      setSelectedTab("forgot-password")
                    }
                  />
                </CardContent>

                <Separator />

                <CardFooter className="flex flex-col gap-5">
                  <SocialButtons signIn={true} />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="signUp">
              <Card>
                <CardHeader className="text-2xl font-bold">
                  <CardTitle>Criar conta</CardTitle>
                  <CardDescription>
                    Crie uma conta para continuar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUpForm />
                </CardContent>
                <CardFooter className="flex flex-col gap-5">
                  <Separator />
                  <SocialButtons />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="forgot-password">
              <Card>
                <CardHeader className="text-2xl font-bold">
                  <CardTitle>Recuperar senha</CardTitle>
                  <CardDescription>
                    Digite seu email para receber um link de recuperação de
                    senha
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ForgotPasswordForm
                    openSignInTab={() => setSelectedTab("signIn")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
