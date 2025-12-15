"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import { Boxes, ClipboardList, Menu, PlusCircle } from "lucide-react";

import { IUser } from "@/types";

import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import SearchBarMobile from "./SearchBarMobile";
import TooltipIconButton from "./TooltipIconButton";
import CartButton from "./CartButton";
import SideBar from "./SideBar";
import CartSideBar from "./CartSideBar";

function NavBar({ user }: { user: IUser }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const isUser = user.role === "user";

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
              user={user}
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
            <CartButton handleClick={() => setCartMenu((pre) => !pre)} />
          </>
        )}
        {user.role === "admin" && (
          <div className="hidden md:flex items-center gap-3">
            <TooltipIconButton
              href="/admin/add-product"
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
        )}
        <div
          className="md:hidden bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md shadow-black/30 hover:scale-105 transition-all cursor-pointer"
          onClick={() => setMobileMenu((pre) => !pre)}
        >
          <Menu className="w-6 h-6 text-rose-600" />
        </div>
        <ProfileDropdown user={user} />
      </div>
      {sideBar}
      {cartSideBar}
    </motion.div>
  );
}

export default NavBar;
