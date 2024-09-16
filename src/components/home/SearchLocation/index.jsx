import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../HomeAutoComplete";
import TermApiAuto from "../HometermAutoComplete"; 
import axios from "axios";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  // return `${year}-${month}-${day}`;
  return `2024-09-17`;

};



const SearchLocation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: "19:00",
  });

  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [term, setTerm] = useState("");


  const getLocationData = (value) => {
    const parts = value?.split(",");
    const locate = parts[0];
    setFormData((prevData) => ({ ...prevData, location: locate }));
  };

  const handleSearch = () => {
    if (!formData.location) {
      getCurrentLocation();
      return;
    }

    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
    setFormData((prevData) => ({ ...prevData, term: "" }));
  };
    const handleTermChange = (e) => {
    setTerm(e);
    setFormData((prevData) => ({ ...prevData, term: e}));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const location = response.data.address.city || response.data.address.state || "Unknown Location";
            setFormData((prevData) => ({ ...prevData, location }));
            const route = `/restraunts?data=${encodeURIComponent(
              JSON.stringify({ ...formData, location })
            )}`;
            navigate(route);
          } catch (error) {
            console.error("Error getting location name:", error);
            setError("Unable to retrieve location name. Please enter a location manually.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to retrieve your location. Please enter a location manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="mt-2 relative w-full bg-white rounded-full p-2">
            <div
              className={`w-full p-7 text-base md:text-lg text-black rounded-full border-2 ${
                error ? "border-red-500" : "border-gray-200"
              } focus:border-gray-200 focus:outline-none`}
            >
              <GeoApiAuto getLocationData={getLocationData} />
            </div>
          </div>

          <div className="mt-2 relative w-full bg-white rounded-full p-2">
            <div
              className={`w-full p-7 text-base md:text-lg text-black rounded-full border-2 focus:border-red-200 focus:outline-none`}
            >
              <TermApiAuto getTermData={handleTermChange} />
            </div>
          </div>

        </div>

        <div className="flex justify-center mt-4">
          <Button
            className="sm:text-sm md:text-xl sm:py-4 sm:px-6 md:py-7 md:px-12 rounded-full"
            variant="default"
            size="lg"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </>
  );
};

export default SearchLocation;
