import { CircleAlertIcon, CircleCheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Toast({
  error = false,
  message,
  errorMessage,
  onClick,
  action,
  href,
  actionLabel,
}: {
  error?: boolean;
  message: string;
  errorMessage?: string | undefined;
  onClick: () => void;
  action?: boolean;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-(--width)">
      {error ? (
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <CircleAlertIcon
              className="mt-0.5 shrink-0 text-red-500"
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow flex-col gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{message}:</p>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onClick}>
                  Fechar
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Fechar notificação"
              onClick={onClick}
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <CircleCheckIcon
              className="mt-0.5 shrink-0 text-emerald-500"
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow flex-col gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Sucesso:</p>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
              <div className="flex gap-2">
                {action && (
                  <Button size="sm" onClick={onClick}>
                    <Link href={href ?? ""}>{actionLabel}</Link>
                  </Button>
                )}
                <Button size="sm" onClick={onClick}>
                  Fechar
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Fechar notificação"
              onClick={onClick}
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
