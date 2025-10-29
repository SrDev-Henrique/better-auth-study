"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { translateAuthError } from "@/lib/auth-errors";
import { forgotPasswordFormSchema } from "@/utils/form-schemas";
import Toast from "./toaster";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function ForgotPasswordForm({
  openSignInTab,
}: {
  openSignInTab: () => void;
}) {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof forgotPasswordFormSchema>) {
    await authClient.requestPasswordReset(
      {
        ...data,
        redirectTo: "/auth/reset-password",
      },
      {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao enviar link de recuperação"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Link de recuperação enviado com sucesso"
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
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openSignInTab}
            disabled={isSubmitting}
          >
            <ArrowLeftIcon className="size-4" />
            Voltar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Enviar link de recuperação"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
