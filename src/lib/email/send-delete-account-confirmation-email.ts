/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
export type DeleteAccountConfirmationEmailParams = {
  user: { email: string; name?: string | null };
  url: string;
};

export async function sendDeleteAccountConfirmationEmail({
  user,
  url,
}: DeleteAccountConfirmationEmailParams): Promise<void> {
  const from = "onboarding@resend.dev";
  await resend.emails.send({
    from,
    to: user.email,
    subject: "Confirmação de deletar conta",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <p>Olá${user.name ? `, ${user.name}` : ""}!</p>
              <p>Recebemos uma solicitação para deletar sua conta.</p>
              <p>Clique no link abaixo para continuar:</p>
              <a href="${url}" style="background-color: #000; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 16px;">Deletar conta</a>
              <p>Se você não solicitou, ignore este e-mail.</p>
            </div>
          `,
    text: `Olá${user.name ? `, ${user.name}` : ""}!
                Recebemos uma solicitação para deletar sua conta.
                Abra este link para continuar: ${url}
                Se você não solicitou, ignore este e-mail.`,
  });
}
