"use client";

import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import Welcome from "@/components/Welcome";

function RegisterPage() {
  const [step, setStep] = useState(0);
  function handleNext() {
    setStep((prev) => prev + 1);
  }
  function handleBack() {
    setStep((prev) => prev - 1);
  }
  return (
    <div>
      {step === 0 ? (
        <Welcome onNext={handleNext} />
      ) : (
        <RegisterForm onBack={handleBack} />
      )}
    </div>
  );
}

export default RegisterPage;
