import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { USER_ROLE } from "@/types/enums";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getAiSuggestions(
  role: USER_ROLE.DELIVERY_BOY | USER_ROLE.USER,
  lastMessage: string
): Promise<string[]> {
  const prompt = `
            You are a delivery chat assistant.

            Possible roles: Delivery Boy, Customer

            Role: ${
              role === USER_ROLE.DELIVERY_BOY ? "Delivery Boy" : "Customer"
            }
            Delivery status: Out for delivery
            Language: en, urdu, hindi

            Last message:
            "${lastMessage}"

            Rules:
            - Suggest exactly 4 replies
            - Suggestions should be based on the context of the last message
            - Max 10 words each (human like)
            - Polite and natural
            - Delivery related only must be helpful, respectful, friendly and relevant to the delivery
            - Only one emoji per suggestion should be used natually
            - No profanity or offensive language
            - No generic suggestions like "OK" or "Thank you"
            - Output ONLY a JSON array of strings
            `;
  try {
    const result = await genAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text;
    console.log(text);

    // IMPORTANT: Gemini sometimes wraps JSON in text
    const jsonMatch = text?.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw NextResponse.json(
        prepareErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "AI Error: Failed to generate suggestions"
        ),

        { status: 500 }
      );
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw error;
  }
}

export { getAiSuggestions };
