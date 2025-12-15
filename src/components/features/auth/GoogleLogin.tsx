"use client";

import Image from "next/image";
import { oAuthloginAction } from "@/app/actions/oAuthLogin";
import googleLogo from "@/assets/google-icon.png";

function GoogleLogin({ redirectUrl }: { redirectUrl: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2.5 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium cursor-pointer transition-all duration-200"
      onClick={() => oAuthloginAction("google", redirectUrl)}
    >
      <Image src={googleLogo} alt="Google logo" width={20} height={20} />
      Continue with Google
    </button>
  );
}

export default GoogleLogin;
