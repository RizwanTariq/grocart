"use client";

import { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

type Props = {
  id?: string;
  type: string;
  name: string;
  placeholder: string;
  Icon: LucideIcon;
  autoComplete?: "on" | "off";
  value?: string;
  handleChange?: (value: string) => void;
};
function AuthInput({
  type,
  placeholder,
  name,
  id = Date.now().toString(),
  Icon,
  value = "",
  handleChange = () => {},
  autoComplete = "on",
}: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        type={isPassword && show ? "text" : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        minLength={isPassword ? 8 : 3}
        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-700 focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors "
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}

export default AuthInput;
