"use client";

import SignInSignOutButton from "@/components/sign-in-sign-out-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {session === null ? (
        <SignInSignOutButton />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-muted-foreground">
            Bem-vindo,{" "}
            <span className="text-foreground">{session.user?.name}</span>
          </h1>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => authClient.signOut()}
          >
            Sair
          </Button>
        </>
      )}
    </div>
  );
}
