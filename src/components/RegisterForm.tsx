"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, BadgeCheck, Lock, LogIn, Mail, User } from "lucide-react";

import { cn } from "@/utils/cn";

import Input from "./Input";
import Divider from "./Divider";

import googleLogo from "@/assets/google-icon.png";
import axios from "axios";

type RegisterFormProps = {
  onBack: () => void;
};
function RegisterForm({ onBack }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = name.length >= 4 && email.length >= 4 && password.length >= 8;
  async function register(data: FormData) {
    const name = data.get("name")?.toString();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      if (result.status === 201) {
        console.log(result);
      }
    } catch (error) {
      toast.error("Registration failed");
      console.error("Registration error:", error);
    }
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
        action={register}
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
          disabled={!isValid}
          className={cn(
            "w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer",
            isValid
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          )}
        >
          Register
        </button>
        <Divider text="OR" />
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium cursor-pointer transition-all duration-200"
        >
          <Image src={googleLogo} alt="Google logo" width={20} height={20} />
          Continue with Google
        </button>
      </motion.form>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-gray-500 mt-6 text-sm flex items-center gap-1.5 cursor-pointer"
      >
        Already have an account? <LogIn className="w-4 h-4" />
        <span className="text-rose-700">Sign in</span>
      </motion.p>
    </div>
  );
}

export default RegisterForm;
