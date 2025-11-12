"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import NumberInput from "@/components/number-input";
import Toast from "@/components/toaster";
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
import { profileUpdateSchema } from "@/utils/form-schemas";

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

export default function ProfileUpdateForm({
  user,
}: {
  user: { name: string; email: string; favoriteNumber?: number };
}) {
  const router = useRouter();

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      favoriteNumber: user.favoriteNumber,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleUpdateProfile(data: ProfileUpdateFormData) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        favoriteNumber: data.favoriteNumber,
      }),
    ];

    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        }),
      );
    }

    const res = await Promise.all(promises);

    const updateUserResult = res[0];
    const emailResult = res[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.custom((t) => (
        <Toast
          error={true}
          message="Erro ao atualizar perfil"
          errorMessage={translateAuthError(
            updateUserResult.error as unknown as {
              error?: { code?: string; message?: string };
            },
          )}
          onClick={() => toast.dismiss(t)}
        />
      ));
      if (updateUserResult.error.status === 401) {
        router.push("/auth/login");
      }
    } else if (emailResult.error) {
      toast.custom((t) => (
        <Toast
          error={true}
          message="Erro ao alterar email"
          errorMessage={translateAuthError(
            emailResult.error as unknown as {
              error?: { code?: string; message?: string };
            },
          )}
          onClick={() => toast.dismiss(t)}
        />
      ));
    } else {
      if (data.email !== user.email) {
        toast.custom((t) => (
          <Toast
            message="Verifique seu novo endereço de email para completar a alteração."
            onClick={() => toast.dismiss(t)}
          />
        ));
      } else {
        toast.custom((t) => (
          <Toast
            message="Perfil atualizado com sucesso"
            onClick={() => toast.dismiss(t)}
          />
        ));
      }
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateProfile)}
        className="w-full max-w-md mx-auto space-y-4"
      >
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
            "Atualizar perfil"
          )}
        </Button>
      </form>
    </Form>
  );
}
