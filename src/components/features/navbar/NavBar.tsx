"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

import {
  Boxes,
  ClipboardList,
  Menu,
  PlusCircle,
  Store,
  Home,
} from "lucide-react";

import { IUser } from "@/types";
import { useStore } from "@/store/useStore";
import { USER_ROLE } from "@/types/enums";

import ProfileDropdown from "./ProfileDropdown";
import CartButton from "./CartButton";
import SideBar from "./SideBar";
import CartSideBar from "./CartSideBar";
import NavLink from "./NavLink";

function NavBar() {
  const [mounted, setMounted] = useState(false);
  const user = useStore((s) => s.user);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isUser = user?.role === USER_ROLE.USER;
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartMenu, setCartMenu] = useState(false);

  const sideBar = mounted
    ? createPortal(
        <AnimatePresence mode="wait">
          {mobileMenu ? (
            <SideBar
              user={user as IUser}
              closeMobileMenu={() => setMobileMenu(false)}
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
        <nav className="hidden sm:flex items-center gap-2">
          {isUser && (
            <>
              <NavLink pathToGo="/user" label="Home" icon={Home} />
              <NavLink
                pathToGo="/user/products"
                label="Products"
                icon={Store}
              />
            </>
          )}
          {isAdmin && (
            <>
              <NavLink
                pathToGo="/admin/add-product"
                label="Add Product"
                icon={PlusCircle}
              />

              <NavLink
                pathToGo="/admin/products"
                label="View Products"
                icon={Boxes}
              />

              <NavLink
                pathToGo="/admin/orders"
                label="Manage Orders"
                icon={ClipboardList}
              />
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {isUser && (
          <>
            <CartButton handleClick={() => setCartMenu((pre) => !pre)} />
          </>
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
