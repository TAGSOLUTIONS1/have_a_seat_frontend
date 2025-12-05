import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import useLocation from "@/services/useLocation";
import GeoApiAuto from "@/components/home/HomeAutoComplete";
import { getCurrentDate } from "@/lib/utils";
import TermApiAuto from "@/components/home/HometermAutoComplete";
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";
import LocationTracker from "@/components/LocationTracker";
import { MdLocationOn } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import LoadingScreens from "./LoadingScreens";

export default function Section2() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadInitialFormData = () => {
    const savedData = localStorage.getItem("searchFormData");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }

    return {
      attributes: "reservation",
      reservation_covers: 2,
      persons: 2,
      reservation_date: getCurrentDate(),
      date: getCurrentDate(),
      reservation_time: getCurrentTime(),
      location: "",
      term: "",
      latitude: "",
      longitude: "",
    };
  };

  const [formData, setFormData] = useState(loadInitialFormData);

  const getLocationData = (value) => {
    setFormData((prevData) => {
      const locationString = typeof value === 'string' ? value : value?.location || value;
      const latitude = typeof value === 'object' && value?.latitude ? value.latitude : null;
      const longitude = typeof value === 'object' && value?.longitude ? value.longitude : null;
      
      const updatedData = { 
        ...prevData, 
        location: locationString,
        latitude: latitude || prevData.latitude || "",
        longitude: longitude || prevData.longitude || ""
      };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleSearch = () => {
    setIsLoading(true);
    
    // Navigate immediately - LoadingScreens will continue on restaurants page
    // This provides seamless transition between pages
    let route;
    if (!formData.location) {
      localStorage.setItem(
        "searchFormData",
        JSON.stringify(initialBookingState)
      );
      route = `/restraunts?data=${encodeURIComponent(
        JSON.stringify(initialBookingState)
      )}`;
    } else {
      localStorage.setItem("searchFormData", JSON.stringify(formData));
      route = `/restraunts?data=${encodeURIComponent(
        JSON.stringify(formData)
      )}`;
    }
    
    // Small delay to show loading screen briefly before navigation
    setTimeout(() => {
      navigate(route);
      // Reset loading state after navigation
      setTimeout(() => setIsLoading(false), 100);
    }, 500); // Brief delay for smooth transition
  };

  const handleTermChange = (e) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, term: e };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleLocationUpdate = (location) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, location };
      localStorage.setItem("searchFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <div className="relative w-full min-h-screen" id="section-2">
      {/* Loading Screens Overlay */}
      {isLoading && <LoadingScreens />}

      {/* Main Content */}
      <div className={`relative z-10 transition-opacity duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {/* Header Section with Purple Background */}
        <div className="bg-gradient-to-br from-purple-900 via-plum to-purple-800 py-16 md:py-24 px-5 md:px-10">
          <div className="max-w-6xl mx-auto">
            {/* Title */}
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-14 font-agrandir leading-tight">
              Discover and book the best restaurant
            </h1>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              {/* Mobile Layout */}
              <div className="flex flex-col gap-4 md:hidden">
                {/* Location Input */}
                <div className="flex items-center bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                  <MdLocationOn size={24} color="#9235E2" className="mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <GeoApiAuto
                      getLocationData={getLocationData}
                      location={formData.location}
                    />
                  </div>
                </div>

                {/* Restaurant/Cuisine Input */}
                <div className="flex items-center bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                  <Search size={24} color="#9235E2" className="mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <TermApiAuto getTermData={handleTermChange} />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-plum hover:bg-purple-800 transition-all duration-300 rounded-xl py-4 px-6 text-white font-bold text-lg uppercase tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Location Input */}
                  <div className="flex-1 flex items-center bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <MdLocationOn size={28} color="#9235E2" className="mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <GeoApiAuto
                        getLocationData={getLocationData}
                        location={formData.location}
                      />
                    </div>
                  </div>

                  {/* Restaurant/Cuisine Input */}
                  <div className="flex-1 flex items-center bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <Search size={28} color="#9235E2" className="mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <TermApiAuto getTermData={handleTermChange} />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-plum hover:bg-purple-800 transition-all duration-300 rounded-xl py-5 px-10 text-white font-bold text-xl uppercase tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed mx-auto w-full md:w-auto min-w-[250px]"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Location Tracker */}
              <div className="flex justify-center mt-8">
                <div className="font-pt">
                  {location ? (
                    <LocationTracker
                      handleLocationUpdate={handleLocationUpdate}
                    />
                  ) : (
                    <span className="bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 text-white text-sm font-medium shadow-lg">
                      New York
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Results Section - Placeholder for now */}
        <div className="bg-white py-16 px-5 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 font-agrandir">
              Our best offers
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg md:text-xl mb-4">
                Start your search to discover amazing restaurants
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                We'll show you the best deals and availability across multiple platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

