import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";

type Props = {
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info";
  Icon: LucideIcon;
};

export const sizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-14 h-14",
  "2xl": "w-16 h-16",
};

export const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
  "2xl": "w-8 h-8",
};

export const variants = {
  primary: "bg-rose-50 hover:bg-rose-100",
  secondary: "bg-gray-50 hover:bg-gray-100",
  danger: "bg-red-50 hover:bg-red-100",
  success: "bg-green-50 hover:bg-green-100",
  warning: "bg-yellow-50 hover:bg-yellow-100",
  info: "bg-blue-50 hover:bg-blue-100",
};

export const colors = {
  primary: "text-rose-600",
  secondary: "text-gray-600",
  danger: "text-red-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

function IconButton({
  onClick,
  className,
  size = "md",
  variant = "primary",
  Icon,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg hover:scale-105 active:scale-95 flex items-center justify-center transition-all shrink-0 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <Icon className={cn(iconSizes[size], colors[variant])} strokeWidth={2} />
    </button>
  );
}

export default IconButton;
