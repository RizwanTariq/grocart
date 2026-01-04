"use client";

import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  autoComplete?: "on" | "off";
  Icon?: LucideIcon;
};

function Input({
  name,
  label,
  value,
  onChange,
  placeholder,
  required = true,
  type = "text",
  Icon,
  autoComplete = "on",
}: Props) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all",
            Icon && "pl-10"
          )}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );
}

export default Input;
