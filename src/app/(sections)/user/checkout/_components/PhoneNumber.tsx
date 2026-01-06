import React from "react";

import ContactInput from "@/components/common/ContactInput";

interface PhoneNumberProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} <span className="text-red-500">*</span>
      </label>

      <ContactInput
        name={name}
        value={value}
        onChange={onChange}
        required={true}
      />
    </div>
  );
};

export default PhoneNumber;
