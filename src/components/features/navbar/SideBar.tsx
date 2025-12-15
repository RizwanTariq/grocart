"use client";

import {
  Boxes,
  ClipboardList,
  LogOut,
  PlusCircle,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { IUser } from "@/types";

type Props = {
  user: IUser;
  handleLogOut(): Promise<void>;
  setMobileMenu: (value: boolean) => void;
};
function SideBar({ user, setMobileMenu, handleLogOut }: Props) {
  const isAdmin = user.role === "admin";
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{
        duration: 2,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="fixed top-0 left-0 w-[80%] sm:w-[70%] h-full bg-black/30 z-9999 bg-linear-to-b from-rose-600/90 via-pink-600/80 to-rose-600/90 backdrop-blur-xl border-r border-rose-600/10 shadow-lg shadow-black/30 flex md:hidden flex-col justify-between text-white p-6"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          {isAdmin && (
            <h1 className="text-2xl font-extrabold tracking-wide text-white/90">
              Admin Panel
            </h1>
          )}
          <button
            className="text-white bg-white/20 hover:text-red-400 hover:bg-red-100 rounded-full cursor-pointer p-1.5 text-2xl font-bold transition-all"
            onClick={() => setMobileMenu(false)}
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center gap-4 p-3 mt-2 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
          <div className="bg-rose-50 rounded-full w-12 h-12 overflow-hidden flex items-center justify-center relative border-2 border-rose-400 shadow-lg">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
                loading="eager"
                className="object-cover rounded-full"
              />
            ) : (
              <User className="h-6 w-6 text-rose-700" />
            )}
          </div>
          <div>
            <h2 className="text-gray-50 font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-100 capitalize tracking-wide">
              {user.role}
            </p>
          </div>
        </div>
        {user.role === "admin" && (
          <div className="flex flex-col gap-3 font-medium mt-6">
            <Link
              className="flex items-center justify-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all shadow-inner"
              href="/admin/add-product"
            >
              <PlusCircle className="w-6 h-6 text-rose-200" />
              <span className="text-md">Add Product</span>
            </Link>
            <Link
              className="flex items-center justify-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all shadow-inner"
              href=""
            >
              <Boxes className="w-6 h-6 text-rose-200" />
              <span className="text-md">View Products</span>
            </Link>
            <Link
              className="flex items-center justify-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all shadow-inner"
              href=""
            >
              <ClipboardList className="w-6 h-6 text-rose-200" />
              <span className="text-md">Manage Orders</span>
            </Link>
          </div>
        )}
        <div className="my-5 border-t border-white/30" />
      </div>
      <div className="mb-10">
        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 bg-red-200/30 hover:bg-red-400/30 rounded-xl text-rose-100 font-medium transition-all cursor-pointer"
          onClick={handleLogOut}
        >
          <LogOut className="h-6 w-6 text-red-100" />
          Log Out
        </button>
      </div>
    </motion.div>
  );
}

export default SideBar;
