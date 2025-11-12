"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";
import { signUpFormSchema } from "@/utils/form-schemas";
import NumberInput from "../number-input";
import Toast from "../toaster";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

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
    await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao criar conta"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Conta criada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
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
        <FormField
          control={form.control}
          name="favoriteNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de contato</FormLabel>
              <FormControl>
                <NumberInput
                  value={
                    field.value !== undefined
                      ? `+${String(field.value)}`
                      : undefined
                  }
                  onChange={(val) => {
                    const digits = val ? String(val).replace(/\D/g, "") : "";
                    const nextValue = digits ? Number(digits) : undefined;
                    // Allow transient undefined while typing; RHF will enforce schema on submit
                    (
                      field.onChange as unknown as (
                        v: number | undefined,
                      ) => void
                    )(nextValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </Form>
  );
}
