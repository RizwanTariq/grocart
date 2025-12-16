"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import {
  Boxes,
  ClipboardList,
  Menu,
  PlusCircle,
  Store,
  Home,
} from "lucide-react";

import { IUser } from "@/types";

import ProfileDropdown from "./ProfileDropdown";
import Tooltip from "../../common/Tooltip";
import CartButton from "./CartButton";
import SideBar from "./SideBar";
import CartSideBar from "./CartSideBar";
import { useStore } from "@/store/useStore";

function NavBar() {
  const [mounted, setMounted] = useState(false);
  const user = useStore((s) => s.user);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isUser = user?.role === "user";

  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartMenu, setCartMenu] = useState(false);

  async function handleLogOut() {
    setMobileMenu((pre) => !pre);
    await signOut({ redirect: true, redirectTo: "/login" });
  }

  const sideBar = mounted
    ? createPortal(
        <AnimatePresence mode="wait">
          {mobileMenu ? (
            <SideBar
              user={user as IUser}
              handleLogOut={handleLogOut}
              setMobileMenu={setMobileMenu}
            />
          ) : null}
        </AnimatePresence>,
        document.body
      )
    : null;
  const cartSideBar = mounted
    ? createPortal(
        <AnimatePresence mode="wait">
          {cartMenu ? <CartSideBar setCartMenu={setCartMenu} /> : null}
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
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-white font-extrabold text-xl sm:text-2xl tracking-wide hover:scale-105 transition-all"
        >
          GroCart
        </Link>

        {/* Navigation Links for Users */}
        {isUser && (
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/user"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                pathname === "/user"
                  ? "bg-white text-rose-600 shadow-md"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home className="w-5 h-5" strokeWidth={2.5} />
              <span>Home</span>
            </Link>
            <Link
              href="/user/products"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                pathname === "/user/products"
                  ? "bg-white text-rose-600 shadow-md"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <Store className="w-5 h-5" strokeWidth={2.5} />
              <span>Products</span>
            </Link>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {isUser && (
          <>
            <CartButton handleClick={() => setCartMenu((pre) => !pre)} />
          </>
        )}
        {user?.role === "admin" && (
          <div className="hidden sm:flex items-center gap-3">
            <Tooltip tooltip="Add Product">
              <Link
                href="/admin/add-product"
                className="bg-white w-9 h-9 flex items-center justify-center rounded-full shadow-md hover:bg-rose-100 shadow-black/30 hover:scale-105 transition-all"
              >
                <PlusCircle className="w-5 h-5 text-rose-700" />
              </Link>
            </Tooltip>
            <Tooltip tooltip="View Products">
              <Link
                href="/products"
                className="bg-white w-9 h-9 flex items-center justify-center rounded-full shadow-md hover:bg-rose-100 shadow-black/30 hover:scale-105 transition-all"
              >
                <Boxes className="w-5 h-5 text-rose-700" />
              </Link>
            </Tooltip>
            <Tooltip tooltip="Manage Orders">
              <Link
                href="/orders"
                className="bg-white w-9 h-9 flex items-center justify-center rounded-full shadow-md hover:bg-rose-100 shadow-black/30 hover:scale-105 transition-all"
              >
                <ClipboardList className="w-5 h-5 text-rose-700" />
              </Link>
            </Tooltip>
          </div>
        )}
        <div
          className="sm:hidden bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md shadow-black/30 hover:scale-105 transition-all cursor-pointer"
          onClick={() => setMobileMenu((pre) => !pre)}
        >
          <Menu className="w-6 h-6 text-rose-600" />
        </div>
        <ProfileDropdown user={user as IUser} />
      </div>
      {sideBar}
      {cartSideBar}
    </motion.div>
  );
}

export default NavBar;
