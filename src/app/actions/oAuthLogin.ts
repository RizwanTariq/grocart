"use server";

import { signIn } from "@/auth";
import { ProviderId } from "next-auth/providers";

export async function oAuthloginAction(provider: ProviderId) {
  try {
    await signIn(provider);
  } catch (error) {
    throw error;
  }
}
