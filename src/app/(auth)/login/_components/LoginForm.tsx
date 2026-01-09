"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { BadgeCheck, LoaderCircle, Lock, LogIn, Mail } from "lucide-react";

import { cn } from "@/utils/cn";
import AuthInput from "@/components/features/auth/AuthInput";
import Divider from "@/components/common/Divider";
import { loginAction } from "@/app/actions/login";

import GoogleLogin from "@/components/features/auth/GoogleLogin";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.length >= 4 && password.length >= 8;

  function handleSubmit(data: FormData) {
    startTransition(async () => {
      setError("");
      try {
        await loginAction(data, redirectUrl); // ⬅ server action
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-rose-700"
      >
        Welcome back to {process.env.NEXT_PUBLIC_APP_NAME || "GroCart"}!
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
        <AuthInput
          type="email"
          placeholder="Your email"
          name="email"
          id="email"
          Icon={Mail}
          value={email}
          handleChange={setEmail}
        />
        <AuthInput
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
              : isPending
              ? "bg-green-300 text-white cursor-not-allowed shadow-none"
              : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          )}
        >
          Sign in
          {isPending ? (
            <LoaderCircle className="animate-spin w-5 h-5" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <Divider text="OR" />

        <GoogleLogin redirectUrl={redirectUrl} />
      </motion.form>

      <Link href={{ pathname: "/register", query: { redirectUrl } }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-500 mt-6 text-sm flex items-center gap-1.5 cursor-pointer"
        >
          Don&apos;t have an account? <LogIn className="w-4 h-4" />
          <span className="text-rose-700 font-semibold">Sign up</span>
        </motion.p>
      </Link>
    </div>
  );
}

export default LoginForm;
