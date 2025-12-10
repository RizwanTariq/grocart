"use server";

import { auth } from "@/auth";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";

export async function updateUserAction(formData: FormData) {
  try {
    await connectDB();

    const contact = formData.get("contact")?.toString();
    const role = formData.get("role")?.toString();
    console.log(role, contact);

    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    const user = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { contact, role },
      { new: true }
    ).lean();
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user, _id: user._id.toString() };
  } catch (error) {
    throw error;
  }
}
