"use client";
import {
  AtSign,
  Building2,
  Loader2,
  MailSearch,
  MapPin,
  MapPinHouse,
  UserRoundPen,
} from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

import Input from "./Input";
import { Coordinates } from "@/hooks/useGeoLocation";
import PhoneNumber from "./PhoneNumber";

const SearchAddressWithMap = dynamic(() => import("./SearchAddressWithMap"), {
  ssr: false,
});

export type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

type Props = {
  formData: FormData;
  showMap: boolean;
  position: Coordinates | null;
  isPositionLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetLocation: () => void;
  onChangePosition: (coords: Coordinates) => Promise<void>;
};

function AddressForm({
  formData,
  position,
  showMap,
  isPositionLoading,
  handleInputChange,
  handleGetLocation,
  onChangePosition,
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

      <form className="space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            label="Full Name"
            placeholder="eg. John Doe"
            required
            Icon={UserRoundPen}
          />

          <PhoneNumber
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            label="Phone Number"
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
          Icon={AtSign}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Street Address <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isPositionLoading}
              className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-xl disabled:bg-white disabled:text-rose-600/70 disabled:cursor-not-allowed hover:text-rose-700 font-medium cursor-pointer"
            >
              {isPositionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching your location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Use My Location
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <MapPinHouse className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full pl-10 px-3 py-3 text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all"
              placeholder="123 Main Street, Apt 4B"
              required
            />
          </div>
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
            Icon={Building2}
          />
          <Input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            label="Postal Code"
            placeholder="eg. 38000"
            required
            Icon={MailSearch}
          />
        </div>
      </form>
      <SearchAddressWithMap
        onChangePosition={onChangePosition}
        showMap={showMap}
        position={position}
      />
    </motion.div>
  );
}

export default AddressForm;
