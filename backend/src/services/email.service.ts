import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const smtpPort = Number(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const templatePath = path.resolve(
  __dirname,
  "../templates/emails/reset-password.html"
);
const resetEmailTemplate = fs.readFileSync(templatePath, "utf-8");

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const html = resetEmailTemplate
    .replace(/\{\{RESET_LINK\}\}/g, resetLink)
    .replace(/\{\{LOGO_URL\}\}/g, `${frontendUrl}/assets/images/logo-white.svg`);

  try {
    const info = await transporter.sendMail({
      from: `"BinGo" <${process.env.SMTP_EMAIL || "noreply@bingo.app"}>`,
      to: toEmail,
      subject: "Reset Kata Sandi - BinGo",
      html,
    });

    console.log("[Email] Terkirim ke", toEmail, "- MessageID:", info.messageId);
  } catch (error: any) {
    console.error("[Email] Gagal kirim:", error.message);
    throw error;
  }
}
