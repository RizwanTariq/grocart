"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

type Props = {
  optionsArray: { id: string; label: string }[];
  name: string;
  label: string;
  value: string;
  required?: boolean;
  onSelected: (value: string) => void;
};

function Dropdown({
  optionsArray,
  name,
  label,
  value,
  required = true,
  onSelected,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = optionsArray.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = optionsArray.find((option) => option.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onSelected(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onSelected("");
    setSearchTerm("");
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative" ref={dropdownRef}>
        <label
          htmlFor={name}
          className="block text-gray-700 font-semibold mb-2 text-sm"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Custom Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-700 shadow-sm hover:border-pink-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : `Select ${name}`}
          </span>
          <div className="flex items-center gap-2">
            {selectedOption && (
              <X
                size={16}
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="
                absolute z-50 w-full mt-2 bg-white 
                border border-gray-200 rounded-lg shadow-xl
                overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200
              "
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${name}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                      w-full pl-10 pr-3 py-2 text-sm
                      border border-gray-200 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
                      transition-all
                    "
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className={`
                        w-full px-4 py-2.5 text-left text-sm
                        transition-colors duration-150
                        ${
                          value === option.id
                            ? "bg-pink-50 text-pink-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  {`No ${name}s found`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={value} required={required} />
      </div>
    </div>
  );
}

export default Dropdown;
