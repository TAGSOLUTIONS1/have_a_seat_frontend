import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GeoApiAuto from "../HomeAutoComplete";
import * as yup from "yup";

const SearchLocation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    attributes: "reservation",
    reservation_covers: 2,
    persons: 2,
    reservation_date: "2024-01-25",
    date: "2024-01-25",
    reservation_time: "19:00",
  });

  const [error, setError] = useState(null);

  const getLocationData = (value) => {
    const parts = value?.split(",");
    const locate = parts[0];
    setFormData({ ...formData, location: locate });
  };

  const handleSearch = () => {
    if (!formData.location) {
      setError("Location is required");
      return;
    }

    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
    setFormData("");
  };

  return (
    <>
      <div className="mt-2 relative w-full bg-white rounded-full p-2">
        <div
          className={`w-full p-5 text-base md:text-lg text-black rounded-full border-2 ${
            error ? "border-red-500" : "border-gray-200"
          } focus:border-gray-200 focus:outline-none`}
        >
          <GeoApiAuto getLocationData={getLocationData} />
        </div>

        <Button
          className="absolute sm:text-sm md:text-xl sm:py-4 sm:px-6 md:py-7 md:px-12 bottom-6 right-4 -sm:right-4 sm:top-7  md:right-4  md:top-5 lg:right-4 lg:top-5 rounded-full"
          variant="default"
          size="lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </>
  );
};

export default SearchLocation;
