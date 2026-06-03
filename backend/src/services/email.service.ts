import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dns from "dns";

// Force Node.js to prioritize IPv4 over IPv6 globally for all DNS lookups.
// This prevents ENETUNREACH errors on cloud hosting platforms (like Railway)
// where IPv6 outbound routing is not configured or reachable.
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}


const smtpPort = Number(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds connection timeout
  family: 4, // Force IPv4 to prevent IPv6 timeout issue on cloud hosting platforms like Railway
} as any);

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  try {
    const templatePath = path.join(process.cwd(), "src/templates/emails/reset-password.html");
    const template = fs.readFileSync(templatePath, "utf8");
    const html = template.replace(/\{\{RESET_LINK\}\}/g, resetLink);

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
