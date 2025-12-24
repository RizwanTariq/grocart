"use client";

import {
  Boxes,
  ClipboardList,
  Package2,
  PlusCircle,
  ShoppingCart,
  User,
  X,
  Home,
  Store,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { signOut } from "next-auth/react";

import { IUser } from "@/types";
import { USER_ROLE } from "@/types/enums";
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

type Props = {
  user: IUser;
  closeMobileMenu: () => void;
};

function SideBar({ user, closeMobileMenu }: Props) {
  const isAdmin = user.role === USER_ROLE.ADMIN;
  const isUser = user.role === USER_ROLE.USER;

  async function handleLogOut() {
    closeMobileMenu();
    await signOut({ redirect: true, redirectTo: "/login" });
  }

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="fixed top-0 left-0 w-[75%] h-full bg-linear-to-b from-rose-600/95 via-pink-600/90 to-rose-600/95 backdrop-blur-xl border-r border-rose-400/20 shadow-2xl flex sm:hidden flex-col text-white z-9999"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold tracking-wide text-white">
            {isAdmin ? "Admin Panel" : "Menu"}
          </h1>
          <button
            className="text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
            onClick={() => closeMobileMenu()}
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
          <div className="bg-white rounded-full w-12 h-12 overflow-hidden flex items-center justify-center relative border-2 border-white/50 shadow-lg shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                sizes="48px"
                loading="eager"
                className="object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-rose-600" />
            )}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-white font-semibold truncate">{user.name}</h2>
            <p className="text-xs text-white/80 capitalize tracking-wide">
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-2">
          {/* Main Navigation - For All Users */}
          {isUser && (
            <>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                Navigation
              </p>

              <SidebarLink
                pathToGo="/user"
                label="Home"
                icon={Home}
                closeMobileMenu={closeMobileMenu}
              />
              <SidebarLink
                pathToGo="/user/products"
                label="Products"
                icon={Store}
                closeMobileMenu={closeMobileMenu}
              />

              <div className="my-4 border-t border-white/20" />

              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                My Account
              </p>
              <SidebarLink
                pathToGo="/user/cart"
                label="My Cart"
                icon={ShoppingCart}
                closeMobileMenu={closeMobileMenu}
              />
              <SidebarLink
                pathToGo="/user/orders"
                label="My Orders"
                icon={Package2}
                closeMobileMenu={closeMobileMenu}
              />
            </>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                Admin Actions
              </p>
              <SidebarLink
                pathToGo="/admin/add-product"
                label="Add Product"
                icon={PlusCircle}
                closeMobileMenu={closeMobileMenu}
              />
              <SidebarLink
                pathToGo="/admin/products"
                label="View Products"
                icon={Boxes}
                closeMobileMenu={closeMobileMenu}
              />
              <SidebarLink
                pathToGo="/admin/orders"
                label="Manage Orders"
                icon={ClipboardList}
                closeMobileMenu={closeMobileMenu}
              />
            </>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-6 pt-4 border-t border-white/10">
        <LogoutButton handleLogOut={handleLogOut} />
      </div>
    </motion.div>
  );
}

export default SideBar;
