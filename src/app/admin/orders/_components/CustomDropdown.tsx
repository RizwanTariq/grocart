"use client";

import { motion, AnimatePresence } from "motion/react";

import { ChevronDown, Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import PortalWrapper from "@/components/common/PortalWrapper";
import { useEffect, useRef, useState } from "react";

function CustomDropdown({
  isOpen,
  onToggle,
  selectedLabel,
  selectedId,
  onSelect,
  list,
  icon: Icon,
  loading = false,
  disabled = false,
  color = { text: "", bg: "", border: "" },
}: {
  isOpen: boolean;
  onToggle: () => void;
  selectedLabel: string | undefined;
  selectedId: string;
  onSelect: (id: string) => void;
  list: { id: string; label: string }[];
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  color?: { text: string; bg: string; border: string };
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      onToggle(); // close dropdown
    };

    // `true` catches scroll from any scrollable parent
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onToggle]);
  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (buttonRef.current) {
            setRect(buttonRef.current.getBoundingClientRect());
          }
          if (disabled || loading) return;
          onToggle();
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-3.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all cursor-pointer",
          isOpen && " border-rose-300 ring-2 ring-rose-100",
          color.bg,
          color.border
        )}
      >
        <span
          className={cn(
            "text-xs sm:text-sm font-medium text-gray-600 truncate",
            color.text
          )}
        >
          {selectedLabel}
        </span>
        <span className="flex items-center">
          {loading ? (
            <Loader2 className={cn("w-4 h-4 animate-spin", color.text)} />
          ) : (
            Icon && (
              <>
                <Icon
                  className={cn("w-5 h-5 text-gray-400 mr-3", color.text)}
                />
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <PortalWrapper>
            <div className="fixed inset-0 z-10" onClick={onToggle} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed sm:right-0 sm:left-auto mt-2 w-full bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-100 py-2 z-10"
              style={{
                top: rect ? rect.bottom : 0, // spacing below button
                left: rect ? rect.left : 0,
                width: rect ? rect.width : 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {list.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSelect(option.id);
                    onToggle();
                  }}
                  className={cn(
                    `w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm cursor-pointer`,
                    selectedId === option.id
                      ? `${
                          color.bg && color.text
                            ? color.bg + " " + color.text
                            : "bg-rose-50 text-rose-600"
                        } font-medium`
                      : "text-gray-700"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </PortalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomDropdown;
