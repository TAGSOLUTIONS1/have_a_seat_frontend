import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentDate } from "@/lib/utils";
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";
import LoadingScreens from "../Section2/LoadingScreens";

export default function ReserveHero() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleReserveNow = () => {
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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading Screens Overlay */}
      {isLoading && <LoadingScreens />}

      {/* Background Image */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/haveaseatheader1.png"
        alt="Reserve Hero Background"
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-5 transition-opacity duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center">
          {/* Reserve Now Button */}
          <button
            onClick={handleReserveNow}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 transition-all duration-300 px-8 py-4 md:px-10 md:py-5 rounded-lg text-white font-bold text-lg md:text-xl uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Reserve Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

