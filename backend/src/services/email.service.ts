import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.SMTP_PORT) || 2525,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  await transporter.sendMail({
    from: `"BinGo" <${process.env.SMTP_EMAIL || "noreply@bingo.app"}>`,
    to: toEmail,
    subject: "Reset Kata Sandi - BinGo",
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Kata Sandi - BinGo</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#3d4a5d;border-radius:50%;width:40px;height:40px;text-align:center;vertical-align:middle;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4BAFBC" stroke-width="2.5" style="width:20px;height:20px;vertical-align:middle;">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="font-size:22px;font-weight:900;color:#3d4a5d;letter-spacing:-1px;">BINGO</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

                <!-- Header Banner -->
                <tr>
                  <td style="background:linear-gradient(135deg,#3d4a5d 0%,#4BAFBC 100%);padding:40px 40px 32px;text-align:center;">
                    <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:64px;height:64px;margin:0 auto 20px;line-height:64px;">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" style="width:28px;height:28px;vertical-align:middle;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                      </svg>
                    </div>
                    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;">Reset Kata Sandi</h1>
                    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;line-height:1.5;">Kami menerima permintaan untuk mengatur ulang kata sandi akun BinGo Anda.</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;text-align:center;">
                      Klik tombol di bawah untuk membuat kata sandi baru. Link ini akan kedaluwarsa dalam <strong style="color:#3d4a5d;">1 jam</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom:28px;">
                          <a href="${resetLink}" style="display:inline-block;background:#3d4a5d;color:#ffffff;padding:16px 48px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(61,74,93,0.3);transition:background 0.2s;">
                            Atur Ulang Kata Sandi
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-top:1px solid #e2e8f0;padding-top:24px;">
                          <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0;text-align:center;">
                            Atau salin link berikut ke browser Anda:
                          </p>
                          <p style="color:#4BAFBC;font-size:12px;word-break:break-all;margin:8px 0 0;text-align:center;">
                            <a href="${resetLink}" style="color:#4BAFBC;text-decoration:none;">${resetLink}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding:24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" style="width:18px;height:18px;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                          </svg>
                        </td>
                        <td>
                          <p style="color:#92400e;font-size:12px;line-height:1.5;margin:0;">
                            <strong>Tidak meminta reset?</strong> Abaikan email ini. Akun Anda tetap aman dan tidak ada perubahan yang dilakukan.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 0 16px;text-align:center;">
              <p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0;">
                Email ini dikirim secara otomatis oleh sistem BinGo.
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:8px 0 0;">
                &copy; 2026 BinGo &mdash; Your AI Lens for a Cleaner Beach
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
