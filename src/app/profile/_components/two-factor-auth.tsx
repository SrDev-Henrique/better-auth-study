"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import type z from "zod";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";
import { qrCodeVerifySchema, twoFactorAuthSchema } from "@/utils/form-schemas";

type TwoFactorAuthFormData = z.infer<typeof twoFactorAuthSchema>;
type TwoFactorDataType = {
  totpURI: string;
  backupCodes: string[];
};

export default function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorDataType | null>(
    null,
  );

  const form = useForm<TwoFactorAuthFormData>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: {
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function handleEnableTwoFactor(data: TwoFactorAuthFormData) {
    try {
      await authClient.twoFactor.enable(
        {
          password: data.password,
        },
        {
          onSuccess: (result) => {
            setTwoFactorData(result.data);
          },
          onError: (error) => {
            toast.custom((t) => (
              <Toast
                error={true}
                message="Erro ao ativar autenticação de dois fatores"
                errorMessage={translateAuthError(error)}
                onClick={() => toast.dismiss(t)}
              />
            ));
          },
        },
      );
    } catch {}
  }

  async function handleDisableTwoFactor(data: TwoFactorAuthFormData) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Autenticação de dois fatores desativada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
          form.reset();
          router.refresh();
        },
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao desativar autenticação de dois fatores"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }

  if (twoFactorData !== null) {
    return (
      <QRCodeVerify
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null);
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          isEnabled ? handleDisableTwoFactor : handleEnableTwoFactor,
        )}
        className="w-full max-w-md mx-auto space-y-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Sua senha</FormLabel>
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
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          variant={isEnabled ? "destructive" : "default"}
        >
          {isSubmitting ? <Spinner /> : isEnabled ? "Desativar" : "Ativar"}
        </Button>
      </form>
    </Form>
  );
}

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorDataType & { onDone: () => void }) {
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof qrCodeVerifySchema>>({
    resolver: zodResolver(qrCodeVerifySchema),
    defaultValues: {
      token: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  async function handleVerifyTwoFactor(
    data: z.infer<typeof qrCodeVerifySchema>,
  ) {
    try {
      await authClient.twoFactor.verifyTotp(
        {
          code: data.token,
        },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <Toast
                message="Autenticação de dois fatores ativada com sucesso"
                onClick={() => toast.dismiss(t)}
              />
            ));
            setShowBackupCodes(true);
            router.refresh();
          },
          onError: (error) => {
            toast.custom((t) => (
              <Toast
                error={true}
                message="Erro ao verificar código de autenticação de dois fatores"
                errorMessage={translateAuthError(error)}
                onClick={() => toast.dismiss(t)}
              />
            ));
          },
        },
      );
    } catch {
      toast.custom((t) => (
        <Toast
          error={true}
          message="Erro inesperado"
          errorMessage="Tente novamente"
          onClick={() => toast.dismiss(t)}
        />
      ));
    }
  }

  if (showBackupCodes) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <p className="text-center text-muted-foreground">
          Autenticação de dois fatores ativada com sucesso!{" "}
          <span className="text-foreground">
            Guarde estes códigos de recuperação em um local seguro.
          </span>
        </p>
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Códigos de Recuperação</h3>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code) => (
              <code
                key={code}
                className="bg-background p-2 rounded text-center font-mono text-sm"
              >
                {code}
              </code>
            ))}
          </div>
        </div>
        <Button onClick={onDone} className="w-full">
          Concluído
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <p className="text-center text-muted-foreground">
        Escaneie o código QR abaixo com o seu aplicativo de autenticação de dois
        fatores e digite o token para verificar a autenticação.
      </p>
      <div className="p-4 bg-white w-fit mx-auto rounded-lg">
        <QRCode size={256} value={totpURI} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerifyTwoFactor)}
          className="flex flex-col items-center space-y-4"
        >
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="flex justify-center">Token</FormLabel>
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
            {isSubmitting ? <Spinner /> : "Verificar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
