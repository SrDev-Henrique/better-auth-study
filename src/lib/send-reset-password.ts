/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
export type ResetPasswordEmailParams = {
  user: { email: string; name?: string | null };
  url: string;
};

export async function sendResetPassword({
  user,
  url,
}: ResetPasswordEmailParams): Promise<void> {
  const from = "onboarding@resend.dev";
  await resend.emails.send({
    from,
    to: user.email,
    subject: "Redefinir senha",
    html: `
            <p>Olá${user.name ? `, ${user.name}` : ""}!</p>
            <p>Recebemos uma solicitação para redefinir sua senha.</p>
            <p>Clique no link abaixo para continuar:</p>
            <p><a href="${url}">Redefinir senha</a></p>
            <p>Se você não solicitou, ignore este e-mail.</p>
          `,
    text: `Olá${user.name ? `, ${user.name}` : ""}!
                Recebemos uma solicitação para redefinir sua senha.
                Abra este link para continuar: ${url}
                Se você não solicitou, ignore este e-mail.`,
  });
}
