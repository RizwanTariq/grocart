"use client";

import NavBar from "@/components/features/navbar/NavBar";
import { usePathname } from "next/navigation";

export default function LayoutUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/admin/products/add") ||
    pathname.startsWith("/admin/products/");

  return (
    <>
      {!hideNavbar && <NavBar />}
      {children}
    </>
  );
}
