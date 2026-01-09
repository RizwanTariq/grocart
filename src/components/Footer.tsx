"use client";

import { PRODUCT_CATEGORY } from "@/types/enums";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ChevronRight,
  Clock,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Refund Policy", href: "#" },
  ];

  const categories = [
    {
      name: "Vegetables",
      href: `/products?category=${PRODUCT_CATEGORY.VEGETABLES}`,
    },
    {
      name: "Fruits",
      href: `/products?category=${PRODUCT_CATEGORY.VEGETABLES}`,
    },
    {
      name: "Dairy & Eggs",
      href: `/products?category=${PRODUCT_CATEGORY.DAIRY_EGGS}`,
    },
    {
      name: "Beverages",
      href: `/products?category=${PRODUCT_CATEGORY.BEVERAGES}`,
    },
    {
      name: "Personal Care",
      href: `/products?category=${PRODUCT_CATEGORY.PERSONAL_CARE}`,
    },
    {
      name: "Household",
      href: `/products?category=${PRODUCT_CATEGORY.HOUSEHOLD_ESSENTIALS}`,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      color: "hover:bg-blue-600",
    },
    { icon: Twitter, href: "https://twitter.com", color: "hover:bg-sky-500" },
    {
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:bg-pink-600",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      color: "hover:bg-blue-700",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      desc: "On orders above Rs. 1000",
    },
    {
      icon: Clock,
      title: "Quick Service",
      desc: "Delivered within 30 mins",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      desc: "100% secure transactions",
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      desc: "7-day return policy",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    >
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-linear-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">GroCart</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for fresh groceries delivered to your
              doorstep. Quality products, fast delivery, and exceptional
              service.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </a>
              <a
                href="mailto:support@grocart.com"
                className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@grocart.com</span>
              </a>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>123 Main Street, Rawalpindi, Punjab, Pakistan</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-rose-500 hover:translate-x-1 transition-all group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:text-rose-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category, idx) => (
                <li key={idx}>
                  <Link
                    href={category.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-rose-500 hover:translate-x-1 transition-all group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:text-rose-500" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-white placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/50"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:text-white transition-all ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} GroCart. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> by Your
              Team
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
