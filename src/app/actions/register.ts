"use server";

import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function registerAction(formData: FormData) {
  await connectDB();

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    throw new Error("Missing required fields");
  }

  const user = await UserModel.findOne({ email });
  if (user) {
    throw new Error("Email already exists");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true };
}
