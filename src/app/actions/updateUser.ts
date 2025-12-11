"use server";

import { auth } from "@/auth";
import connectDB from "@/libs/db";
import UserModel, { IUser } from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function updateUserAction(formData: FormData): Promise<IUser> {
  try {
    await connectDB();

    const contact = formData.get("contact")?.toString();
    const role = formData.get("role")?.toString();

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

    revalidatePath("/");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw error;
  }
}
