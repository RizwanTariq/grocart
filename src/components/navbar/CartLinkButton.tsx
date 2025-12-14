"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { useStore } from "@/store/useStore";

function CartButton() {
  const cartCount = useStore((s) =>
    s.cartItems.reduce((sum, i) => sum + i.quantity, 0)
  );
  return (
    <Link
      href=""
      className="relative bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md shadow-black/30 hover:scale-105 transition-all"
    >
      <ShoppingCart className="w-6 h-6 text-red-700" strokeWidth={2} />
      <span className="absolute -top-1 -right-1 text-xs bg-rose-700 text-white w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
        {cartCount}
      </span>
    </Link>
  );
}

export default CartButton;
