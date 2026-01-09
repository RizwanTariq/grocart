import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_API_SECRET!
);

export async function sendOtpEmail(
  toEmail: string,
  otp: string,
  orderNumber: string
) {
  const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Delivery OTP</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:8px;overflow:hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:#22c55e;padding:16px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:22px;">GroCart</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:24px;color:#333333;">
                      <p style="margin:0 0 12px;font-size:14px;">
                        Hi 👋,
                      </p>

                      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;">
                        Your delivery OTP for <strong>Order #${orderNumber}</strong> is:
                      </p>

                      <div style="text-align:center;margin:24px 0;">
                        <span style="
                          display:inline-block;
                          background:#f1f5f9;
                          color:#111827;
                          font-size:28px;
                          letter-spacing:4px;
                          padding:12px 24px;
                          border-radius:6px;
                          font-weight:bold;
                        ">
                          ${otp}
                        </span>
                      </div>

                      <p style="margin:0 0 12px;font-size:14px;line-height:1.5;">
                        Please share this OTP with the delivery rider to confirm your order.
                      </p>

                      <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
                        ⏱ This OTP is valid for <strong>10 minutes</strong>.
                      </p>

                      <p style="margin-top:24px;font-size:13px;color:#6b7280;">
                        If you didn’t place this order, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:12px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">
                        © ${new Date().getFullYear()} GroCart. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;

  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mrizwantariq1996@gmail.com",
            Name: "GroCart",
          },
          To: [
            {
              Email: toEmail,
            },
          ],
          Subject: `Delivery OTP for Order #${orderNumber}`,
          TextPart: `Your delivery OTP for order #${orderNumber} is ${otp}. Valid for 10 minutes.`,
          HTMLPart: htmlTemplate,
        },
      ],
    });

    if (response.response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Mailjet error:", err);
    return false;
  }
}
