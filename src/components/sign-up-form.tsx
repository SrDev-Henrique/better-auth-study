"use client";

import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { signUpFormSchema } from "@/utils/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Toast from "./toaster";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    await authClient.signUp
      .email(
        { ...data },
        {
          onError: (error) => {
            toast.custom((t) => (
              <Toast
                error={true}
                message="Erro ao criar projeto"
                errorMessage={error?.error?.message ?? "Erro desconhecido"}
                onClick={() => toast.dismiss(t)}
              />
            ));
          },
        }
      )
      .then(() => {
        toast.custom((t) => (
          <Toast
            message="Conta criada com sucesso"
            onClick={() => toast.dismiss(t)}
          />
        ));
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input {...field} type={showPassword ? "text" : "password"} />
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
              <FormLabel>Confirmar senha</FormLabel>
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            <>
              <Loader2 className="size-4 animate-spin" />
              Criar conta
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </Form>
  );
}
