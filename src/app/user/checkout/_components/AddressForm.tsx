"use client";
import { CheckCircle, MapPin } from "lucide-react";
import { motion } from "motion/react";

import Input from "./Input";

type Props = {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number | null;
    longitude: number | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetLocation: () => void;
};

function AddressForm({
  formData,
  handleInputChange,
  handleGetLocation,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-rose-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
      </div>

      <form className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            label="Full Name"
            placeholder="eg. John Doe"
            required
          />

          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            label="Phone Number"
            placeholder="eg. 2345678900"
            required
          />
        </div>

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          label="Email Address"
          placeholder="eg. john@example.com"
          required={false}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              <MapPin className="w-4 h-4" />
              Use My Location
            </button>
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            placeholder="123 Main Street, Apt 4B"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            label="City"
            placeholder="eg. New York"
            required
          />
          <Input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            label="Postal Code"
            placeholder="eg. 380000"
            required
          />
        </div>

        {formData.latitude && formData.longitude && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Location captured
              </p>
              <p className="text-xs text-green-700 mt-1">
                Lat: {formData.latitude.toFixed(6)}, Long:{" "}
                {formData.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </form>
    </motion.div>
  );
}

export default AddressForm;
