"use client";

import NavBar from "@/components/features/navbar/NavBar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export function LayoutUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/user/cart") ||
    pathname.startsWith("/user/checkout") ||
    pathname.startsWith("/user/orders");

  return (
    <>
      {!hideNavbar && <NavBar />}
      {children}
      <Footer />
    </>
  );
}
