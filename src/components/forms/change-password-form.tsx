"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";
import { changePasswordFormSchema } from "@/utils/form-schemas";
import Toast from "../toaster";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export default function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      revokeOtherSessions: true,
    },
  });

  const [isSubmitting, startTransition] = useTransition();

  async function onSubmit(data: ChangePasswordFormData) {
    startTransition(async () => {
      await authClient.changePassword(data, {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao atualizar senha"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Senha atualizada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
          form.reset();
        },
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-md mx-auto space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Senha atual</FormLabel>
              <FormControl>
                <Input {...field} type={showPassword ? "text" : "password"} />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                className="absolute right-0 bottom-0"
                size="icon"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                variant="ghost"
              >
                {showCurrentPassword ? (
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
          name="newPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Nova senha</FormLabel>
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
          name="confirmNewPassword"
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
          name="revokeOtherSessions"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Revogar outras sessões</FormLabel>
              <FormControl>
                <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm leading-4">Revogar outras sessões</p>
                    <p className="text-xs text-muted-foreground">
                      Ao mudar sua senha, todas as outras sessões serão
                      revogadas.
                    </p>
                  </div>
                </Label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Mudar senha"
          )}
        </Button>
      </form>
    </Form>
  );
}
