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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="max-w-md w-full mx-auto">
        <Tabs defaultValue="signIn">
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
              <CardFooter className="flex flex-col gap-5">
                <Separator />
                <SocialButtons signIn={true} />
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signUp">
            <Card>
              <CardHeader className="text-2xl font-bold">
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>Crie uma conta para continuar</CardDescription>
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
    </div>
  );
}
