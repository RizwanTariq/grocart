import { redirect } from "next/navigation";

import { auth } from "@/auth";
import EditRoleAndContact from "@/components/EditRoleAndContact";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import NavBar from "@/components/features/navbar/NavBar";
import AdminDashboard from "@/components/features/dashboard/AdminDashboard";
import DeliveryBoyDashboard from "@/components/features/dashboard/DeliveryBoyDashboard";
import UserDashboard from "@/components/features/dashboard/UserDashboard";
import { convertId, IUser } from "@/types";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const dbUser = await UserModel.findOne({
    email: session?.user?.email,
  })
    .select("-password")
    .lean();

  if (!dbUser) {
    redirect("/login");
  }
  const user = convertId(dbUser) as IUser;
  const isIncompleteProfile = !user.contact || !user.role;

  if (isIncompleteProfile) {
    return <EditRoleAndContact user={user} />;
  }
  return (
    <>
      <NavBar />
      {user.role === "user" ? (
        <>
          <UserDashboard />
        </>
      ) : user.role === "admin" ? (
        <>
          <AdminDashboard />
        </>
      ) : (
        <DeliveryBoyDashboard />
      )}
    </>
  );
}
