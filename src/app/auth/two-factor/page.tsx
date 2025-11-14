import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackupCodeForm from "./_components/backup-code-form";
import TotpForm from "./_components/totp-form";

export default function TwoFactorPage() {
  return (
    <div className="my-6 px-4">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Autenticação de dois fatores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="totp">Autenticador</TabsTrigger>
              <TabsTrigger value="backup-code">
                Código de recuperação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="totp">
              <TotpForm />
            </TabsContent>

            <TabsContent value="backup-code">
              <BackupCodeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
