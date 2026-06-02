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

let resetEmailTemplate: string | null = null;

function loadTemplate(): string {
  if (resetEmailTemplate) return resetEmailTemplate;

  const templatePath = path.resolve(
    __dirname,
    "../templates/emails/reset-password.html"
  );

  if (fs.existsSync(templatePath)) {
    resetEmailTemplate = fs.readFileSync(templatePath, "utf-8");
    return resetEmailTemplate;
  }

  // Fallback inline template
  console.warn("[Email] Template file not found, using fallback inline template");
  resetEmailTemplate = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:40px 0">
<div style="max-width:480px;margin:auto;background:#fff;border-radius:8px;overflow:hidden">
<div style="background:linear-gradient(135deg,#10b981,#059669);padding:24px;text-align:center">
<h1 style="color:#fff;margin:0">BinGo</h1></div>
<div style="padding:32px">
<h2 style="color:#333">Reset Kata Sandi</h2>
<p style="color:#666">Klik tombol di bawah untuk mengatur ulang kata sandi Anda:</p>
<a href="{{RESET_LINK}}" style="display:block;background:#10b981;color:#fff;text-align:center;padding:14px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin:24px 0">Reset Kata Sandi</a>
<p style="color:#999;font-size:12px">Link ini akan kedaluwarsa dalam 1 jam.</p>
</div></div></body></html>`;
  return resetEmailTemplate;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const html = loadTemplate()
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
