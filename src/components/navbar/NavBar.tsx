"use client";

import { IUser } from "@/models/user.model";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import SearchBarMobile from "./SearchBarMobile";

function NavBar({ user }: { user: IUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-[96%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 rounded-2xl shadow-xl shadow-black/20 flex justify-between items-center h-18 px-5 md:px-8 z-50"
    >
      <Link
        href="/"
        className="text-white font-extrabold text-xl sm:text-2xl tracking-wide hover:scale-105 transition-all"
      >
        GroCart
      </Link>
      <SearchBar />
      <div className="flex items-center gap-3 md:gap-5">
        <SearchBarMobile />
        <Link
          href=""
          className="relative bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md shadow-black/30 hover:scale-105 transition-all"
        >
          <ShoppingCart className="w-6 h-6 text-red-700" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 text-xs bg-rose-700 text-white w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
            0
          </span>
        </Link>
        <ProfileDropdown user={user} />
      </div>
    </motion.div>
  );
}

export default NavBar;
