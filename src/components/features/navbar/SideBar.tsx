"use client";

import {
  Boxes,
  ClipboardList,
  LogOut,
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
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IUser } from "@/types";
import { USER_ROLE } from "@/types/enums";

type Props = {
  user: IUser;
  handleLogOut(): Promise<void>;
  setMobileMenu: (value: boolean) => void;
};

function SideBar({ user, setMobileMenu, handleLogOut }: Props) {
  const pathname = usePathname();
  const isAdmin = user.role === USER_ROLE.ADMIN;
  const isUser = user.role === USER_ROLE.USER;

  const handleLinkClick = () => {
    setMobileMenu(false);
  };

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
            onClick={() => setMobileMenu(false)}
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
              <Link
                href="/user"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  pathname === "/user"
                    ? "bg-white text-rose-600 shadow-md font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">Home</span>
              </Link>
              <Link
                href="/user/products"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  pathname === "/user/products"
                    ? "bg-white text-rose-600 shadow-md font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-sm">Products</span>
              </Link>

              <div className="my-4 border-t border-white/20" />

              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                My Account
              </p>
              <Link
                href="/user/cart"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">My Cart</span>
              </Link>
              <Link
                href="/user/orders"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <Package2 className="w-5 h-5" />
                <span className="text-sm">My Orders</span>
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                Admin Actions
              </p>
              <Link
                href="/admin/add-product"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <PlusCircle className="w-5 h-5" />
                <span className="text-sm">Add Product</span>
              </Link>
              <Link
                href="/products"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <Boxes className="w-5 h-5" />
                <span className="text-sm">View Products</span>
              </Link>
              <Link
                href="/orders"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <ClipboardList className="w-5 h-5" />
                <span className="text-sm">Manage Orders</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-6 pt-4 border-t border-white/10">
        <button
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-red-500/30 hover:bg-red-500/50 hover:scale-105 active:scale-95 rounded-xl text-white font-medium transition-all shadow-lg cursor-pointer"
          onClick={handleLogOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </motion.div>
  );
}

export default SideBar;
