import { redirect } from "next/navigation";

import { auth } from "@/auth";
import EditRoleAndContact from "@/components/EditRoleAndContact";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await UserModel.findOne({ email: session?.user?.email }).lean();

  if (!user) {
    redirect("/login");
  }
  const isIncompleteProfile = !user.contact || !user.role;

  if (isIncompleteProfile) {
    return <EditRoleAndContact />;
  }

  return <></>;
}
