"use client";

type Props = {
  name: string;
  label: string;
  value: number | null;
  required?: boolean;
  onChange: (value: number) => void;
};

function NumberField({ name, label, value, required = true, onChange }: Props) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        name={name}
        id={name}
        value={value ?? ""}
        onChange={(e) => onChange(+e.target.value)}
        placeholder="eg. 40"
        min="0"
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 md:px-6 py-2 md:py-3 text-gray-700 focus:ring-1 focus:ring-pink-500 focus:border-pink-600 outline-none transition-colors"
      />
    </div>
  );
}

export default NumberField;
