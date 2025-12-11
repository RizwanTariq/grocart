"use client";

import { motion } from "motion/react";
import { Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-16 w-16 text-rose-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Unauthorized: Access Denied
        </h1>

        <p className="text-gray-600 mb-8">
          You do not have permission to view this page. Please return to a safe
          location.
        </p>

        <Link href="/">
          <button className="bg-rose-600 hover:bg-rose-700 transition-colors text-white font-semibold py-2.5 px-6 rounded-xl w-full cursor-pointer flex items-center justify-center gap-2">
            <Home className="w-5 h-5" strokeWidth={2.6} />
            <span>Go to Home</span>
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
