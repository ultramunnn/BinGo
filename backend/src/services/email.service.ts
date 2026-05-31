import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporterConfig: Record<string, unknown> = {
  host: process.env.SMTP_SERVER || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
};

const smtpUser = process.env.SMTP_USERNAME || process.env.SMTP_EMAIL;
if (smtpUser && process.env.SMTP_PASSWORD) {
  transporterConfig.auth = {
    user: smtpUser,
    pass: process.env.SMTP_PASSWORD,
  };
}

const transporter = nodemailer.createTransport(transporterConfig as nodemailer.TransportOptions);

const TEMPLATE_DIR = path.join(process.cwd(), "..", "frontend", "src", "templates", "emails");

function renderTemplate(templateName: string, vars: Record<string, string>): string {
  const filePath = path.join(TEMPLATE_DIR, templateName);
  let html = fs.readFileSync(filePath, "utf-8");

  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  const html = renderTemplate("forgot-password.html", {
    RESET_LINK: resetLink,
  });

  await transporter.sendMail({
    from: `"BinGo" <${process.env.SMTP_EMAIL || "noreply@bingo.app"}>`,
    to: toEmail,
    subject: "Reset Kata Sandi - BinGo",
    html,
  });
}
