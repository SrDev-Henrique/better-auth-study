/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
export type WelcomeEmailParams = {
  user: { email: string; name?: string | null };
};

export async function sendWelcomeEmail({
  user,
}: WelcomeEmailParams): Promise<void> {
  const from = "onboarding@resend.dev";
  await resend.emails.send({
    from,
    to: user.email,
    subject: "Bem-vindo",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <p>Olá${user.name ? `, ${user.name}` : ""}!</p>
              <p>Bem-vindo ao nosso sistema.</p>
            </div>
          `,
    text: `Olá${user.name ? `, ${user.name}` : ""}!
                Bem-vindo ao nosso sistema.`,
  });
}
