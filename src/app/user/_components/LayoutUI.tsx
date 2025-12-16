"use client";

import NavBar from "@/components/features/navbar/NavBar";
import { usePathname } from "next/navigation";

export function LayoutUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/user/cart") || pathname.startsWith("/user/checkout");

  return (
    <>
      {!hideNavbar && <NavBar />}
      {children}
    </>
  );
}
