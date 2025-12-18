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

  const deliveryFee = cartTotal > 1000 ? 0 : 50;
  const discount = 80;
  const grossTotal = cartTotal + deliveryFee - discount;

  const removeFromCart = useStore((s) => s.removeFromCart);
  const increaseQuantity = useStore((s) => s.increaseQuantity);
  const decreaseQuantity = useStore((s) => s.decreaseQuantity);
  const clearCart = useStore((s) => s.clearCart);

  return {
    cartCount,
    cartTotal,
    cartItems,
    totalItems,
    deliveryFee,
    discount,
    grossTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };
}

export default useCart;
