import { redirect } from "next/navigation";

import { auth } from "@/auth";
import EditRoleAndContact from "@/components/EditRoleAndContact";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import NavBar from "@/components/navbar/NavBar";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const dbUser = await UserModel.findOne({
    email: session?.user?.email,
  }).lean();

  if (!dbUser) {
    redirect("/login");
  }
  const user = JSON.parse(JSON.stringify(dbUser));
  const isIncompleteProfile = !user.contact || !user.role;

  if (isIncompleteProfile) {
    return <EditRoleAndContact user={user} />;
  }
  return <NavBar user={user} />;
}
