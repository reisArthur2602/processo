import nodemailer from "nodemailer";
import { env } from "./env";

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });

export type IntakeEmailData = {
  intakeNumber: string;
  clientName: string;
  clientEmail: string;
  serviceArea: string;
  attendedAt: Date;
  responsibleName: string;
  clientReport: string | null;
};

export const sendIntakeEmail = async (data: IntakeEmailData) => {
  const transporter = createTransporter();

  const dateFormatted = data.attendedAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ficha de Atendimento ${data.intakeNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a2332;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0b1f33;border-radius:12px 12px 0 0;padding:32px 40px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#b58b4a;">
                Monteiro
              </p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;">
                Ficha de Atendimento
              </h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.55);">
                ${data.intakeNumber}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
                Olá, <strong>${data.clientName}</strong>.
              </p>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#4a5568;">
                Segue o resumo do seu atendimento realizado em <strong>${dateFormatted}</strong>
                pela área de <strong>${data.serviceArea}</strong>, com
                <strong>${data.responsibleName}</strong>.
              </p>

              ${
                data.clientReport
                  ? `
              <div style="margin:24px 0;padding:16px 20px;border-left:3px solid #b58b4a;background:#faf9f7;border-radius:0 8px 8px 0;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#b58b4a;">
                  Relato registrado
                </p>
                <p style="margin:0;font-size:14px;line-height:1.7;color:#1a2332;white-space:pre-wrap;">${data.clientReport}</p>
              </div>`
                  : ""
              }

              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#718096;">
                Este é um documento gerado automaticamente pelo sistema jurídico.
                Em caso de dúvidas, entre em contato diretamente com o escritório.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f5f7;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#a0aec0;">
                Ficha ${data.intakeNumber} · Documento gerado automaticamente · Não responda este e-mail
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: data.clientEmail,
    subject: `Ficha de atendimento ${data.intakeNumber}`,
    html,
  });
};
