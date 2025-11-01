"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon, EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import Toast from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { translateAuthError } from "@/lib/auth-errors";
import { resetPasswordFormSchema } from "@/utils/form-schemas";

export default function ResetPasswordForm() {
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof resetPasswordFormSchema>) {
    await authClient.resetPassword(
      {
        newPassword: data.password,
      },
      {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao redefinir senha"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Senha redefinida com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }

  if (!token || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-2xl font-bold text-center space-y-2">
            <CircleAlertIcon className="size-10 text-muted-foreground mx-auto" />
            <CardTitle>Link inválido</CardTitle>
            <CardDescription>
              O link para redefinir a senha é inválido ou expirou. Por favor,
              solicite um novo link.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Solicitar novo link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-2xl font-bold">
          <CardTitle>Redefinir senha</CardTitle>
          <CardDescription>Crie uma nova senha para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                    <Button
                      type="button"
                      className="absolute right-0 bottom-0"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeClosedIcon className="size-4" />
                      )}
                    </Button>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="relative"
                      />
                    </FormControl>
                    <FormMessage />
                    <Button
                      type="button"
                      className="absolute right-0 bottom-0"
                      size="icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      variant="ghost"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeClosedIcon className="size-4" />
                      )}
                    </Button>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Redefinir senha"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
