import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function SearchBarMobile() {
  const [open, setOpen] = useState(false);
  const searchCont = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchCont.current &&
        !searchCont.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchCont}>
      <div
        className="sm:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-all cursor-pointer relative"
        onClick={() => setOpen((pre) => !pre)}
      >
        <Search className="h-6 w-6 text-rose-700" />
      </div>
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-22 left-1/2 -translate-x-1/2 z-50 w-[90%] flex sm:hidden"
          >
            <div className="w-full h-full flex items-center">
              <Search className="w-5 h-5 text-gray-500 absolute left-3" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-10 py-3 bg-white rounded-xl focus:outline-none text-gray-500 placeholder-gray-500 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 shadow-lg "
              />
              <div
                className="absolute right-3 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setOpen((pre) => !pre)}
              >
                <X className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBarMobile;
