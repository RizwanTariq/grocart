"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  pathToGo: string;
  label: string;
  icon: LucideIcon;
};

function NavLink({ pathToGo, label, icon: Icon }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={pathToGo}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white/10 ${
        pathname === pathToGo
          ? "bg-white! text-rose-600 shadow-md"
          : "text-white/90 hover:text-white hover:bg-white/20"
      }`}
    >
      <Icon className="w-5 h-5" strokeWidth={2.5} />
      <span>{label}</span>
    </Link>
  );
}

export default NavLink;
