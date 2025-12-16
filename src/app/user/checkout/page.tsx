"use client";

import { useState } from "react";

import { useUser } from "@/hooks/useUser";
import AddressForm from "./_components/AddressForm";
import PaymentSelector from "./_components/PaymentSelector";
import Header from "./_components/Header";
import OrderSummary from "./_components/OrderSummary";
import OrderPlacedCard from "./_components/OrderPlacedCard";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [showMap, setShowMap] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const user = useUser();

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number | null;
    longitude: number | null;
  }>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.contact || "",
    address: "",
    city: "",
    postalCode: "",
    latitude: null,
    longitude: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setShowMap(true);
          // In production, you'd reverse geocode to get the address
          alert(
            `Location captured: ${position.coords.latitude}, ${position.coords.longitude}`
          );
        },
        (error) => {
          alert("Unable to get location. Please enter address manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (paymentMethod === "stripe") {
      // In production, redirect to Stripe checkout
      alert("Redirecting to Stripe payment...");
    } else {
      setOrderPlaced(true);
    }

    setProcessing(false);
  };

  if (orderPlaced) {
    return <OrderPlacedCard />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <AddressForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleGetLocation={handleGetLocation}
            />

            {/* Payment Method */}
            <PaymentSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* Right Section - Order Summary */}
          <OrderSummary
            handleSubmit={handleSubmit}
            processing={processing}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
}
