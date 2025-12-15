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
        className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-all cursor-pointer relative"
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
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white rounded-full px-4 py-2.5 w-[90%] shadow-lg"
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="search"
              placeholder="Search groceries..."
              className="w-full px-3 focus:outline-none text-gray-500 placeholder-gray-500"
            />
            <div
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setOpen((pre) => !pre)}
            >
              <X className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBarMobile;
