"use client";

import { CircleAlertIcon } from "lucide-react";
import { type ComponentProps, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

export function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "Esta ação não pode ser desfeita.",
  areYouSureConfirmMessage = "Confirmar",
  ...props
}: ComponentProps<typeof Button> & {
  action: () => Promise<{ error: boolean; message?: string }>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
  areYouSureConfirmMessage?: string;
}) {
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const data = await action();
      if (data.error) {
        toast.error(data.message ?? "Error");
      } else if (data.message) {
        toast.success(data.message);
      }
    });
  }

  if (requireAreYouSure) {
    return (
      <Dialog open={isLoading ? true : undefined}>
        <DialogTrigger asChild>
          <Button {...props} />
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlertIcon className="opacity-80" size={16} />
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">
                Confirmação final
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                {`Esta ação não pode ser desfeita. Para confirmar, por favor, digite `}{" "}
                <span className="text-foreground">
                  {areYouSureConfirmMessage}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
          </div>

          <form className="space-y-5">
            <div className="*:not-first:mt-2">
              <Label htmlFor="confirm-message">Confirme a ação</Label>
              <Input
                id="confirm-message"
                type="text"
                placeholder={areYouSureConfirmMessage}
                value={confirmMessage ?? ""}
                onChange={(e) => setConfirmMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                className="flex-1"
                disabled={
                  confirmMessage !== areYouSureConfirmMessage || isLoading
                }
                onClick={performAction}
                variant="destructive"
              >
                {isLoading ? <Spinner /> : "Confirmar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={props.disabled ?? isLoading}
      onClick={(e) => {
        performAction();
        props.onClick?.(e);
      }}
    >
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
}
