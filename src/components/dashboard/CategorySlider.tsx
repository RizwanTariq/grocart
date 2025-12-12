"use client";

import { useRef, useEffect } from "react";
import {
  Apple,
  Baby,
  Coffee,
  Egg,
  Home,
  Leaf,
  Milk,
  Package,
  User,
  Heart,
  Shell,
  Plus,
  Flower2,
  Wheat,
  Bone,
  Bean,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";

export default function CategorySlider() {
  const categories = [
    {
      id: "VEGETABLES",
      label: "Vegetables",
      Icon: Leaf,
      color: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      id: "FRUITS",
      label: "Fruits",
      Icon: Apple,
      color: "text-red-700",
      bgColor: "bg-red-50",
    },
    {
      id: "DAIRY_EGGS",
      label: "Dairy & Eggs",
      Icon: Egg,
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    {
      id: "GRAINS",
      label: "Grains",
      Icon: Wheat,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      id: "SEAFOOD",
      label: "Seafood",
      Icon: Shell,
      color: "text-pink-700",
      bgColor: "bg-pink-50",
    },
    {
      id: "SPICES",
      label: "Spices",
      Icon: Flower2,
      color: "text-indigo-700",
      bgColor: "bg-indigo-50",
    },
    {
      id: "BEVERAGES",
      label: "Beverages",
      Icon: Coffee,
      color: "text-orange-700",
      bgColor: "bg-orange-50",
    },
    {
      id: "PERSONAL_CARE",
      label: "Personal Care",
      Icon: User,
      color: "text-teal-700",
      bgColor: "bg-teal-50",
    },
    {
      id: "HOUSEHOLD",
      label: "Household",
      Icon: Home,
      color: "text-lime-700",
      bgColor: "bg-lime-50",
    },
    {
      id: "PACKAGED",
      label: "Packaged Food",
      Icon: Package,
      color: "text-cyan-700",
      bgColor: "bg-cyan-50",
    },
    {
      id: "BABY_CARE",
      label: "Baby Care",
      Icon: Baby,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      id: "PET_CARE",
      label: "Pet Care",
      Icon: Bone,
      color: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      id: "HEALTH",
      label: "Health",
      Icon: Heart,
      color: "text-fuchsia-700",
      bgColor: "bg-fuchsia-50",
    },
    {
      id: "CANNED",
      label: "Canned Goods",
      Icon: Bean,
      color: "text-rose-700",
      bgColor: "bg-rose-50",
    },
    {
      id: "CONDIMENTS",
      label: "Condiments",
      Icon: Milk,
      color: "text-sky-700",
      bgColor: "bg-sky-50",
    },
    {
      id: "FROZEN",
      label: "Frozen",
      Icon: Package,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      id: "OTHERS",
      label: "Others",
      Icon: Plus,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    },
  ];

  const sliderRef = useRef<HTMLDivElement>(null);
  const infiniteCategories = [...categories, ...categories, ...categories];
  const scroll = (dir: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: dir === "left" ? -404 : 404,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const itemWidth = 204;
    slider.scrollLeft = categories.length * itemWidth;

    const handleScroll = () => {
      if (!slider) return;

      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const currentScroll = slider.scrollLeft;
      const sectionWidth = categories.length * itemWidth;

      if (currentScroll >= maxScroll - 10) {
        slider.scrollLeft = sectionWidth;
      } else if (currentScroll <= 10) {
        slider.scrollLeft = sectionWidth;
      }
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [categories.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      scroll("left");
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: "some" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-[90%] md:w-[80%] mx-auto mt-9 sm:mt-12 relative"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-rose-700 mb-8 text-center">
        🛒 Shop by Category
      </h2>

      <button
        className="absolute left-0 top-[60%] -translate-y-[60%] z-20 bg-white shadow-lg hover:bg-rose-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-6 h-6 text-rose-600" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto px-12 pb-6 no-scrollbar scroll-smooth"
      >
        {infiniteCategories.map(({ id, label, Icon, color, bgColor }, i) => (
          <div
            key={cn(id, "-", i)}
            className={cn(
              "min-w-[180px] shrink-0 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95",
              bgColor
            )}
          >
            <div className="flex flex-col items-center justify-center p-5">
              <Icon className={cn("w-10 h-10 mb-3", color)} />
              <p className="text-center text-sm md:text-base text-gray-600 font-semibold">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute right-0 top-[60%] -translate-y-[60%] z-20 bg-white shadow-lg hover:bg-rose-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-6 h-6 text-rose-600" />
      </button>
    </motion.div>
  );
}
