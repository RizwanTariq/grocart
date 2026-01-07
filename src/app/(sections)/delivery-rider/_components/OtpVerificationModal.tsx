"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  RotateCcw,
} from "lucide-react";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  onResendOTP: () => Promise<boolean>;
  customerName: string;
  customerPhone: string;
  orderNumber: string;
}

const OTPVerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  onResendOTP,
  customerName,
  customerPhone,
  orderNumber,
}: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      // Focus first input when modal opens
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      // Submit on Enter if all fields filled
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      setVerifying(true);
      setError("");

      const isValid = await onVerify(otpString);

      if (isValid) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          resetModal();
        }, 1500);
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess(false);
    setResendSuccess(false);
    inputRefs.current[0]?.focus();
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || resending) return;

    try {
      setResending(true);
      setError("");
      setResendSuccess(false);

      const success = await onResendOTP();

      if (success) {
        setResendSuccess(true);
        setResendTimer(30); // 30 second cooldown
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        // Hide success message after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const resetModal = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess(false);
    setVerifying(false);
    setResending(false);
    setResendSuccess(false);
    setResendTimer(0);
  };

  const handleClose = () => {
    if (!verifying) {
      onClose();
      setTimeout(resetModal, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-linear-to-br from-emerald-500 to-green-600 z-10 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      Delivery Verified!
                    </p>
                    <p className="text-emerald-100 mt-2">
                      Order completed successfully
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-linear-to-r from-rose-500 to-pink-600 p-6 text-white relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Verify Delivery</h2>
                      <p className="text-xs text-blue-100">
                        Order #{orderNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={verifying}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Customer Info */}
              <div className="bg-linear-to-br from-rose-50 to-pink-50 rounded-xl p-4 mb-6 border border-blue-100">
                <p className="text-sm text-gray-600 mb-2">Customer Details</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {customerName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customerPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6 text-center">
                <p className="text-gray-700 font-medium mb-2">
                  Enter the 6-digit OTP from customer
                </p>
                <p className="text-sm text-gray-500">
                  Customer received this code via SMS
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-2 md:gap-3 mb-6">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={verifying || success}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none ${
                      error
                        ? "border-red-300 bg-red-50"
                        : digit
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-blue-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                ))}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resend Success Message */}
              <AnimatePresence>
                {resendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                      New OTP sent successfully!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resend OTP Button */}
              <div className="mb-4 text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={
                    resendTimer > 0 || resending || verifying || success
                  }
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending new OTP...
                    </>
                  ) : resendTimer > 0 ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Resend OTP in {resendTimer}s
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Resend OTP to Customer
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  disabled={verifying || success || otp.every((d) => !d)}
                  className="flex-1 px-4 py-3 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerify}
                  disabled={verifying || success || otp.some((d) => !d)}
                  className="flex-2 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl cursor-pointer font-bold hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Verify Delivery
                    </>
                  )}
                </motion.button>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Ask the customer for the 6-digit verification code
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OTPVerificationModal;
