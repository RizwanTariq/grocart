"use client";

import { IUser } from "@/models/user.model";
import { LogOut, Package2, User } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

function ProfileDropdown({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const dropdownCont = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownCont.current &&
        !dropdownCont.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleLogOut() {
    setOpen((pre) => !pre);
    signOut({ redirect: true, redirectTo: "/login" });
  }
  return (
    <div className="relative" ref={dropdownCont}>
      <div
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-all cursor-pointer relative"
        onClick={() => setOpen((pre) => !pre)}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            fill
            loading="eager"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
            className="object-cover rounded-full"
          />
        ) : (
          <User className="h-6 w-6 text-rose-700" />
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-12 right-0 w-50 bg-white border rounded-xl border-gray-300 shadow-lg p-3 space-y-2 text-sm font-medium text-gray-700 z-50"
          >
            <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center relative">
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
                <div className="text-gray-700 font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
            <Link
              href=""
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-rose-50 transition-all rounded-xl font-medium"
              onClick={() => setOpen((pre) => !pre)}
            >
              <Package2 className="w-5 h-5 text-rose-500" />
              My Orders
            </Link>
            <button
              className="flex items-center gap-3 w-full px-3 py-2.5 bg-red-200 hover:bg-red-100 rounded-xl text-gray-700 font-medium transition-all cursor-pointer"
              onClick={handleLogOut}
            >
              <LogOut className="h-5 w-5 text-red-600" />
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileDropdown;
