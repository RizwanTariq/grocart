"use client";

import { cn } from "@/utils/cn";
import { Salad, Smartphone, Store, TruckElectric } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function HeroSection() {
  const slides = [
    {
      id: 1,
      title: "Fresh Organic Produced Groceries 🍎",
      content:
        "Fresh fruits, vegetables, and pantry items delivered to your doorstep.",
      Icon: (
        <Salad className="w-20 h-20 sm:w-28 sm:h-28 text-rose-400 drop-shadow-xl" />
      ),
      buttonText: "Order Now",
      bgImage:
        "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Fast & Fresh Delivery 🚚",
      content:
        "Fast and reliable delivery right to your doorstep, ensuring your groceries arrive fresh and on time.",
      Icon: (
        <TruckElectric className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-xl" />
      ),
      buttonText: "Shop Now",
      bgImage:
        "https://images.unsplash.com/photo-1607273685680-6bd976c5a5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Shop anytime, anywhere 🌟",
      content:
        "Shop from the comfort of your home or office, with our convenient delivery service available 24/7.",
      Icon: (
        <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-emerald-400 drop-shadow-xl" />
      ),
      buttonText: "Get Started",
      bgImage:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  const [activeSlide, setActiveSlide] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) =>
        prevSlide === slides.length ? 1 : prevSlide + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlide, slides.length]);
  return (
    <div className="relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[activeSlide - 1].bgImage}
            alt={slides[activeSlide - 1].title}
            className="object-cover"
            fill
            priority
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          key={activeSlide}
          className="flex flex-col items-center justify-center gap-6 max-w-3xl"
        >
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full shadow-lg">
            {slides[activeSlide - 1].Icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-lg">
            {slides[activeSlide - 1].title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 max-w-2xl">
            {slides[activeSlide - 1].content}
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            key={activeSlide}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black/10 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
          >
            <Store className="w-10 h-10" />
            <span className="text-lg font-semibold">
              {slides[activeSlide - 1].buttonText}
            </span>
          </motion.button>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2.5">
        {slides.map((_) => (
          <button
            key={_.id}
            className={cn(
              "w-3 h-3 rounded-full cursor-pointer transition-all",
              activeSlide === _.id ? "bg-white w-5 h-5" : "bg-white/50"
            )}
            onClick={() => setActiveSlide(_.id)}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;
