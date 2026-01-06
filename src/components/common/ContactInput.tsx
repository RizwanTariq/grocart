import React, { useEffect, useState } from "react";

import { PK } from "country-flag-icons/react/3x2";
import { cn } from "@/utils/cn";

interface PhoneNumberProps {
  name: string;
  value: string;
  required?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ContactInput({
  name,
  value,
  onChange,
  required = true,
  className = "",
}: PhoneNumberProps) {
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (!value) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNumber(
      value.slice(0, 2) === "92" ? value.slice(2, value.length - 1) : value
    );
  }, [value]);
  return (
    <div
      className={cn(
        "relative flex items-center border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-rose-300",
        className
      )}
    >
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-3 border-r border-gray-200"
      >
        <PK className="w-5 h-5" />
        <span className="text-sm">+92</span>
      </button>

      <input
        type="tel"
        id={name}
        name={name}
        value={number}
        onChange={(e) => {
          if (e.target.value.length && e.target.value[0] === "0") {
            e.target.value = e.target.value.slice(1);
          }
          onChange(e);
        }}
        placeholder="eg. 300 123 4567"
        minLength={10}
        maxLength={10}
        pattern="[0-9]{10}"
        required={required}
        className="w-full px-3 py-3 outline-none rounded-r-xl"
        inputMode="numeric"
      />
    </div>
  );
}

export default ContactInput;
