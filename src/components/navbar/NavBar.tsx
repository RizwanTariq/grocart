"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

import {
  Boxes,
  ClipboardList,
  LogOut,
  Menu,
  PlusCircle,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { IUser } from "@/models/user.model";

import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import SearchBarMobile from "./SearchBarMobile";
import TooltipIconButton from "./TooltipIconButton";
import { signOut } from "next-auth/react";

function NavBar({ user }: { user: IUser }) {
  const isUser = user.role === "user";
  const [mobileMenu, setMobileMenu] = useState(false);

  async function handleLogOut() {
    setMobileMenu((pre) => !pre);
    await signOut({ redirect: true, redirectTo: "/login" });
  }

  const sideBar = mobileMenu
    ? createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed top-0 left-0 w-[75%] sm:w-[60%] h-full bg-black/30 z-9999 bg-linear-to-b from-rose-600/90 via-pink-600/80 to-rose-600/90 backdrop-blur-xl border-r border-rose-600/10 shadow-lg shadow-black/30 flex flex-col justify-between text-white p-6"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-extrabold tracking-wide text-white/90">
                  Admin Panel
                </h1>
                <button
                  className="text-white hover:text-red-400 hover:bg-red-100 rounded-full cursor-pointer p-1.5 text-2xl font-bold transition-all"
                  onClick={() => setMobileMenu((pre) => !pre)}
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 mt-2 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
                <div className="bg-white rounded-full w-12 h-12 overflow-hidden flex items-center justify-center relative border-2 border-rose-400 shadow-lg">
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
              <div className="flex flex-col gap-3 font-medium mt-6">
                <Link
                  className="flex items-center justify-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all shadow-inner"
                  href=""
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
        </AnimatePresence>,
        document.body
      )
    : null;
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
      {isUser && <SearchBar />}
      <div className="flex items-center gap-3 md:gap-5">
        {isUser && (
          <>
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
          </>
        )}
        {user.role === "admin" && (
          <>
            <div className="hidden md:flex items-center gap-3">
              <TooltipIconButton
                href=""
                icon={<PlusCircle className="w-5 h-5 text-rose-700" />}
                tooltip="Add Product"
              />
              <TooltipIconButton
                href=""
                icon={<Boxes className="w-5 h-5 text-rose-700" />}
                tooltip="View Products"
              />
              <TooltipIconButton
                href=""
                icon={<ClipboardList className="w-5 h-5 text-rose-700" />}
                tooltip="Manage Orders"
              />
            </div>
            <div
              className="md:hidden bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md shadow-black/30 hover:scale-105 transition-all cursor-pointer"
              onClick={() => setMobileMenu((pre) => !pre)}
            >
              <Menu className="w-6 h-6 text-rose-600" />
            </div>
          </>
        )}
        <ProfileDropdown user={user} />
      </div>
      {sideBar}
    </motion.div>
  );
}

export default NavBar;
