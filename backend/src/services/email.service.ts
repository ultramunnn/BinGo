import nodemailer from "nodemailer";

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

function buildResetEmailHtml(resetLink: string): string {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Kata Sandi - BinGo</title>
</head>
<body style="margin:0;padding:0;background:#e8ecef;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8ecef;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#1a1f2e;padding:40px 0 32px;">
              <span style="font-size:32px;font-weight:800;color:#ffffff;letter-spacing:3px;">B<span style="color:#4BAFBC;">in</span>Go</span>
              <br>
              <span style="font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:2px;text-transform:uppercase;font-weight:500;">Beach Waste Classification</span>
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td align="center" style="padding:40px 0 12px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:88px;height:88px;background:#4BAFBC;border-radius:22px;text-align:center;vertical-align:middle;">
                    <span style="font-size:38px;line-height:88px;color:#ffffff;">&#x1F512;</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:8px 48px 32px;">
              <h1 style="font-size:22px;font-weight:700;color:#1a1f2e;margin:0 0 12px;text-align:center;line-height:1.3;">
                Reset Kata Sandi
              </h1>
              <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 32px;text-align:center;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun BinGo Anda. Jangan khawatir, Anda dapat membuat kata sandi baru yang aman dengan mengeklik tombol di bawah ini.
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <a href="${resetLink}" style="display:inline-block;background:#4BAFBC;color:#ffffff;padding:16px 44px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.5px;box-shadow:0 4px 16px rgba(75,175,188,0.35);">
                      Atur Ulang Kata Sandi &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;">

              <!-- Link fallback -->
              <p style="font-size:12px;color:#9ca3af;line-height:1.6;text-align:center;margin:0 0 6px;">
                Link ini akan kedaluwarsa dalam <strong style="color:#374151;">1 jam</strong>.
              </p>
              <p style="font-size:12px;color:#9ca3af;word-break:break-all;text-align:center;margin:0;">
                Atau salin link berikut ke browser Anda:<br>
                <a href="${resetLink}" style="color:#4BAFBC;text-decoration:underline;font-weight:500;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding:0 48px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef3c7;border-radius:12px;border:1px solid #fde68a;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align:top;width:28px;">
                          <span style="font-size:16px;">&#x26A0;&#xFE0F;</span>
                        </td>
                        <td style="vertical-align:top;padding-left:6px;">
                          <p style="color:#92400e;font-size:12px;line-height:1.6;margin:0;">
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
            <td style="background:#1a1f2e;padding:32px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <span style="font-size:18px;">&#x1F6E1;&#xFE0F;</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="font-size:11px;color:rgba(255,255,255,0.4);line-height:1.7;margin:0;text-align:center;">
                      Email ini dikirimkan secara otomatis oleh sistem keamanan BinGo.<br>
                      Untuk menjaga keamanan akun Anda, jangan pernah membagikan<br>email atau link di atas kepada siapa pun.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:20px;">
                    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 16px;">
                    <span style="font-size:10px;color:rgba(255,255,255,0.25);">&copy; 2026 BinGo. Capstone Project DBS Foundation x Dicoding.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string
): Promise<void> {
  const html = buildResetEmailHtml(resetLink);

  await transporter.sendMail({
    from: `"BinGo" <${process.env.SMTP_EMAIL || "noreply@bingo.app"}>`,
    to: toEmail,
    subject: "Reset Kata Sandi - BinGo",
    html,
  });
}
