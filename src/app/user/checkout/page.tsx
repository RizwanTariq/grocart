"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import AddressForm, { FormData } from "./_components/AddressForm";
import PaymentSelector from "./_components/PaymentSelector";
import Header from "./_components/Header";
import OrderSummary from "./_components/OrderSummary";
import OrderPlacedCard from "./_components/OrderPlacedCard";
import axios from "axios";
import useLocalStorageState from "use-local-storage-state";
import useGeoLocation, { Coordinates } from "@/hooks/useGeoLocation";
import { PAYMENT_METHOD } from "@/types/enums";
import useCart from "@/hooks/useCart";
import { extractApiError } from "@/types";

export default function CheckoutPage() {
  const user = useUser();
  const { getCurrentLocation } = useGeoLocation();
  const { clearCart, cartItems, grossTotal, cartCount } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(
    PAYMENT_METHOD.COD
  );
  const [processing, setProcessing] = useState(false);
  const [orderPlacedNum, setOrderPlacedNum] = useState("");

  const [position, setPosition] = useLocalStorageState<Coordinates | null>(
    "checkout-position",
    { defaultValue: null }
  );

  const [formData, setFormData] = useLocalStorageState<FormData>(
    "checkout-form-data",
    {
      defaultValue: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
      },
    }
  );

  const showMap = !!position?.lat && !!position?.lng;

  useEffect(() => {
    if (user) {
      setFormData((pre) => ({
        ...pre,
        fullName: pre.fullName || user?.name || "",
        email: pre.email || user?.email || "",
        phone: pre.phone || user?.contact || "",
      }));
    }
  }, [user, setFormData]);

  const handlePositionChange = async (coords: Coordinates) => {
    if (coords.lat === position?.lat && coords.lng === position?.lng) return;
    setPosition(coords);
    try {
      const res = await axios.post("/api/reverse-geocode", coords);
      const { address, displayName } = res.data;

      setFormData((pre) => ({
        ...pre,
        address: displayName || "",
        city:
          address?.city ||
          address?.municipality ||
          address?.subdistrict ||
          address?.town ||
          address?.district ||
          "",
        postalCode: address?.postcode || "",
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    });
    setPosition(null);
    clearCart();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === PAYMENT_METHOD.COD) {
      handleCodOrder();
    }

    if (paymentMethod === PAYMENT_METHOD.CARD) {
      handleCardPayment();
    }
  };

  const handleCardPayment = async () => {
    setProcessing(true);
    try {
      const res = await axios.post("/api/user/payment", {
        paymentMethod,
        totalItemsCount: cartCount,
        totalAmount: grossTotal,
        address: { ...formData, coordinates: position },
        items: cartItems.map((i) => ({
          _id: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          unit: i.unit,
        })),
      });

      if (res.status === 201) {
        window.location.href = res.data.paymentRedirectUrl;
      }
    } catch (err: unknown) {
      const error = extractApiError(err);
      if (error) {
        toast.error(error.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCodOrder = async () => {
    setProcessing(true);
    try {
      const res = await axios.post("/api/user/orders", {
        paymentMethod,
        totalAmount: grossTotal,
        address: { ...formData, coordinates: position },
        items: cartItems.map((i) => ({
          _id: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          unit: i.unit,
        })),
      });

      if (res.status === 201) {
        setOrderPlacedNum(res.data?.orderNumber);
        resetForm();
        toast.success("Order Placed Successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (orderPlacedNum) {
    return <OrderPlacedCard orderNumber={orderPlacedNum} />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <AddressForm
              formData={formData}
              position={position}
              onChangePosition={handlePositionChange}
              showMap={showMap}
              handleInputChange={handleInputChange}
              handleGetLocation={() => getCurrentLocation(handlePositionChange)}
            />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Payment Method */}
            <PaymentSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            {/* Right Section - Order Summary */}
            <OrderSummary
              handleSubmit={handleSubmit}
              processing={processing}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
