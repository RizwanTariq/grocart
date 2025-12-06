"use server";

import { signIn } from "@/auth";

export async function loginAction(data: FormData) {
  const email = data.get("email")?.toString();
  const password = data.get("password")?.toString();
  try {
    await signIn("credentials", { email, password });
  } catch (error) {
    throw error;
  }
}
