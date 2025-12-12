"use client";

import { updateUserAction } from "@/app/actions/updateUser";
import { IUser } from "@/models/user.model";
import { cn } from "@/utils/cn";
import {
  LoaderCircle,
  MoveRight,
  TruckElectric,
  User,
  UserCog2,
} from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";

function EditRoleAndContact({ user }: { user: IUser }) {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", Icon: UserCog2 },
    { id: "user", label: "Customer", Icon: User },
    { id: "delivery_boy", label: "Delivery Rider", Icon: TruckElectric },
  ]);
  const [selectedRole, setSelectedRole] = useState<string>(user.role || "");
  const [contact, setContact] = useState<string | undefined>(
    user.contact || ""
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const disabled =
    !contact || contact.length < 10 || contact.length > 10 || !selectedRole;

  const { update } = useSession();

  function handleSubmit() {
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (contact) formData.append("contact", contact);
        if (selectedRole) formData.append("role", selectedRole);
        const updatedUser = await updateUserAction(formData);
        update({ role: updatedUser.role });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen p-6 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-extrabold text-rose-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map(({ id, label, Icon }) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            key={id}
            className={cn(
              "flex flex-col items-center justify-center p-6 border-2 rounded-xl w-42 h-38 cursor-pointer   transition-all",
              selectedRole === id
                ? "border-rose-500 bg-red-50 shadow-lg"
                : "border-gray-300 bg-gray-50 hover:border-rose-400"
            )}
            onClick={() => setSelectedRole(id)}
          >
            <Icon className="h-6 w-6 text-gray-700" />
            <span className="text-lg text-gray-700">{label}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col justify-center items-center mt-10"
      >
        <label htmlFor="contact" className="text-gray-700 font-medium mb-2">
          Enter Your Contact No.
        </label>
        <input
          type="tel"
          id="contact"
          name="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-70 sm:w-120 md:w-140 p-3 md:px-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 mb-6"
          placeholder="eg. 1234567890"
          required
        />
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.03 }}
        disabled={disabled || isPending}
        className={cn(
          "flex flex-row gap-1 justify-center w-40 mx-auto text-white font-semibold py-3 md:py-4 rounded-xl  shadow-lg transition-colors",
          disabled
            ? "bg-rose-400 cursor-not-allowed"
            : "bg-rose-500 hover:bg-rose-600 cursor-pointer"
        )}
        onClick={handleSubmit}
      >
        <span>Go to Home</span>
        {isPending ? (
          <LoaderCircle className="animate-spin w-5 h-5" />
        ) : (
          <MoveRight className="h-6 w-6" />
        )}
      </motion.button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default EditRoleAndContact;
