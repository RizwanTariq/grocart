import { cn } from "@/utils/cn";
import { Search, X } from "lucide-react";

function SearchInput({
  value,
  placeholder = "Search products...",
  onChange,
  onClear,
}: {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex-1 relative">
      <Search
        className={cn(
          "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500",
          value.trim() && "text-rose-400"
        )}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 sm:pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white text-gray-500 placeholder-gray-500 shadow-sm text-sm sm:text-base"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
