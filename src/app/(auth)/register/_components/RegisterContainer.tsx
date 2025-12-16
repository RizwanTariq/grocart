"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import Welcome from "./Welcome";

function RegisterContainer() {
  const [step, setStep] = useState(0);
  function handleNext() {
    setStep((prev) => prev + 1);
  }

  return <>{step === 0 ? <Welcome onNext={handleNext} /> : <RegisterForm />}</>;
}

export default RegisterContainer;
