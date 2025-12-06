"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { BadgeCheck, LoaderCircle, Lock, LogIn, Mail } from "lucide-react";

import { cn } from "@/utils/cn";
import Input from "@/components/Input";
import Divider from "@/components/Divider";
import googleLogo from "@/assets/google-icon.png";
import { loginAction } from "@/app/actions/login";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { oAuthloginAction } from "@/app/actions/oAuthLogin";

function LoginForm() {
  const session = useSession();
  console.log(session);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.length >= 4 && password.length >= 8;

  async function handleSubmit(data: FormData) {
    setLoading(true);
    try {
      await loginAction(data); // ⬅ server action
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-rose-700"
      >
        Welcome back to GroCart!
      </motion.h1>
      <p className="flex items-center gap-2 mt-3 text-medium md:text-lg text-gray-600">
        Sign in to manage your account, orders, and more.
        <BadgeCheck className="w-6 h-6 hidden sm:block text-green-500" />
      </p>
      <motion.form
        className="flex flex-col gap-4 w-full max-w-sm mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        action={handleSubmit}
      >
        <Input
          type="email"
          placeholder="Your email"
          name="email"
          id="email"
          Icon={Mail}
          value={email}
          handleChange={setEmail}
        />
        <Input
          type="password"
          placeholder="Enter password"
          name="password"
          id="password"
          autoComplete="off"
          Icon={Lock}
          value={password}
          handleChange={setPassword}
        />
        <button
          type="submit"
          disabled={!isValid}
          className={cn(
            "w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer",
            isValid
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          )}
        >
          Sign in
          {loading ? (
            <LoaderCircle className="animate-spin w-5 h-5" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
        </button>
        <Divider text="OR" />
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium cursor-pointer transition-all duration-200"
          onClick={() => oAuthloginAction("google")}
        >
          <Image src={googleLogo} alt="Google logo" width={20} height={20} />
          Continue with Google
        </button>
      </motion.form>
      <Link href="/register">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-500 mt-6 text-sm flex items-center gap-1.5 cursor-pointer"
        >
          Don&apos;t have an account? <LogIn className="w-4 h-4" />
          <span className="text-rose-700">Sign up</span>
        </motion.p>
      </Link>
    </div>
  );
}

export default LoginForm;
