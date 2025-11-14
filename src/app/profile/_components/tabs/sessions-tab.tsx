import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import SessionManagement from "../session-management";

export default async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() });
  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}
