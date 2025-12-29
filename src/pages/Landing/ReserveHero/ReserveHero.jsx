import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentDate } from "@/lib/utils";
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";
import LoadingScreens from "../Section2/LoadingScreens";
import GeoApiAuto from "@/components/home/HomeAutoComplete";
import { MdLocationOn } from "react-icons/md";

export default function ReserveHero() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [locationData, setLocationData] = useState({ location: "", latitude: null, longitude: null });

  const getLocationData = (value) => {
    const locationString = typeof value === 'string' ? value : value?.location || value;
    const latitude = typeof value === 'object' && value?.latitude ? value.latitude : null;
    const longitude = typeof value === 'object' && value?.longitude ? value.longitude : null;
    
    setLocation(locationString);
    // Store location data without navigating
    setLocationData({
      location: locationString,
      latitude: latitude,
      longitude: longitude
    });
  };

  const handleNavigateToRestaurants = () => {
    setIsLoading(true);
    
    // Load saved form data or use initial state
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
    
    // Update location if provided
    if (locationData.location) {
      const firstWord = locationData.location.split(",")[0].trim();
      formData = {
        ...formData,
        location: firstWord,
        latitude: locationData.latitude || formData.latitude || "",
        longitude: locationData.longitude || formData.longitude || "",
      };
    }
    
    // Save form data
    localStorage.setItem("searchFormData", JSON.stringify(formData));
    
    // Navigate to restaurants page with loading screens
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    
    // Small delay to show loading screen briefly before navigation
    setTimeout(() => {
      navigate(route);
      // Reset loading state after navigation
      setTimeout(() => setIsLoading(false), 100);
    }, 500); // Brief delay for smooth transition
  };

  const handleReserveNow = () => {
    handleNavigateToRestaurants();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden mb-10">
      {/* Loading Screens Overlay */}
      {isLoading && <LoadingScreens />}

      {/* Background Image */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/1.png"
        alt="Reserve Hero Background"
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center justify-center text-center px-5 transition-opacity duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

      <div className="text-plum text-4xl -mt-12 sm:text-5xl w-[100%] sm:w-[70%] md:text-5xl lg:text-6xl xl:text-7xl md:w-[50%] font-bold font-agrandir uppercase"> 
          <p>Dine Smarter, Reserve Faster</p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 w-full px-4">
          {/* Location Search Bar */}
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
            <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-2xl border-2 border-white/50 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <MdLocationOn size={28} color="#9235E2" className="mr-3 md:mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <GeoApiAuto
                  getLocationData={getLocationData}
                  location={location}
                />
              </div>
            </div>
          </div>

          {/* Reserve Now Button */}
          <button
            onClick={handleReserveNow}
            disabled={isLoading}
            className="bg-plum hover:bg-purple-800 transition-all duration-300 px-8 py-4 md:px-10 md:py-5 rounded-lg text-white font-bold text-lg md:text-xl uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Reserve Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

