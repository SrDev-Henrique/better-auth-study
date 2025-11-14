"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import OTPInputComponent from "@/components/otp-input";
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
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";
import { TotpFormSchema } from "@/utils/form-schemas";

export default function TotpForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof TotpFormSchema>>({
    resolver: zodResolver(TotpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof TotpFormSchema>) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.code,
      },
      {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao autenticar"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Autenticação realizada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
          router.push("/");
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="relative flex flex-col items-center">
              <FormLabel className="flex justify-center">Código</FormLabel>
              <FormControl>
                <OTPInputComponent
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Autenticar"}
        </Button>
      </form>
    </Form>
  );
}
