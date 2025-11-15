"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconCloud } from "@tabler/icons-react";
import type { Passkey } from "better-auth/plugins/passkey";
import { PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import Toast from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";
import { passkeyFormSchema } from "@/utils/form-schemas";

type PasskeyForm = z.infer<typeof passkeyFormSchema>;

export default function PasskeysManagement({
  passkeys,
}: {
  passkeys: Passkey[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<PasskeyForm>({
    resolver: zodResolver(passkeyFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleDeletePasskey(id: string) {
    return await authClient.passkey.deletePasskey(
      {
        id,
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Passkey deletada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
          router.refresh();
        },
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao deletar passkey"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {passkeys.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCloud />
            </EmptyMedia>
            <EmptyTitle>Nenhuma passkey encontrada</EmptyTitle>
            <EmptyDescription>
              Adicione uma passkey para começar a usar a autenticação por
              passkey
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(o) => {
                if (o) form.reset();
                setIsDialogOpen(o);
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon />
                  Adicionar passkey
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Adicionar passkey
                  </DialogTitle>
                </DialogHeader>
                <AddPasskeyForm setIsDialogOpen={setIsDialogOpen} form={form} />
              </DialogContent>
            </Dialog>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(o) => {
              if (o) form.reset();
              setIsDialogOpen(o);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusIcon />
                Adicionar passkey
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Adicionar passkey
                </DialogTitle>
              </DialogHeader>
              <AddPasskeyForm setIsDialogOpen={setIsDialogOpen} form={form} />
            </DialogContent>
          </Dialog>
          {passkeys.map((passkey) => (
            <Card className="w-full" key={passkey.id}>
              <CardHeader className="flex gap-2 items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{passkey.name}</CardTitle>
                  <CardDescription>
                    Criado em {new Date(passkey.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <BetterAuthActionButton
                  requireAreYouSure
                  variant="destructive"
                  size="icon"
                  action={() => handleDeletePasskey(passkey.id)}
                >
                  <Trash2 />
                </BetterAuthActionButton>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddPasskeyForm({
  setIsDialogOpen,
  form,
}: {
  setIsDialogOpen?: (isOpen: boolean) => void;
  form: UseFormReturn<z.infer<typeof passkeyFormSchema>>;
}) {
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleAddPasskey(data: PasskeyForm) {
    await authClient.passkey.addPasskey(data, {
      onError: (error) => {
        toast.custom((t) => (
          <Toast
            error={true}
            message="Erro ao adicionar passkey"
            errorMessage={translateAuthError(error)}
            onClick={() => toast.dismiss(t)}
          />
        ));
      },
      onSuccess: () => {
        toast.custom((t) => (
          <Toast
            message="Passkey adicionada com sucesso"
            onClick={() => toast.dismiss(t)}
          />
        ));
        form.reset();
        setIsDialogOpen?.(false);
        router.refresh();
      },
    });
  }
  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full max-w-sm mx-auto"
        onSubmit={form.handleSubmit(handleAddPasskey)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Spinner /> : "Adicionar"}
        </Button>
      </form>
    </Form>
  );
}
