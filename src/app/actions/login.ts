"use server";

import { signIn } from "@/auth";

export async function loginAction(data: FormData, redirectUrl: string) {
  const email = data.get("email")?.toString();
  const password = data.get("password")?.toString();
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: redirectUrl,
    });
  } catch (error) {
    throw error;
  }
}
