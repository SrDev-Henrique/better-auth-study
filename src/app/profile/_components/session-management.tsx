"use client";

import type { Session } from "better-auth";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import Toast from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { translateAuthError } from "@/lib/auth/auth-errors";

export default function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const router = useRouter();

  const currentSession = sessions.find(
    (session) => session.token === currentSessionToken,
  );

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken,
  );

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
        toast.custom((t) => (
          <Toast
            message="Outras sessões revogadas com sucesso"
            onClick={() => toast.dismiss(t)}
          />
        ));
      },
      onError: (error) => {
        toast.custom((t) => (
          <Toast
            error={true}
            message="Erro ao revogar outras sessões"
            errorMessage={translateAuthError(error)}
            onClick={() => toast.dismiss(t)}
          />
        ));
      },
    });
  }
  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession={true} />
      )}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Active Sessions</h3>
          {otherSessions.length > 0 && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeOtherSessions}
            >
              Revogar outras sessões
            </BetterAuthActionButton>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma outra sessão ativa
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isCurrentSession={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  isCurrentSession,
}: {
  session: Session;
  isCurrentSession: boolean;
}) {
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;
  const router = useRouter();

  function getBrowserInformation() {
    if (userAgentInfo === null) return "Dispositivo desconhecido";
    if (userAgentInfo.browser.name === null && userAgentInfo.os.name === null) {
      return "Dispositivo desconhecido";
    }

    if (userAgentInfo.browser.name === null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name === null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name} - ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function revokeSession() {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.custom((t) => (
            <Toast
              message="Sessão revogada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao revogar sessão"
              errorMessage={translateAuthError(error)}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
      },
    );
  }
  return (
    <Card className="flex items-center justify-center">
      <CardHeader className="flex items-center gap-2 justify-center">
        <CardTitle className="text-nowrap">{getBrowserInformation()}</CardTitle>
        {isCurrentSession && (
          <Badge variant="outline" className="gap-1.5">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            ></span>
            Sessão ativa
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone />
            ) : (
              <Monitor />
            )}
            <div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeSession}
            >
              <Trash2 />
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
