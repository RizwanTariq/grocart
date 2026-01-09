"use client";

import { motion } from "motion/react";
import { ArrowRight, LandPlot, Store, TruckElectric } from "lucide-react";

type WelcomeProps = {
  onNext?: () => void;
};
function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="flex gap-2.5 items-center text-rose-700"
      >
        <Store className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
        <h1 className="text-4xl md:text-5xl font-extrabold">
          {process.env.NEXT_PUBLIC_APP_NAME || "GroCart"}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl"
      >
        {process.env.NEXT_PUBLIC_APP_NAME || "GroCart"} is your go-to online
        grocery store, offering a wide range of fresh produce, pantry
        essentials, and household items with fast and reliable delivery right to
        your doorstep.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex gap-10 mt-8"
      >
        <TruckElectric className="w-22 h-22 md:w-24 md:h-24 text-red-600 drop-shadow-lg drop-shadow-rose-100" />
        <LandPlot className="w-22 h-22 md:w-24 md:h-24 text-green-600 drop-shadow-lg drop-shadow-rose-100" />
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-8 mt-10 rounded-2xl cursor-pointer shadow-md"
        onClick={onNext}
      >
        Register
        <ArrowRight />
      </motion.button>
    </div>
  );
}

export default Welcome;
