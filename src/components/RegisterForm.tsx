"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  LoaderCircle,
  Lock,
  LogIn,
  Mail,
  User,
  UserRoundPlus,
} from "lucide-react";

import { registerAction } from "@/app/actions/register";
import { cn } from "@/utils/cn";

import Input from "./Input";
import Divider from "./Divider";
import GoogleLogin from "./GoogleLogin";

type RegisterFormProps = {
  onBack: () => void;
};
function RegisterForm({ onBack }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/";
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = name.length >= 4 && email.length >= 4 && password.length >= 8;
  async function handleSubmit(data: FormData) {
    startTransition(async () => {
      setError("");
      try {
        await registerAction(data); // ⬅ server action
        console.log("User registered!");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        router.push(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    });
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={onBack}
        className="inline-flex items-center gap-1.5 absolute top-6 left-6 md:top-8 md:left-8 text-rose-500 hover:text-rose-600 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
      >
        <ArrowLeft w-5 h-5 /> Back
      </motion.button>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-rose-700"
      >
        Create an account
      </motion.h1>
      <p className="flex items-center gap-2 mt-3 text-medium md:text-lg text-gray-600">
        Join GroCart and start your shopping journey!
        <BadgeCheck className="w-6 h-6 text-green-500" />
      </p>
      <motion.form
        className="flex flex-col gap-4 w-full max-w-sm mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        action={handleSubmit}
      >
        <Input
          type="name"
          placeholder="Your name"
          name="name"
          id="name"
          Icon={User}
          value={name}
          handleChange={setName}
        />
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
          disabled={!isValid || isPending}
          className={cn(
            "w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer",
            isValid
              ? "bg-green-600 hover:bg-green-700 text-white"
              : isPending
              ? "bg-green-300 text-white cursor-not-allowed shadow-none"
              : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          )}
        >
          <span>Register</span>
          {isPending ? (
            <LoaderCircle className="animate-spin w-5 h-5" />
          ) : (
            <UserRoundPlus className="w-5 h-5" />
          )}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <Divider text="OR" />
        <GoogleLogin redirectUrl={redirectUrl} />
      </motion.form>
      <Link href={{ pathname: "/login", query: { redirectUrl } }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-500 mt-6 text-sm flex items-center gap-1.5 cursor-pointer"
        >
          Already have an account? <LogIn className="w-4 h-4" />
          <span className="text-rose-700">Sign in</span>
        </motion.p>
      </Link>
    </div>
  );
}

export default RegisterForm;
