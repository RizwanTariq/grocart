"use client";

import dynamic from "next/dynamic";
import { useState, useTransition, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const LocationPickerMap = dynamic(
  () => import("@/components/features/maps/LocationPickerMap"),
  { ssr: false }
);

type Result = {
  bounds: Array<[number, number]>;
  label: string;
  raw: {
    addresstype: string;
    boundingbox: Array<string>;
    class: string;
    display_name: string;
    importance: number;
    lat: string;
    licence: string;
    lon: string;
    name: string;
    osm_id: number;
    osm_type: string;
    place_id: number;
    place_rank: number;
    type: string;
  };
  x: number;
  y: number;
};

function SearchAddressWithMap({
  showMap,
  position,
  onChangePosition,
}: {
  showMap: boolean;
  position: { lat: number; lng: number } | null;
  onChangePosition: (coords: { lat: number; lng: number }) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [searchAddress, setSearchAddress] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    startTransition(async () => {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchAddress });
      setResults(results as unknown as Result[]);
      setIsOpen(results.length > 0);
    });
  };

  const handleSelectAddress = (result: Result) => {
    setJustSelected(true);
    setSearchAddress("");
    setIsOpen(false);
    setResults([]);
    onChangePosition({
      lat: Number(result.raw.lat),
      lng: Number(result.raw.lon),
    });
  };

  const handleClear = () => {
    setJustSelected(false);
    setSearchAddress("");
    setResults([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Skip search if we just selected an address
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    if (searchAddress.length > 2) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAddress]);

  return (
    <div className="flex flex-col gap-3">
      <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Search for an address..."
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPending && (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            )}
            {searchAddress && !isPending && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-99999 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
            >
              {results.map((result, index) => (
                <motion.button
                  key={result.raw.place_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectAddress(result)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                >
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.raw.name || result.label.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {result.label}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showMap && (
        <LocationPickerMap
          value={position ?? undefined}
          onPositionChange={onChangePosition}
          zoom={15}
          loading={isPending}
        />
      )}
    </div>
  );
}

export default SearchAddressWithMap;
