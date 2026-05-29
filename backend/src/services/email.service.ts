import nodemailer from "nodemailer";
import { renderTemplate } from "../utils/template";

const transporterConfig: Record<string, unknown> = {
  host: process.env.SMTP_SERVER || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.SMTP_PORT) || 2525,
  secure: false,
};

if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
  transporterConfig.auth = {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  };
}

const transporter = nodemailer.createTransport(transporterConfig as nodemailer.TransportOptions);

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  const html = renderTemplate("reset-password.html", {
    RESET_LINK: resetLink,
  });

  await transporter.sendMail({
    from: `"BinGo" <${process.env.SMTP_EMAIL || "noreply@bingo.app"}>`,
    to: toEmail,
    subject: "Reset Kata Sandi - BinGo",
    html,
  });
}
