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
          TextPart: `Your delivery OTP for order #${orderNumber} is ${otp}. Valid for 10 minutes. Please share it with the rider.`,
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
