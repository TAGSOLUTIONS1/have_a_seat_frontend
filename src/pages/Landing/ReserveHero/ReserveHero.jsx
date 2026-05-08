import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getCurrentDate } from "@/lib/utils";
import {
  getCurrentTime,
  initialBookingState,
} from "@/components/constants/constants";
import LoadingScreens from "../Section2/LoadingScreens";
import GeoApiAuto from "@/components/home/HomeAutoComplete";
import { MdLocationOn } from "react-icons/md";

const HERO_IMG =
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1934&auto=format&fit=crop";

export default function ReserveHero() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const locationRef = useRef({
    location: "",
    latitude: null,
    longitude: null,
  });

  const goToRestaurants = (override) => {
    const effective = override ?? locationRef.current;

    setIsLoading(true);

    const savedData = localStorage.getItem("searchFormData");
    let formData;

    if (savedData) {
      try {
        formData = JSON.parse(savedData);
      } catch (e) {
        console.error("Error parsing saved form data:", e);
        formData = initialBookingState;
      }
    } else {
      formData = {
        ...initialBookingState,
        reservation_date: getCurrentDate(),
        date: getCurrentDate(),
        reservation_time: getCurrentTime(),
      };
    }

    if (effective.location) {
      const firstWord = effective.location.split(",")[0].trim();
      formData = {
        ...formData,
        location: firstWord,
        latitude: effective.latitude ?? formData.latitude ?? "",
        longitude: effective.longitude ?? formData.longitude ?? "",
      };
    }

    localStorage.setItem("searchFormData", JSON.stringify(formData));

    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;

    setTimeout(() => {
      navigate(route);
      setTimeout(() => setIsLoading(false), 100);
    }, 500);
  };

  const getLocationData = (value) => {
    const locationString =
      typeof value === "string" ? value : value?.location || value;
    const latitude =
      typeof value === "object" && value?.latitude ? value.latitude : null;
    const longitude =
      typeof value === "object" && value?.longitude ? value.longitude : null;

    const next = { location: locationString, latitude, longitude };
    locationRef.current = next;
    setLocation(locationString);

    if (
      typeof value === "object" &&
      value?.latitude != null &&
      value?.longitude != null
    ) {
      goToRestaurants(next);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!locationRef.current.location?.trim()) return;
    goToRestaurants();
  };

  return (
    <>
      {isLoading && <LoadingScreens />}

      {/* z-30 + overflow-visible so suggestions overlay the Slider below (not trapped / no hero scrollbar) */}
      <section className="relative z-30 h-[90vh] min-h-[600px] flex items-center justify-center pt-20 mb-10 overflow-visible">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Restaurant atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-shipGrey/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-shipGrey/80 via-transparent to-lightGrey" />
        </div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full text-center mt-10 transition-opacity duration-500 ${
            isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-agrandir font-bold text-white mb-4 tracking-tight"
          >
            Reservation Experience Across{" "}
            <span className="text-plum italic font-semibold drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
              <br />
              Multiple 
            </span>{" "}
            Platforms
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 mb-5 max-w-2xl mx-auto font-light font-inter leading-relaxed"
          >
            Find and reserve tables across your favourite dining platforms
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="max-w-xl sm:max-w-2xl mx-auto w-full relative z-[60]"
          >
            <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-stretch bg-white/95 backdrop-blur-sm rounded-2xl p-2 sm:p-1.5 sm:pr-1.5 sm:pl-4 md:pl-5 shadow-2xl border-2 border-white/60 ring-1 ring-plum/15 focus-within:ring-plum/35 transition-shadow overflow-visible">
              <div className="flex flex-1 min-w-0 items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-0">
                <MdLocationOn
                  size={26}
                  color="#9235E2"
                  className="flex-shrink-0 sm:scale-110"
                  aria-hidden
                />
                <div className="flex-1 min-w-0 text-left relative">
                  <GeoApiAuto
                    getLocationData={getLocationData}
                    location={location}
                    placeholder="City, neighborhood, or address"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!location?.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-r-[1rem] sm:rounded-l-none sm:min-h-[3rem] bg-plum text-white font-agrandir font-bold text-sm sm:text-base px-5 py-3 sm:px-6 shadow-md hover:bg-plum/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none sm:shrink-0 w-full sm:w-auto border border-plum/30"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                Search
              </button>
            </div>
            {/* <p className="mt-3 text-xs sm:text-sm text-white/80 font-inter px-1">
              Pick a suggestion or enter a location, then tap Search (or press
              Enter).
            </p> */}
          </motion.form>
        </div>
      </section>
    </>
  );
}
