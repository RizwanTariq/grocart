"use client";

import { motion } from "motion/react";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  tooltip: string;
}

export default function Tooltip({ children, tooltip }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap 
                      bg-black text-white text-sm px-3.5 py-1.5 rounded-lg shadow-lg
                      shadow-black/30 z-999"
        >
          {tooltip}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
        </motion.div>
      )}
    </div>
  );
}
