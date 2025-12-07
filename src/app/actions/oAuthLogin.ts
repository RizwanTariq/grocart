"use server";

import { signIn } from "@/auth";
import { ProviderId } from "next-auth/providers";

export async function oAuthloginAction(
  provider: ProviderId,
  redirectUrl: string
) {
  try {
    await signIn(provider, { redirect: true, redirectTo: redirectUrl });
  } catch (error) {
    throw error;
  }
}
