"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  pathToGo: string;
  label: string;
  icon: LucideIcon;
  closeMobileMenu: () => void;
};
function SidebarLink({ pathToGo, label, icon: Icon, closeMobileMenu }: Props) {
  const pathname = usePathname();
  return (
    <Link
      href={pathToGo}
      onClick={closeMobileMenu}
      className={`flex items-center gap-3 p-3 bg-white/10 rounded-lg transition-all ${
        pathname === pathToGo
          ? "bg-white! text-rose-600 shadow-md font-semibold"
          : "hover:bg-white/20 text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default SidebarLink;
