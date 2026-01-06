import axios from "axios";

const sendWhatsappOtp = async (toNumber: string, otp: string) => {
  try {
    const response = await axios.post(
      "https://api.sendzen.io/v1/messages",
      {
        from: "919099912730",
        to: toNumber,
        type: "text",
        text: `Your delivery OTP is ${otp}. Please share it with the rider.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDZEN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export { sendWhatsappOtp };
