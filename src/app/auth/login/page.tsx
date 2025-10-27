"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Tab = "signIn" | "signUp";

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
            <TabsList>
              <TabsTrigger value="signIn">Entrar</TabsTrigger>
              <TabsTrigger value="signUp">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signIn">
              <Card>
                <CardHeader className="text-2xl font-bold">
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>Faça login para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                  <SignInForm />
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
          </Tabs>
        </div>
      )}
    </div>
  );
}
