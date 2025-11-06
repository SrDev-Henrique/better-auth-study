import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth/auth";
import { ArrowLeft, Trash2, LinkIcon, Key, Shield, User } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileUpdateForm from "./_components/profile-update-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers()})

  if (session === null) redirect("/auth/login")

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Voltar para a home
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>
              {/* <Badge>{session.user.role}</Badge> */}
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm:hidden">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield />
            <span className="max-sm:hidden">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key />
            <span className="max-sm:hidden">Sessões</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className="max-sm:hidden">Contas</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Trash2 />
            <span className="max-sm:hidden">Deletar conta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="max-w-md w-full mx-auto">
            <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          {/* <LoadingSuspense>
            <SecurityTab
              email={session.user.email}
              isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
            />
          </LoadingSuspense> */}
        </TabsContent>

        <TabsContent value="sessions">
          {/* <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspense> */}
        </TabsContent>

        <TabsContent value="accounts">
          {/* <LoadingSuspense>
            <LinkedAccountsTab />
          </LoadingSuspense> */}
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de perigo</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <AccountDeletion /> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
