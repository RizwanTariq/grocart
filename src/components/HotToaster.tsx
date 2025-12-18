"use client";

import { Toaster, toast, resolveValue } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from "lucide-react";

function HotToaster() {
  return (
    <Toaster
      position="bottom-right"
      containerStyle={{ bottom: "2rem", right: "2rem" }}
    >
      {(t) => {
        const config = {
          success: {
            icon: <CheckCircle2 className="w-5 h-5" />,
            iconBg: "bg-linear-to-br from-emerald-400 to-emerald-600",
            bgGradient: "bg-linear-to-br from-emerald-50 to-white",
            border: "border-emerald-200",
            iconColor: "text-white",
            shadow: "shadow-emerald-100",
          },
          error: {
            icon: <XCircle className="w-5 h-5" />,
            iconBg: "bg-linear-to-br from-red-400 to-red-600",
            bgGradient: "bg-linear-to-br from-red-50 to-white",
            border: "border-red-200",
            iconColor: "text-white",
            shadow: "shadow-red-100",
          },
          loading: {
            icon: (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ),
            iconBg: "bg-linear-to-br from-blue-400 to-blue-600",
            bgGradient: "bg-linear-to-br from-blue-50 to-white",
            border: "border-blue-200",
            iconColor: "text-white",
            shadow: "shadow-blue-100",
          },
          blank: {
            icon: <Info className="w-5 h-5" />,
            iconBg: "bg-linear-to-br from-gray-400 to-gray-600",
            bgGradient: "bg-linear-to-br from-gray-50 to-white",
            border: "border-gray-200",
            iconColor: "text-white",
            shadow: "shadow-gray-100",
          },
          custom: {
            icon: <Info className="w-5 h-5" />,
            iconBg: "bg-linear-to-br from-gray-400 to-gray-600",
            bgGradient: "bg-linear-to-br from-gray-50 to-white",
            border: "border-gray-200",
            iconColor: "text-white",
            shadow: "shadow-gray-100",
          },
        };

        // Check if this is a warning toast
        const isWarning =
          t.icon && typeof t.icon === "string" && t.icon === "warning";

        if (isWarning) {
          config.blank = {
            icon: <AlertTriangle className="w-5 h-5" />,
            iconBg: "bg-linear-to-br from-amber-400 to-amber-600",
            bgGradient: "bg-linear-to-br from-amber-50 to-white",
            border: "border-amber-200",
            iconColor: "text-white",
            shadow: "shadow-amber-100",
          };
        }

        const currentConfig = config[t.type];

        return (
          <AnimatePresence>
            {t.visible && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95, x: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: 50,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className={`
                  flex items-start justify-center gap-3 px-4 py-3.5 rounded-xl border
                  ${currentConfig.bgGradient}
                  ${currentConfig.border}
                  ${currentConfig.shadow}
                  shadow-xl backdrop-blur-sm max-w-md min-w-[280px]
                  relative overflow-hidden
                `}
              >
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                />

                {/* Icon container */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className={`
                    shrink-0 w-9 h-9 rounded-lg ${currentConfig.iconBg}
                    flex items-center justify-center shadow-md
                    ${currentConfig.iconColor}
                  `}
                >
                  {(typeof t.icon !== "string" && t.icon) || currentConfig.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm font-semibold text-gray-900 leading-relaxed"
                  >
                    {resolveValue(t.message, t)}
                  </motion.div>
                </div>

                {/* Close button */}
                {t.type !== "loading" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => toast.dismiss(t.id)}
                    className="shrink-0 p-1 rounded-md hover:bg-gray-900/5 transition-all duration-200 hover:scale-110 active:scale-95 w-8 h-8 flex items-center justify-center cursor-pointer"
                    aria-label="Close notification"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        );
      }}
    </Toaster>
  );
}

export default HotToaster;
