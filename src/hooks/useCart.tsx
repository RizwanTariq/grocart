"use client";

import { useStore } from "@/store/useStore";

function useCart() {
  const cartItems = useStore((s) => s.cartItems);
  const totalItems = useStore((s) => s.cartItems.length);
  const cartCount = useStore((s) =>
    s.cartItems.reduce((sum, i) => sum + i.quantity, 0)
  );
  const cartTotal = useStore((s) =>
    s.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  const removeFromCart = useStore((s) => s.removeFromCart);
  const increaseQuantity = useStore((s) => s.increaseQuantity);
  const decreaseQuantity = useStore((s) => s.decreaseQuantity);

  return {
    cartCount,
    cartTotal,
    cartItems,
    totalItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  };
}

export default useCart;
