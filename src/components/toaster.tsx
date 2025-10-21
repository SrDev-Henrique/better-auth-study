import { CheckCircle2, TriangleAlertIcon, X } from "lucide-react";
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
            <TriangleAlertIcon
              className="text-destructive mt-0.5 shrink-0"
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow justify-between gap-12">
              <p className="text-sm">
                {message}: {errorMessage}
              </p>
              <Button
                variant="outline"
                className="text-sm font-medium hover:underline"
                onClick={onClick}
              >
                Fechar
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={onClick}
            aria-label="Fechar banner"
          >
            <X
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <CheckCircle2
              className="mt-0.5 shrink-0 text-emerald-500"
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow flex-col justify-between gap-2">
              <p className="text-sm">{message}</p>
              {action ? (
                <div className="flex gap-2 text-sm">
                  <Button
                    variant="default"
                    className="text-sm font-medium hover:underline"
                    size="sm"
                    asChild
                  >
                    <Link href={href ?? ""}>{actionLabel}</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm font-medium hover:underline"
                    size="sm"
                    onClick={onClick}
                  >
                    Fechar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="text-sm font-medium hover:underline"
                  size="sm"
                  onClick={onClick}
                >
                  Fechar
                </Button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={onClick}
            aria-label="Fechar banner"
          >
            <X
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      )}
    </div>
  );
}
