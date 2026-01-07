import axios from "axios";

const sendWhatsappOtp = async (
  toNumber: string,
  otp: string,
  orderNumber: string
) => {
  try {
    const response = await axios.post(
      "https://api.sendzen.io/v1/messages",
      {
        from: process.env.SENDZEN_FROM_NUMBER!,
        to: toNumber,
        type: "text",
        text: {
          body: `Your delivery OTP for order #${orderNumber} is ${otp}.
Valid for 10 minutes. Please share it with the rider.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDZEN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export { sendWhatsappOtp };
